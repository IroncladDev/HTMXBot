import { embed } from "@replit/ai-modelfarm";
import GPT3NodeTokenizer from "gpt3-tokenizer";
import { expectedDimensions, maxInputTokens } from "../config";
import { client } from "./supabase";

/**
 * Constrains an embedding's dimensions to the value of `expectedDimensions`.
 * @param {number[]} embedding - An array of numbers representing the embedding.
 */
export function padEmbedding(embedding: number[]) {
  const currentDimensions: number = embedding.length;

  if (currentDimensions < expectedDimensions) {
    // Padding with zeros
    embedding = embedding.concat(
      Array(expectedDimensions - currentDimensions).fill(0),
    );
  } else if (currentDimensions > expectedDimensions) {
    // Truncate or resize embedding
    embedding = embedding.slice(0, expectedDimensions);
  }

  return embedding;
}

/**
 * Executes a vector similarity search with the given `query`.
 * @param {string} query - The prompt input/query
 */
export async function similaritySearch(query: string) {
  const { error: embeddingError, value } = await embed({
    model: "textembedding-gecko",
    content: [query],
  });

  if (embeddingError) {
    throw new Error(
      `Failed to initialize vectors with status code ${embeddingError.statusCode}: ${embeddingError.message}`,
    );
  }

  const paddedEmbedding = padEmbedding(value.embeddings[0].values);

  const { data, error } = await client.rpc("match_htmx_docs", {
    query_embedding: paddedEmbedding,
    match_threshold: 0,
    match_count: 5,
  });

  if (error) {
    throw new Error(`Failed to match documents: ${error.message}`);
  }

  const tokenizer = new GPT3NodeTokenizer({ type: "gpt3" });
  const relevantContext: Array<string> = [];

  let tokenCount = 0;

  for (const { content } of data) {
    const encoded = tokenizer.encode(content);

    tokenCount += encoded.text.length;

    if (tokenCount >= maxInputTokens) {
      break;
    }

    relevantContext.push(content.trim());
  }

  return relevantContext;
}

/**
 * Splits an Array into chunks of size `n`.
 * @param {Array} array - The Array to split
 * @param {number} n - The chunk size
 */
export function chunkArray<T>(array: Array<T>, n: number) {
  let chunked = [];
  for (let i = 0; i < array.length; i += n) {
    chunked.push(array.slice(i, i + n));
  }
  return chunked;
}
