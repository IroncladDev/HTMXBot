import { staticPlugin } from "@elysiajs/static";
import { ChatMessage } from "@replit/ai-modelfarm";
import { Elysia } from "elysia";
import { stream } from "./completions";
import { prompts } from "./config";
import emptyState from "./hypermedia/emptyState";
import History from "./hypermedia/history";
import invalidState from "./hypermedia/invalidState";
import Message from "./hypermedia/message";

interface IncomingMessage {
  HEADERS: {
    "HX-Current-URL": string;
    "HX-Request": string;
    "HX-Target": string;
    "HX-Trigger": string;
    "HX-Trigger-Name": string | null;
  };
  prompt: string;
  history: string;
  promptKey: keyof typeof prompts;
}

const generateId = () => "m-" + Math.random().toString(36).slice(2);

export type Msg = ChatMessage & { id: string };

const app = new Elysia()
  .use(staticPlugin())
  .get("/", () => Bun.file("public/index.html"))
  .get("/chat", () => Bun.file("public/chat.html"))
  .get("/loadHistory", (req) => {
    if (
      !req.query.history ||
      typeof req.query.history !== "string" ||
      (typeof req.query.history === "string" && req.query.history.length === 0)
    )
      return emptyState;

    const hist = new History();

    // Attempt to parse/decode history
    try {
      hist.decode(req.query.history);
    } catch (err) {
      console.log(err);
      return invalidState;
    }

    try {
      return hist.history.map((m) => new Message(m).render({})).join("\n\n");
    } catch (err) {
      console.log(err);
      return invalidState;
    }
  })
  .ws("/stream", {
    async message(ws, input) {
      const { history, prompt, promptKey } = input as IncomingMessage;

      // Handle error if prompt isn't provided
      if (!prompt || typeof prompt !== "string") {
        return ws.send(
          Message.renderMultiple([
            new Message({
              author: "htmxOrg",
              content: "Invalid Prompt Provided",
              id: "",
            }).render({
              swapOob: true,
            }),
          ]),
        );
      }

      // Message provided by the human
      const humanMessage: Msg = {
        author: "Human",
        content: prompt,
        id: generateId(),
      };

      // If no prompt key is provided
      if (
        !promptKey ||
        typeof promptKey !== "string" ||
        !(promptKey in prompts)
      ) {
        return ws.send(
          Message.renderMultiple([
            new Message(humanMessage).render(),
            new Message({
              author: "htmxOrg",
              content: "Invalid Prompt Key Provided",
              id: generateId(),
            }).render({
              swapOob: true,
            }),
          ]),
        );
      }

      const hist = new History();

      // Attempt to parse/decode history
      try {
        hist.decode(history);
      } catch (err) {
        console.log(err);
        return ws.send(
          Message.renderMultiple([
            new Message(humanMessage).render(),
            new Message({
              author: "htmxOrg",
              content: "Could not decode conversation history",
              id: generateId(),
            }).render({
              swapOob: true,
            }),
          ]),
        );
      }

      // Fetch last two messages, if any
      const prev = hist.prev();

      // Append the human message to history
      hist.append(humanMessage);

      // AI message
      const aiMessageId = generateId();
      const aiMessage: Msg = {
        author: promptKey,
        content: "",
        id: aiMessageId,
      };

      // Send the blank AI message followed by the user message
      ws.send(
        Message.renderMultiple([
          new Message(humanMessage).render(),
          new Message(aiMessage).render({
            swapOob: true,
          }),
        ]),
      );

      // Initialize the asyncIterator
      const generator = await stream({
        prompt,
        promptKey,
        prev,
      });

      // Start streaming
      try {
        for await (const message of generator) {
          aiMessage.content += decodeURIComponent(
            JSON.parse(`"${message.completion}"`),
          );
          ws.send(new Message(aiMessage).render({ swapOob: true }));
        }
      } catch (err) {
        console.log("Stream Buffered", (err as any).message);
      }

      // Append the complete AI message to history
      hist.append(aiMessage);

      console.log(hist.history);

      // Send the full history hidden input
      ws.send(hist.render());
    },
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
