import Anthropic from "@anthropic-ai/sdk";
import { searchMockEvents, getWorldCupEvents } from "@/lib/mockData";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are Jakwara, an AI concierge helping visitors discover events in Atlanta, Georgia during Summer 2026 — the most exciting summer in the city's history, with the FIFA World Cup 2026 bringing 32 nations' fans to Mercedes-Benz Stadium.

Your personality: warm, culturally curious, and deeply knowledgeable about both Atlanta's local culture and the traditions of football-loving nations worldwide.

Your goal: understand where the visitor is from, what they love, and help them find events they'll genuinely connect with. Consider:
- Cultural background and what resonates with their home country
- Football/soccer enthusiasm and World Cup allegiance
- Music, food, art, and entertainment preferences
- Budget and travel dates

When recommending events, explain WHY each event will resonate with them specifically — connect the event to their culture, interests, or nationality. Be specific and personal.

Always use the search_events or get_worldcup_matches tools to find real events rather than inventing them. After getting results, curate and explain the best matches for this specific visitor.

Keep responses conversational and human. You're a knowledgeable local friend, not a search engine.`;

export async function POST(request: Request) {
  const { messages } = await request.json() as { messages: { role: string; content: string }[] };

  const tools: Anthropic.Tool[] = [
    {
      name: "search_events",
      description: "Search Atlanta events by keyword, category, or date. Use this to find events matching the visitor's interests.",
      input_schema: {
        type: "object" as const,
        properties: {
          keyword: { type: "string", description: "Search term — artist name, sport, activity, cuisine, etc." },
          category: { type: "string", description: "Event category: sports, music, arts, food-drink, comedy, community" },
        },
      },
    },
    {
      name: "get_worldcup_matches",
      description: "Get all FIFA World Cup 2026 matches scheduled at Mercedes-Benz Stadium in Atlanta.",
      input_schema: { type: "object" as const, properties: {} },
    },
  ];

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendChunk = (text: string) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
      };

      const claudeMessages: Anthropic.MessageParam[] = messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      let continueLoop = true;
      let currentMessages = [...claudeMessages];

      while (continueLoop) {
        const response = await client.messages.create({
          model: "claude-opus-4-7",
          max_tokens: 2048,
          thinking: { type: "adaptive" },
          system: SYSTEM_PROMPT,
          tools,
          messages: currentMessages,
        });

        let assistantContent = "";

        for (const block of response.content) {
          if (block.type === "text") {
            assistantContent += block.text;
            sendChunk(block.text);
          }
        }

        if (response.stop_reason === "tool_use") {
          const toolUseBlocks = response.content.filter((b) => b.type === "tool_use");
          const toolResults: Anthropic.ToolResultBlockParam[] = [];

          for (const toolUse of toolUseBlocks) {
            if (toolUse.type !== "tool_use") continue;

            let result: string;
            if (toolUse.name === "search_events") {
              const input = toolUse.input as { keyword?: string; category?: string };
              const events = searchMockEvents({ keyword: input.keyword, category: input.category });
              result = JSON.stringify(events.slice(0, 6));
            } else if (toolUse.name === "get_worldcup_matches") {
              const matches = getWorldCupEvents();
              result = JSON.stringify(matches);
            } else {
              result = "[]";
            }

            toolResults.push({
              type: "tool_result",
              tool_use_id: toolUse.id,
              content: result,
            });
          }

          currentMessages = [
            ...currentMessages,
            { role: "assistant", content: response.content },
            { role: "user", content: toolResults },
          ];
        } else {
          continueLoop = false;

          // Send matched event IDs so the UI can render cards
          const allText = currentMessages
            .filter((m) => m.role === "user")
            .map((m) => (typeof m.content === "string" ? m.content : JSON.stringify(m.content)))
            .join(" ");

          const relevantEvents = searchMockEvents({
            keyword: messages[messages.length - 1]?.content,
          }).slice(0, 4);

          if (relevantEvents.length) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ events: relevantEvents })}\n\n`
              )
            );
          }
        }
      }

      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
