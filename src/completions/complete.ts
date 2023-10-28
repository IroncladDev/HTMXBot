import { complete as modelfarmComplete } from "@replit/ai-modelfarm";
import { maxOutputTokens, prompts, temperature } from "../config";
import { similaritySearch } from "../lib/utils";

/**
 * Provides model completion aided by relevant context.
 */
export default async function complete({
  prompt,
  promptKey,
}: {
  prompt: string;
  promptKey: keyof typeof prompts;
}) {
  const relevantContext = await similaritySearch(prompt);

  const completionResponse = await modelfarmComplete({
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

  return completionResponse.value.completion;
}
