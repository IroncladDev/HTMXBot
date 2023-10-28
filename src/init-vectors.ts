import { embed } from "@replit/ai-modelfarm";
import fs from "fs";
import { globSync } from "glob";
import { contextChunkSize } from "./config";
import supabase from "./lib/supabase";
import { chunkArray, padEmbedding } from "./lib/utils";

/**
 * Indexes the `context` folder at root level, splits it into chunks
 * Converts the chunks into vector embeddings and stores them in the Supabase DB
 * Wipes the DB before populating it each time.
 *
 * Should be run when you update data in the `context` folder.
 */

/**
 * Splits a string into paragraph groups. If a paragraph exceeds the length of `n`, pushes the whole paragraph. Otherwise, combines paragraphs separated by breaklines not exceeding a length of `n`.
 * @param {string} text - the document to split
 * @param {number} n - maximum chunk length
 */
function textSplitter(text: string, n: number) {
  const paragraphs = text.split("\n\n");
  const chunks: Array<string> = [];

  let currentChunk: Array<string> = [];

  for (const paragraph of paragraphs) {
    const l = currentChunk.join("\n\n").length;
    if (l + paragraph.length <= n) {
      currentChunk.push(paragraph);
    } else if (paragraph.length > n) {
      chunks.push(currentChunk.join("\n\n"));
      currentChunk = [paragraph];
    } else {
      chunks.push(currentChunk.join("\n\n"));
      currentChunk = [paragraph];
    }
  }

  return chunks.filter((x) => x.length > 0);
}

/**
 * Fetches all Markdown and Text files in the `context` folder located at root level.
 * Splits each file into an array of strings not exceeding `chunkSize`
 */
function getDataChunks() {
  const files = globSync("context/**/*.{md,txt,html,js,csv,d.ts}");

  const chunks: Array<string> = [];

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");

    chunks.push(...textSplitter(content, contextChunkSize));
  }

  return chunks;
}

/**
 * Saves an array of chunks into the Supabase DB.
 */
async function embedDataChunks(
  chunks: Array<string>,
  progress: number,
  total: number,
) {
  const embeddings = await embed({
    model: "textembedding-gecko",
    content: chunks,
  });

  if (embeddings.error) {
    throw new Error(
      `Failed to initialize vectors with status code ${embeddings.error.statusCode}: ${embeddings.error.message}`,
    );
  }

  const embeddingDocuments = embeddings.value.embeddings.map(
    ({ values }, i) => {
      return {
        embedding: padEmbedding(values),
        content: chunks[i],
      };
    },
  );

  // Insert updated embedding documents into the database
  await supabase.from("htmx_docs").insert(embeddingDocuments);

  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(
    `Embedding data... (${progress + 1}/${total}) (${(
      ((progress + 1) / total) *
      100
    ).toFixed(2)}%)`,
  );
}

/**
 * Deletes all rows in the `documents` table and re-populates it with the updated vector embeddings.
 */
async function initializeVectors() {
  // Retrieves context chunks from the `context` folder
  const content = getDataChunks();

  console.log(`Retrieved ${content.length} chunks of context data.`);

  // Remove existing context documents from the database table
  await supabase.from("htmx_docs").delete().neq("id", 0);

  console.log("Wiped database.");

  const contextChunks = chunkArray(content, 5);

  for (var i = 0; i < contextChunks.length; i++) {
    await embedDataChunks(contextChunks[i], i, contextChunks.length);
  }
}

await initializeVectors();

console.log("Ready to roll");
