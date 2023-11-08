import { ChatMessage, completeStream } from "@replit/ai-modelfarm";
import { maxOutputTokens, prompts, temperature } from "../config";
import { similaritySearch } from "../lib/utils";

/**
 * Provides model streaming aided by relevant context.
 */
export default async function stream({
  prompt,
  promptKey,
  prev,
}: {
  prompt: string;
  promptKey: keyof typeof prompts;
  prev?: [ChatMessage, ChatMessage];
}) {
  let relevantContext: Array<string> = [];

  try {
    relevantContext = await similaritySearch(prompt);
  } catch (e) {
    console.log(e);
  }

  const fullPrompt = prompts[promptKey](relevantContext, prompt, prev);

  const completionResponse = await completeStream({
    model: "text-bison",
    prompt: fullPrompt,
    maxOutputTokens,
    temperature,
  });

  if (completionResponse.error) {
    throw new Error(
      `Failed to provide modelfarm completion: ${completionResponse.error.message}`,
    );
  }

  const generator = completionResponse.value;

  return generator;
}
