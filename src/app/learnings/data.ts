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
    excerpt: "Search doesn't break because data is wrong — it breaks because humans aren't precise. Fuzzy search forgives typos, half-remembered words, and imperfect queries. Here's how it actually works.",
    content: `# Making Search Feel Smart (Without AI)

> NOTE: If you just want the code, check out [Fuse.js docs](https://fusejs.io/) or skip to the ==Fuse.js: Practical Fuzzy Search== section. The algorithm deep-dive is optional but worth it if you're curious about how things actually work under the hood.

I learned this while working at a fintech startup: search doesn't break because data is wrong — it breaks because ==humans aren't precise==. This problem is everywhere, from e-commerce search to code autocomplete.

Users misspell fund names.
They remember half the word.
They type vibes, not syntax.

Exact search fails.
==Fuzzy search forgives==.

## What Is Fuzzy Search?

Fuzzy search is essentially ==string matching with tolerance==. It searches for text that matches approximately, not exactly.

The only question that matters is: **How close are two strings?**

Once you can measure closeness, search stops being a filter and becomes ==a ranking problem==. This is where it gets interesting.

## How Do We Measure "Closeness"?

There's no single best algorithm. It depends on the use case. Here are the ones you actually need to know.

### 1. Hamming Distance

Counts how many characters need to be replaced. ==Simple, but limited==.

\`\`\`
fund → fand  (distance = 1)
\`\`\`

**Limitation:** works only when both strings are the same length.

**Good for:**
- fixed-length IDs
- codes (ISBNs, barcodes)

### 2. Levenshtein Distance (The Default Choice)

Allows three operations: replace, insert, and delete. ==This is the one you'll actually use==.

\`\`\`
fund → fnd   (delete)
fund → fundd (insert)
fund → fand  (replace)
\`\`\`

This is what most fuzzy search systems use under the hood. [Wikipedia has a solid explanation](https://en.wikipedia.org/wiki/Levenshtein_distance) if you want the formal definition.

## How Levenshtein Actually Works

You could brute-force all possibilities using recursion. ==That explodes fast== — O(3^max(n,m)) bad news.

Instead, we use **Dynamic Programming** (aka the ==Wagner–Fischer algorithm==). This is similar to classic DP problems like [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/) — same table-building approach, but for edit distance.

> NOTE: If DP tables make you dizzy, just remember: we're building a 2D cache where each cell stores the minimum edits to match strings up to that point. The bottom-right cell is our answer.

**The Algorithm:**

\`\`\`javascript
function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  // Base cases
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  // Fill the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]; // match
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,     // delete
          dp[i][j - 1] + 1,     // insert
          dp[i - 1][j - 1] + 1  // replace
        );
      }
    }
  }

  return dp[m][n];
}
\`\`\`

**How it works:**
- Build a 2D table where rows = string A, columns = string B
- Each cell = minimum edits so far
- Moves: top → delete, left → insert, diagonal → replace/match
- ==Bottom-right cell = our answer==

Time complexity: **O(n × m)** — ==fast enough for real products==. For reference, matching two 50-char strings takes ~2500 operations. Negligible on modern hardware.

> NOTE: Want to visualize it? [This interactive demo](http://www.let.rug.nl/kleiweg/lev/) shows the DP table being built step-by-step. Worth 2 minutes to really grok it.

## Other Distance Methods

Along with Hamming and Levenshtein, there are other approaches:

- [Longest Common Substring](https://leetcode.com/problems/longest-common-substring/) — useful when you care about ==contiguous matches==
- Letter Frequency Matching — good for ==anagram-like matching==
- Phonetic matching (e.g., [Soundex](https://en.wikipedia.org/wiki/Soundex)) — matches ==sounds-alike== words ("Smith" ≈ "Smyth")

They all solve the same problem — ==string similarity== — using different heuristics depending on context. Most products stick with Levenshtein because it's ==predictable and works well enough==.

## Fuse.js: Practical Fuzzy Search

In frontend-heavy apps, you usually don't reinvent this. ==Just use [Fuse.js](https://fusejs.io/)==. It's battle-tested, fast, and handles all the edge cases.

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

Internally, it's still string matching — just wrapped in ==good defaults and ranking logic==.

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

That's how fuzzy search quietly evolves into:
- ==vector search== (e.g., [Pinecone](https://www.pinecone.io/), [Qdrant](https://qdrant.tech/))
- embeddings (e.g., [OpenAI embeddings](https://platform.openai.com/docs/guides/embeddings))
- ==semantic search== (understands meaning, not just characters)

Same idea. ==Bigger math==. If you're dealing with semantic similarity (not just typos), check out [this comparison](https://www.pinecone.io/learn/vector-search/).

> NOTE: Don't jump to vector search unless you actually need it. For most apps, ==Levenshtein/Fuse.js is enough==. Vector search adds latency, cost (embedding API calls), and complexity. Ship fuzzy first, upgrade if users need semantic understanding.

## A Startup Footnote

If your dataset is huge: ==**Don't do fuzzy search on the frontend.**== You'll block the UI and regret it.

**Frontend fuzzy search is great for:**
- ==small lists (< 1000 items)==
- filters (e.g., dropdown autocomplete)
- ==instant feedback== (no network roundtrip)

**For large datasets:**
- move it to the backend (Elasticsearch, Algolia, Typesense)
- ==index aggressively== (precompute distances if possible)
- consider ==debouncing/throttling== if users type fast

> NOTE: I've seen teams try to fuzzy search 10k+ items client-side. Don't. Even with web workers, it's janky. [Algolia](https://www.algolia.com/) and [Typesense](https://typesense.org/) are solid hosted options. [Meilisearch](https://www.meilisearch.com/) is self-hosted and open-source. All support fuzzy search out of the box.

## The Real Takeaway

Fuzzy search isn't AI. ==It's empathy==.

You're telling your system: *"Users won't be perfect — and that's fine."*

That single decision ==improves UX more than most features==. Shipping fuzzy search in week 2 instead of week 10 can make the difference between users loving your product and abandoning it.

## Closing

Most products don't need more intelligence. ==They need more tolerance==.

Fuzzy search is one of the ==highest-ROI features== you can ship early — especially in fintech, where nobody remembers exact fund names, or e-commerce where people search for "blue jacket" instead of "navy denim outerwear".

Ship forgiveness. Rank results. ==Let humans be human==.

## Conclusion

Overall, I really like how fuzzy search makes products feel ==more human and forgiving==. I'm planning to explore more search and ranking algorithms in future posts — ==term frequency, BM25, and hybrid search== are next on my list.

If you want to dive deeper:
- [LeetCode Edit Distance](https://leetcode.com/problems/edit-distance/) — implement Levenshtein yourself
- [Fuse.js documentation](https://fusejs.io/) — production-ready fuzzy search
- [Elasticsearch fuzzy queries](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-fuzzy-query.html) — backend implementation
- [Soundex algorithm](https://en.wikipedia.org/wiki/Soundex) — phonetic matching

> NOTE: Want to chat about search? Hit me up on [X](https://x.com/bedantaxdev) or [GitHub](https://github.com/r4inr3aper). Always down to nerd out about algorithms and product decisions.

Thanks for reading, see you in the next blog <3`,
    date: "2025-01-20",
    readTime: "6 min read",
    category: "Web Development",
    slug: "making-search-feel-smart-without-ai",
  },
];

export function getLearningPostBySlug(slug: string): LearningPost | undefined {
  return learningPosts.find((post) => post.slug === slug);
}

export function getAllLearningSlugs(): string[] {
  return learningPosts.map((post) => post.slug);
}


