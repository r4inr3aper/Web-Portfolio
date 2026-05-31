export interface LearningPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
}

export const learningPosts: LearningPost[] = [
  {
    id: 1,
    title: "Making Search Feel Smart (Without AI)",
    excerpt: "Search doesn't break because data is wrong â€” it breaks because humans aren't precise. Fuzzy search forgives typos, half-remembered words and imperfect queries. Here's how it actually works.",
    content: `# Making Search Feel Smart (Without AI)

> NOTE: If you just want the code, check out [Fuse.js docs](https://fusejs.io/) or skip to the ==Fuse.js: Practical Fuzzy Search== section. The algorithm deep-dive is optional but worth it if you're curious about how things actually work under the hood.

I learned this while working at a fintech startup: search breaks when it demands perfection. Users search "mutual fand" instead of "mutual fund" and get zero results. They type "mutual fnd" (missing a letter) or "mutual fundd" (extra letter) â€” and exact matching gives empty output.

Fuzzy search fixes this by measuring similarity instead of exact matches. It forgives typos, handles partial words and ranks results by how close they are. Here's how it actually works.

## What Is Fuzzy Search?

**The core idea:** Instead of asking "Do these strings match exactly?", fuzzy search asks ==**"How similar are these strings?"**== 

Once you can measure similarity, you can:
- Rank results by how close they are (best matches first)
- Forgive typos and misspellings
- Handle partial matches ("fund" matches "funds")

**What the output looks like:**

When you search "mutual fand" (typo), fuzzy search returns ranked results:

\`\`\`
Query: "mutual fand"

Results (ranked by similarity):
1. "Mutual Fund" (distance: 1, closest match)
2. "Mutual Funds" (distance: 2)
3. "Mutual Fund Index" (distance: 3)
\`\`\`

Instead of zero results, you get matches ordered by how close they are to your query. ==The best match appears first==, even with typos.

==It's search with empathy== â€” understanding that humans make mistakes.

## How Do We Measure "Closeness"?

There's no single best algorithm. It depends on the use case. Here are the ones you actually need to know.

### 1. Hamming Distance

Counts how many characters need to be replaced so that the strings match. ==Simple, but limited==.

\`\`\`
fund â†’ fand  (distance = 1, replace 'u' with 'a')
hello â†’ heppo  (distance = 2, replace first 'l' with 'p' and second 'l' with 'p')
\`\`\`

**Key insight:** ==Lower distance = closer match==. When searching, results with the smallest Hamming distance are ranked highest because they require fewer changes to match.

**Limitation:** works only when both strings are the same length. If lengths differ, Hamming distance doesn't apply.

**Good for:**
- fixed-length IDs (e.g. phone numbers)
- codes (ISBNs, barcodes, error-correcting codes)

### 2. Levenshtein Distance (The Default Choice)

Allows three operations: replace, insert and delete unlike just replace in Hamming distance. ==This is the one you'll actually use==.

\`\`\`
fund â†’ fnd   (distance = 1, delete 'u')
fund â†’ fundd (distance = 1, insert 'd')
fund â†’ fand  (distance = 1, replace 'u' with 'a')
man â†’ human  (distance = 2, insert 'h' and 'u')
kitten â†’ sitting (distance = 3, replace 'k'â†’'s', 'e'â†’'i', insert 'g')
\`\`\`

This is what most fuzzy search systems use under the hood. [Wikipedia has a solid explanation](https://en.wikipedia.org/wiki/Levenshtein_distance) if you want the formal definition.

## How Levenshtein Actually Works

You could brute-force all possibilities using recursion and compare all possibilities. That explodes fast â€” O(3^max(n,m)) bad news.

Instead, we use **Dynamic Programming** (aka the ==Wagnerâ€“Fischer algorithm==). This is similar to classic DP problems like [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/description/) â€” same table-building approach, but for edit distance.

> NOTE: If DP tables make you dizzy, just remember: we're building a 2D cache where each cell stores the minimum edits to match strings up to that point. The bottom-right cell is our answer.

Here's what the DP table looks like when comparing "man" vs "human". The ==green highlights== show the matches (mâ†’m, aâ†’a, nâ†’n) and the bottom-right value of \`2\` is our final answer â€” it takes 2 edits to transform "man" into "human" (insert "h" and "u" at the start).

![Levenshtein distance DP table showing comparison of man vs human with green highlights indicating matches](/learnings/fuzzy-dp-table.png)

==Reading the table:== Each cell tells you the minimum edits needed to match substrings up to that point. Start from top-left (0), fill row-by-row and the bottom-right cell gives you the answer. The green cells show where characters match â€” when that happens, you take the diagonal value (no edit needed).

**The Algorithm:**

\`\`\`cpp
int levenshteinDistance(const string& str1, const string& str2) {
  int m = str1.length();
  int n = str2.length();
  vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

  // Base cases
  for (int i = 0; i <= m; i++) dp[i][0] = i;
  for (int j = 0; j <= n; j++) dp[0][j] = j;

  // Fill the DP table
  for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
      if (str1[i - 1] == str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]; // match
      } else {
        dp[i][j] = min({
          dp[i - 1][j] + 1,     // delete
          dp[i][j - 1] + 1,     // insert
          dp[i - 1][j - 1] + 1  // replace
        });
      }
    }
  }

  return dp[m][n];
}
\`\`\`

**How it works:**
- Build a 2D table where rows = string A, columns = string B
- Each cell = minimum edits so far
- Moves: top â†’ delete, left â†’ insert, diagonal â†’ replace/match
- ==Bottom-right cell = our answer==

Time complexity: **O(n Ã— m)** â€” ==fast enough for real products==. For reference, matching two 50-char strings takes ~2500 operations. Negligible on modern hardware.

> NOTE: Want to visualize it? [This interactive demo](http://www.let.rug.nl/kleiweg/lev/) shows the DP table being built step-by-step. Worth 2 minutes to really grok it.

## Other Distance Methods

Along with Hamming and Levenshtein, there are other approaches:

- [Longest Common Substring](https://leetcode.com/problems/longest-common-substring/) â€” useful when you care about ==contiguous matches==
- Letter Frequency Matching â€” good for ==anagram-like matching==
- Phonetic matching (e.g., [Soundex](https://en.wikipedia.org/wiki/Soundex)) â€” matches ==sounds-alike== words ("Smith" â‰ˆ "Smyth")

They all solve the same problem â€” ==string similarity== â€” using different heuristics depending on context. Most products stick with Levenshtein because it's ==predictable and works well enough==.

## Fuse.js: Practical Fuzzy Search

In frontend-heavy apps, you usually don't reinvent this. ==Just use [Fuse.js](https://fusejs.io/)==. It's battle-tested, fast and handles all the edge cases.

**Basic Setup:**

\`\`\`javascript
import Fuse from 'fuse.js';

const options = {
  keys: ['title', 'description'],
  threshold: 0.4,  // 0 = exact match, 1 = match anything
  includeScore: true,
  minMatchCharLength: 2
};

const fuse = new Fuse(items, options);
const results = fuse.search('fuzzy query');
\`\`\`

**What actually matters when configuring it:**

\`\`\`javascript
{
  threshold: 0.4,        // ==how forgiving search is== (0-1)
  caseSensitive: false,  // usually keep this false
  keys: ['title', 'name'], // ==which fields matter more==
  tokenize: true,        // splits queries into tokens
  ignoreLocation: false  // whether position matters
}
\`\`\`

Internally, it's still string matching â€” just wrapped in ==good defaults and ranking logic==.

> NOTE: The \`threshold\` is the most important knob. Start with 0.4 and adjust based on user feedback. Lower = stricter, higher = more forgiving. I've shipped products with 0.3 (strict) and 0.6 (very forgiving) depending on the use case.

I usually wrap Fuse.js in a small helper so the rest of the app doesn't care how search works:

\`\`\`javascript
// searchHelper.js
export function createSearch(items) {
  const fuse = new Fuse(items, {
    keys: ['title', 'description'],
    threshold: 0.4
  });

  return (query) => {
    if (!query) return items;
    return fuse.search(query).map(result => result.item);
  };
}
\`\`\`

==Abstracting search logic== makes it easy to swap implementations later (e.g., move to backend search).

## From DP Tables to Vectors

Conceptually:
- DP tables are 2D
- Modern systems turn strings into ==vectors== (embeddings)
- Similarity becomes ==distance in high-dimensional space==

![2D and 3D approach to processing - from DP tables to vector embeddings](/learnings/2D+3Dapproach.png)

That's how fuzzy search quietly evolves into:
- ==vector search== (e.g., [Pinecone](https://www.pinecone.io/), [Qdrant](https://qdrant.tech/))
- embeddings (e.g., [OpenAI embeddings](https://platform.openai.com/docs/guides/embeddings))
- ==semantic search== (understands meaning, not just characters)

> NOTE: Don't jump to vector search unless you actually need it. For most apps, ==Levenshtein/Fuse.js is enough==. Vector search adds latency, cost (embedding API calls) and complexity. Ship fuzzy first, upgrade if users need semantic understanding. ==Vector search is commonly used in RAG (Retrieval-Augmented Generation) systems== where you need to find semantically similar documents/context, not just typo-tolerant string matching.

## The MVP Footnote

If your dataset is huge: ==**Don't do fuzzy search on the frontend.**== You'll block the UI and regret it.

**Frontend fuzzy search is great for:**
- ==small lists (< 1000 items)==
- filters (e.g., dropdown autocomplete)
- ==instant feedback== (no network roundtrip)

**For large datasets:**
- move it to the backend (Elasticsearch, Algolia, Typesense)
- ==index aggressively== (precompute distances if possible)
- consider ==debouncing/throttling== if users type fast

## Conclusion

Fuzzy search isn't about complex algorithms â€” it's about ==measuring similarity instead of demanding perfection==. Under the hood, it's Levenshtein distance and a DP table. In practice, it's [Fuse.js](https://fusejs.io/) with a few lines of code.

==Ship fuzzy search early== â€” it's one of the highest-ROI features you can add. Most products don't need vector search or semantic understanding. They just need to forgive typos and rank results. Let humans be human.

If you want to dive deeper:
- [LeetCode Edit Distance](https://leetcode.com/problems/edit-distance/) â€” implement Levenshtein yourself
- [Fuse.js documentation](https://fusejs.io/) â€” production-ready fuzzy search
- [Elasticsearch fuzzy queries](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-fuzzy-query.html) â€” backend implementation
- [Soundex algorithm](https://en.wikipedia.org/wiki/Soundex) â€” phonetic matching

> NOTE: Questions or thoughts? Hit me up on [X](https://x.com/bedantaxdev) or [GitHub](https://github.com/r4inr3aper). Always down to nerd out about algorithms and product decisions.

Thanks for reading, see you in the next blog <3`,
    date: "2025-12-20",
    readTime: "6 min read",
    category: "Web Development",
    slug: "making-search-feel-smart-without-ai",
  },
  {
    id: 2,
    title: "Mapping the RAG Iceberg",
    excerpt:
      "RAG isn't one pipeline anymore. It's an entire design space — from basic retrieval to self-correcting, agentic systems. This post walks through that landscape using a simple iceberg mental model.",
    content: `# Mapping the RAG Iceberg

I built my first RAG pipeline in a weekend. It worked on the demo. It fell apart in production.

The queries were slightly off. The chunks were too broad. The model hallucinated with full confidence. I thought I'd done something wrong but it turns out, I'd just hit the ceiling of basic RAG.

That weekend sent me down a rabbit hole I still haven't fully climbed out of.

> I used to think RAG was simple. ==retrieve → prompt → answer==
> You embed the query, pull the most relevant chunks from a vector database and send them to the model. Done.
> Then I started reading papers. Hybrid RAG. Self-RAG. CRAG. RAPTOR. Agentic RAG.
> At first it felt like the AI community was inventing a new acronym every week.
> But after digging deeper I realized something:
> ==Almost all of them exist for the same reason.==
> Basic RAG breaks in predictable ways.

Once you see those failure modes, the whole landscape starts making sense.

This post is my attempt to map that iceberg.

![RAG iceberg showing simple RAG at the top and more complex architectures deeper below the surface](/iceberg.png)

## Why Basic RAG Breaks

A basic RAG pipeline looks like this:

\`\`\`flow
User question → Embed query → Vector search → Top-k chunks → LLM answer
\`\`\`

This works surprisingly well.

If you're building:
- FAQ bots
- documentation assistants
- product help centers

Basic RAG can get you 80% of the way there.

But it has one fundamental weakness:

> ==**Basic RAG trusts retrieval blindly.**==

If the retrieval step is wrong, everything after it is wrong.

And retrieval fails more often than you might expect.

Here's how it looks end-to-end:

![Basic RAG pipeline — query goes in, vector search finds relevant chunks, LLM generates a grounded answer](/basicrag.png)
*A basic RAG pipeline: the user query is embedded, matched against a vector store, and the top-k chunks are passed as context before the LLM generates a response.*

### Failure Mode #1: Retrieval Misses the Right Document

Vector search is great at semantic similarity.

But it struggles with:
- exact error codes
- API names
- legal IDs
- unusual tokens

**Example:**

You ask:

*"How do I fix ERR_CONN_RESET_547?"*

Your documentation contains the exact error code.

But embeddings don't understand random strings very well.

So the system retrieves something like:

*"Troubleshooting connection errors"*

Close — but not helpful.

This is where Hybrid RAG comes in.

## Fix #1: Better Retrieval

**Hybrid RAG** combines two retrieval methods:

- **Vector search** (semantic similarity)
- **+**
- **Keyword search** (BM25)

Vector search understands meaning.

Keyword search catches exact matches.

The system merges both results and reranks them.

Now error codes, IDs, and API names stop slipping through the cracks.

Result: ==you get the "fuzzy understanding" of vectors *and* the precision of keyword search==.

---

### Failure Mode #2: The Answer Needs Multiple Facts

Some questions can't be answered from a single document.

**Example:**

*"Who founded the company that created ChatGPT?"*

You need two facts:

1. ChatGPT → created by OpenAI
2. OpenAI → founders

Basic RAG retrieves once and stops.

So it often misses the second piece.

## Fix #2: Multi-Step Retrieval

Instead of retrieving once, the system retrieves in steps:

\`\`\`flow
Query → Retrieve → Reason about results → Retrieve again
\`\`\`

Now the system can connect facts across documents.

This idea appears in many forms:
- **Multi-Hop RAG** — each hop is driven by what the previous hop returned
- **Iterative RAG** — retrieve, generate a partial answer, identify gaps, retrieve again
- **Reasoning-driven retrieval** — use the model's reasoning to decide what to fetch next

But the core idea is simple:

==retrieval becomes a loop instead of a single step.==

---

### Failure Mode #3: Retrieval Looks Fine But the Answer Is Still Wrong

This is the sneaky one.

The retrieved documents are ==technically relevant==.

But the model answers confidently anyway — using slightly wrong chunks — and you have no idea.

Basic RAG has no self-check.

It doesn't ask: *"Are these chunks actually useful for this question?"*

It just answers.

## Fix #3: Systems That Question Retrieval

**Self-RAG** lets the model evaluate its own retrieval:

1. Retrieve documents
2. Have the model **score / critique** them — *"Is this actually relevant?"*
3. Optionally **re-retrieve** or expand the search
4. Then answer

So retrieval isn't "fire once and pray" — it becomes ==reflective and adaptive==.

**CRAG (Corrective RAG)** goes further.

If the retrieved documents are off-topic, low quality, or missing key facts — CRAG:
- detects the failure
- **corrects the retrieval step**: reformulates the query, changes the source, or tries another index

Think of it as a ==safety net== layered on top of naive RAG.

---

### Failure Mode #4: Knowledge Doesn't Live in Flat Chunks

Most RAG systems chop documents into flat, fixed-size chunks.

But knowledge isn't flat.

A research paper has:
- an abstract (high-level summary)
- sections (mid-level structure)
- paragraphs and tables (fine-grained details)

When you chop it into uniform chunks, you lose the structure.

And retrieving a random paragraph without its surrounding context often gives the model ==incomplete or misleading information==.

## Fix #4: Systems That Think Like Agents

**RAPTOR** stores documents in a **tree** instead of flat chunks:
- higher levels → summaries of bigger sections
- lower levels → fine-grained details

At query time:
- retrieve from the top first (high-level summaries)
- follow relevant branches down to details only when needed

This gives you more structured retrieval and less noise in the prompt.

**Graph RAG** goes even further — it builds a **knowledge graph**:
- nodes → entities (people, companies, papers, APIs)
- edges → relationships (founded, acquired, depends on, mentions)

Retrieval becomes: "walk the graph along relevant edges" — collecting context that is ==structurally related==, not just semantically close.

This shines in complex research, multi-entity reasoning, and anything that looks like traversing a network of facts.

---

### Failure Mode #5: The Problem Is Too Complex for a Single Pipeline

Some tasks can't be solved with a fixed retrieve → answer loop.

**Example:**

*"Compare the refund policies of these three vendors, check if any conflict with EU consumer law, and summarize the risks."*

You need to:
1. retrieve from multiple sources
2. reason across them
3. possibly call external tools
4. synthesize a structured answer

A single pipeline can't handle this. It needs ==planning==.

And that's where the iceberg goes very deep.

**Agentic RAG** uses agents that can:
- retrieve
- reason
- plan
- call tools / APIs
- loop until a goal is satisfied

For example, an agentic RAG system might:
1. Read your question
2. Plan a sequence of steps
3. Call a search tool multiple times
4. Call a calculator or code executor
5. Stitch together a final answer with citations

It feels less like "one LLM call" and more like ==a small team of specialists working together==.

---

## The Deep End

At the very bottom of the iceberg, RAG stops being a component bolted on top of a model.

**REALM** and similar ideas **train the model *with* retrieval from the start**:
- the retriever is part of the model
- training updates **both**: language modeling + retrieval

This means the model learns *how to look things up* as part of its training objective.

Retrieval isn't an afterthought — ==it's baked into how the model thinks==.

## The Big Insight: RAG Is a Design Space

What surprised me while exploring these systems is that **RAG is not a single technique**.

It's a **design space**.

Every layer of the iceberg is a targeted fix for a specific failure mode:

| Problem | Fix |
|---|---|
| Embeddings miss exact keywords | Hybrid RAG |
| Answer needs multiple facts | Multi-Hop / Iterative RAG |
| Retrieval looks fine but answers are wrong | Self-RAG, CRAG |
| Knowledge doesn't live in flat chunks | RAPTOR, Graph RAG |
| Task needs planning | Agentic RAG |
| Retrieval should be part of training | REALM |

Once you see the iceberg, you stop asking *"Should I use RAG?"* and start asking:

==**"Which layer of the iceberg do I actually need for this problem?"**==

## Conclusion

The RAG universe is evolving fast — new architectures appear almost every month.

But they're not random.

They're all responses to the same thing: ==basic RAG breaks in predictable ways==.

Once you internalize the failure modes, the whole landscape makes sense.

My takeaway if you're building with RAG today:
- **Start at the surface.** Basic RAG is often enough.
- **Only dive deeper when you hit a real failure mode.** Not because a paper looks cool.
- **Name the problem before you pick the fix.**

And if you find a new layer of the iceberg I missed, I'd love to hear about it.

> NOTE: Questions or thoughts? Hit me up on [X](https://x.com/bedantaxdev) or [GitHub](https://github.com/r4inr3aper). Always down to talk about AI systems and how they actually work under the hood.

Thanks for reading, see you in the next blog <3`,
    date: "2026-03-09",
    readTime: "8 min read",
    category: "AI / ML",
    slug: "i-tried-to-map-the-rag-iceberg",
  },
];

export function getLearningPostBySlug(slug: string): LearningPost | undefined {
  return learningPosts.find((post) => post.slug === slug);
}

export function getAllLearningSlugs(): string[] {
  return learningPosts.map((post) => post.slug);
}


  