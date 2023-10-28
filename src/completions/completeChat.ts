import { chat, ChatMessage } from "@replit/ai-modelfarm";
import { maxOutputTokens, prompts, temperature } from "../config";
import { similaritySearch } from "../lib/utils";

/**
 * Provides chat completion aided by relevant context.
 * Requires at least one message, and then provides autocompletion based on the last one.
 */
export default async function completeChat({
  messages,
  promptKey,
}: {
  messages: Array<ChatMessage>;
  promptKey: keyof typeof prompts;
}) {
  if (messages.length < 1) {
    throw new Error("`completeChat` requries at least one chat message");
  }

  // @ts-expect-error `messages` must be of at least length 1
  const lastMessageContent: string = messages.at(-1)?.content;

  const relevantContext = await similaritySearch(lastMessageContent);

  const completionResponse = await chat({
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

  return completionResponse.value.message;
}
