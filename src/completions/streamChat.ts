import { ChatMessage, chatStream } from "@replit/ai-modelfarm";
import { maxOutputTokens, prompts, temperature } from "../config";
import { similaritySearch } from "../lib/utils";

/**
 * Provides chat streaming aided by relevant context.
 */
export default async function streamChat({
  messages,
  onChatStream,
  promptKey,
}: {
  messages: Array<ChatMessage>;
  onChatStream: (completion: ChatMessage) => void;
  promptKey: keyof typeof prompts;
}) {
  if (messages.length < 1) {
    throw new Error("`completeChat` requries at least one chat message");
  }

  // @ts-expect-error `messages` must be of at least length 1
  const lastMessageContent: string = messages.at(-1)?.content;

  const relevantContext = await similaritySearch(lastMessageContent);

  const completionResponse = await chatStream({
    model: "chat-bison",
    messages,
    context: prompts[promptKey](relevantContext, lastMessageContent),
    maxOutputTokens,
    temperature,
  });

  if (completionResponse.error) {
    throw new Error(
      `Failed to provide modelfarm completion: ${completionResponse.error.message}`,
    );
  }

  const generator = completionResponse.value;

  let out = "";

  try {
    for await (const chunk of generator) {
      onChatStream(chunk.message);
      out += chunk.message;
    }
  } catch (error) {
    console.error("An error occurred while iterating:", error);
  }

  return out;
}
