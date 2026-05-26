import Anthropic from "@anthropic-ai/sdk";
import { searchMockEvents, getWorldCupEvents, Event } from "@/lib/mockData";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are Jakwara, Atlanta's expert trip planner for Summer 2026 and the FIFA World Cup 2026. Build a day-by-day itinerary for a visitor based on their profile and travel dates.

Use the search tools to find real events, then construct a logical itinerary that:
- Groups events by day to minimize travel and maximize enjoyment
- Considers World Cup match dates (June–July 2026 at Mercedes-Benz Stadium)
- Mixes event types (sports, culture, food, music) for variety
- Respects the visitor's budget
- Includes practical tips about Atlanta neighborhoods and getting around

Return your response as a JSON object with this exact structure:
{
  "title": "A catchy personalized trip title",
  "overview": "2-3 sentence trip summary connecting to their interests",
  "days": [
    {
      "date": "YYYY-MM-DD",
      "label": "Day 1 — Match Day + Midtown Culture",
      "events": [
        {
          "event_id": "event id from search results",
          "time": "Morning / Afternoon / Evening",
          "note": "One sentence tip or personal connection for this visitor"
        }
      ],
      "local_tip": "One insider tip about this day in Atlanta"
    }
  ],
  "budget_estimate": "Rough total cost range for the full trip"
}

Be practical and specific. Include actual Atlanta neighborhoods, transport tips, and cultural connections.`;

export async function POST(request: Request) {
  const { profile, dates } = await request.json() as {
    profile: {
      name?: string;
      country?: string;
      team?: string;
      interests?: string[];
      budget?: string;
    };
    dates: {
      arrival: string;
      departure: string;
    };
  };

  const tools: Anthropic.Tool[] = [
    {
      name: "search_events",
      description: "Search Atlanta events by keyword or category.",
      input_schema: {
        type: "object" as const,
        properties: {
          keyword: { type: "string", description: "Artist, sport, food, activity" },
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

  const userMessage = `Build a trip itinerary for this visitor:
- Name: ${profile.name ?? "Visitor"}
- Country: ${profile.country ?? "Unknown"}
- Team: ${profile.team ?? "Not specified"}
- Interests: ${profile.interests?.join(", ") ?? "General"}
- Budget: ${profile.budget ?? "Moderate"}
- Arrival: ${dates.arrival}
- Departure: ${dates.departure}

Search for events that fit within their travel window and build a day-by-day plan. Include World Cup matches if available during their visit.`;

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
          max_tokens: 3000,
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
              result = JSON.stringify(events.slice(0, 8));
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

          try {
            const jsonMatch = textContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]) as {
                title: string;
                overview: string;
                budget_estimate: string;
                days: {
                  date: string;
                  label: string;
                  local_tip: string;
                  events: { event_id: string; time: string; note: string }[];
                }[];
              };

              const uniqueEvents = Array.from(
                new Map(collectedEvents.map((e) => [e.id, e])).values()
              );

              const enrichedDays = parsed.days.map((day) => ({
                ...day,
                events: day.events.map((ev) => ({
                  ...ev,
                  event: uniqueEvents.find((e) => e.id === ev.event_id) ?? null,
                })),
              }));

              send({
                title: parsed.title,
                overview: parsed.overview,
                budget_estimate: parsed.budget_estimate,
                days: enrichedDays,
              });
            } else {
              send({ error: "Could not parse itinerary" });
            }
          } catch {
            send({ error: "Failed to generate itinerary" });
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
