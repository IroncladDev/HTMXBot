# Hyperdome

Hyperdome, short for Hypermedia Thunderdome is an HTMX chatbot application familiarized with HTMX, Hyperscript, tweets, memes, and lore.

- Live Demo: 🔗 https://h-t.mx
- Fork on Github 🐱: https://github.com/IroncladDev/HTMXBot
- Run on Replit: ⠕ https://replit.com/@IroncladDev/HTMXBot?v=1

Hyperdome uses Google's [`text-bison`](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/text) and [`textembedding-gecko`](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/text-embeddings) models over [Replit Modelfarm](https://blog.replit.com/modelfarm).

## Development
**Important Note**: Hyperdome will **not** work on your local machine. Replit Modelfarm only works on Replit as of November 2023.

Modelfarm allows you to use AI without configuring any environment variables exclusively within the Replit workspace. If you want to use a different IDE, refer to Replit's [SSH Documentation](https://docs.replit.com/power-ups/ssh).

### Database & Context
Hyperdome uses [Supabase PGVector](https://supabase.com/docs/guides/database/extensions/pgvector) for context/embeddings. 

Create a [new Supabase project](https://supabase.com/dashboard/projects).

Configure a table `documents` as shown in [this article](https://supabase.com/blog/openai-embeddings-postgres-vector#:~:text=not%20using%20Python%3F-,Using%20PostgreSQL,-Enter%20pgvector%2C%20an):

<details>
  <summary>Copypasta Insanity</summary>
  
  (Just copy and paste all the code snippets into the SQL editor and run them)

  > ...
  >
  > First we'll enable the **Vector** extension. In Supabase, this can be done from the web portal through `Database` → `Extensions`. You can also do this in SQL by running:
  > ```sql
  > create extension vector;
  > ```
  >
  > Next let's create a table to store our documents and their embeddings:
  >
  > ```sql
  > create table documents (
  >   id bigserial primary key,
  >   content text,
  >   embedding vector(1536)
  > );
  > ```
  >
  > `pgvector` introduces a new data type called `vector`. In the code above, we create a column named `embedding` with the `vector` data type. The size of the vector defines how many dimensions the vector holds. OpenAI's `text-embedding-ada-002` model outputs 1536 dimensions, so we will use that for our vector size.
  >
  > ...
  >
  > Soon we're going to need to perform a similarity search over these embeddings. Let's create a function to do that:
  >
  > ```sql
  > create or replace function match_documents (
  >   query_embedding vector(1536),
  >   match_threshold float,
  >   match_count int
  > )
  > returns table (
  >   id bigint,
  >   content text,
  >   similarity float
  > )
  > language sql stable
  > as $$
  >   select
  >     documents.id,
  >     documents.content,
  >     1 - (documents.embedding <=> query_embedding) as similarity
  >   from documents
  >   where 1 - (documents.embedding <=> query_embedding) > match_threshold
  >   order by similarity desc
  >   limit match_count;
  > $$;
  > ```
  >
  > ...
  >
  > Once your table starts to grow with embeddings, you will likely want to add an index to speed up queries. Vector indexes are particularly important when you're ordering results because vectors are not grouped by similarity, so finding the closest by sequential scan is a resource-intensive operation.
  >
  > Each distance operator requires a different type of index. We expect to order by cosine distance, so we need `vector_cosine_ops` index. A good starting number of lists is 4 * sqrt(table_rows):
  >
  > ```sql
  > create index on documents using ivfflat (embedding vector_cosine_ops)
  > with
  >   (lists = 100);
  > ```
</details>

After your Supabase PGVector Setup, fill out the following environment variables with your Supabase DB credentials:

- `SUPABASE_DB_URL` - Supabase database URL (`https://aaa...a.supabase.co`)
- `SUPABASE_SERVICE_ROLE` - Supabase Admin Service Role (`eyJhbGciOi...`)
- `SUPABASE_ANON_KEY` - Supabase Anonymous Public Key (`eyJhbGciOi...`)

If you've chosen a different table name than `documents` and/or a different postgres function name than `match_documents`, you can configure the table/function names with the following environment variables:

- `DOC_TABLE_NAME`
- `DOC_MATCH_QUERY`

### Customizing Context
All markdown, text, .d.ts, and Javascript files in the `context` folder get split into chunks for future index.

To add and test out the bot with additional context, add/edit the desired content to the `context` folder and run `bun run init-vectors`.

### Running
- Run `bun install` to install necessary dependencies
- Run `bun run init-vectors` to populate the database with the context
- Run `bun run dev` to start the development server

### Deploying
- Run `bun run build` followed by `bun src/index.ts` to serve the production version.

## Configuration
You can configure elements such as Model Temperature, Prompts, and more in `src/config.ts`.

- `expectedDimentions` - Max number of vector dimensions
- `contextChunkSize` - Max number of characters a chunk of context can be (used in `init-vectors` script)
- `maxInputTokens` - Max number of tokens in the base prompt
- `maxOutputTokens` - Max number of tokens that can be in the text output
- `temperature` - Model Temperature
- `maxChunks` - Number of context chunks to fetch when performing a similarity search
- `prompts` - Prompt preset instructions
- `promptAuthors` - Prompt preset metadata
- `allowedTags` - Allowed HTML tags over Markdown
- `tableConfig` - Configurable via environment variables; the names of the PGVector table / match function

## Contributing
It's a challenge to constantly keep the HTMX Lore, Trends, and HTMX/Hyperscript knowledge up-to-date.  Contributions are welcome and will be greatly appreciated.

Some simple contribution rules:
- Use common sense. Nonsense PRs will be closed.
- Thoroughly test your PRs if they introduce any technical changes and provide a test plan
- Provide sources/links if you create a PR to update the context
- Feel free to attach memes to your PRs