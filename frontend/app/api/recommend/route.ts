import Anthropic from "@anthropic-ai/sdk";
import { searchMockEvents, getWorldCupEvents, Event } from "@/lib/mockData";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are Jakwara, an expert Atlanta event concierge for Summer 2026. Based on a visitor's profile, generate a curated list of personalized event recommendations.

Always use the provided tools to search for real events. After searching, select the best matches and explain WHY each one fits this specific visitor — connect recommendations to their nationality, cultural interests, music taste, food preferences, and World Cup allegiance.

Return your response as a JSON object with this exact structure:
{
  "greeting": "A warm, personalized one-sentence greeting addressing them by name if given",
  "summary": "2-3 sentence overview of why these events are perfect for them",
  "recommendations": [
    {
      "event_id": "the event id from search results",
      "reason": "2-3 sentences explaining why THIS specific person will love this event — reference their nationality, interests, or team"
    }
  ]
}

Be specific and personal. A visitor from Brazil who loves samba should hear about music connecting to their culture. A family from Japan should hear about accessibility and cultural exhibits.`;

export async function POST(request: Request) {
  const { profile } = await request.json() as {
    profile: {
      name?: string;
      country?: string;
      team?: string;
      interests?: string[];
      budget?: string;
      travelDates?: string;
    };
  };

  const tools: Anthropic.Tool[] = [
    {
      name: "search_events",
      description: "Search Atlanta events by keyword or category.",
      input_schema: {
        type: "object" as const,
        properties: {
          keyword: { type: "string", description: "Artist, sport, activity, cuisine, cultural term" },
          category: { type: "string", description: "sports, music, arts, food-drink, comedy, community" },
        },
      },
    },
    {
      name: "get_worldcup_matches",
      description: "Get FIFA World Cup 2026 matches at Mercedes-Benz Stadium in Atlanta.",
      input_schema: { type: "object" as const, properties: {} },
    },
  ];

  const userMessage = `Please recommend events for this visitor:
- Name: ${profile.name ?? "Visitor"}
- Country: ${profile.country ?? "Unknown"}
- Favorite team: ${profile.team ?? "Not specified"}
- Interests: ${profile.interests?.join(", ") ?? "General sightseeing"}
- Budget: ${profile.budget ?? "Flexible"}
- Travel dates: ${profile.travelDates ?? "Summer 2026"}

Search for events matching their interests and World Cup allegiance, then give me a personalized JSON recommendation.`;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const messages: Anthropic.MessageParam[] = [{ role: "user", content: userMessage }];
      let continueLoop = true;
      const collectedEvents: Event[] = [];

      while (continueLoop) {
        const response = await client.messages.create({
          model: "claude-opus-4-7",
          max_tokens: 2048,
          thinking: { type: "adaptive" },
          system: SYSTEM_PROMPT,
          tools,
          messages,
        });

        let textContent = "";
        for (const block of response.content) {
          if (block.type === "text") textContent += block.text;
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
              collectedEvents.push(...events);
              result = JSON.stringify(events.slice(0, 6));
            } else if (toolUse.name === "get_worldcup_matches") {
              const matches = getWorldCupEvents();
              collectedEvents.push(...matches);
              result = JSON.stringify(matches);
            } else {
              result = "[]";
            }

            toolResults.push({ type: "tool_result", tool_use_id: toolUse.id, content: result });
          }

          messages.push(
            { role: "assistant", content: response.content },
            { role: "user", content: toolResults }
          );
        } else {
          continueLoop = false;

          // Parse the JSON response from Claude
          try {
            const jsonMatch = textContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]) as {
                greeting: string;
                summary: string;
                recommendations: { event_id: string; reason: string }[];
              };

              // Attach full event objects to each recommendation
              const uniqueEvents = Array.from(
                new Map(collectedEvents.map((e) => [e.id, e])).values()
              );

              const enriched = parsed.recommendations.map((rec) => ({
                ...rec,
                event: uniqueEvents.find((e) => e.id === rec.event_id) ?? null,
              }));

              send({ greeting: parsed.greeting, summary: parsed.summary, recommendations: enriched });
            } else {
              send({ error: "Could not parse recommendations" });
            }
          } catch {
            send({ error: "Failed to generate recommendations" });
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
