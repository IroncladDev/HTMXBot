import { completeStream } from "@replit/ai-modelfarm";
import { maxOutputTokens, prompts, temperature } from "../config";
import { similaritySearch } from "../lib/utils";

/**
 * Provides model streaming aided by relevant context.
 */
export default async function stream({
  prompt,
  onCompletionStream,
  promptKey,
}: {
  prompt: string;
  onCompletionStream: (completion: string) => void;
  promptKey: keyof typeof prompts;
}) {
  const relevantContext = await similaritySearch(prompt);

  const completionResponse = await completeStream({
    model: "text-bison",
    prompt: prompts[promptKey](relevantContext, prompt),
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
      onCompletionStream(chunk.completion);
      out += chunk.completion;
    }
  } catch (error) {
    console.error("An error occurred while iterating:", error);
  }

  return out;
}
