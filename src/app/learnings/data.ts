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
    excerpt: "Search doesn't break because data is wrong — it breaks because humans aren't precise. Fuzzy search forgives typos, half-remembered words and imperfect queries. Here's how it actually works.",
    content: `# Making Search Feel Smart (Without AI)

> NOTE: If you just want the code, check out [Fuse.js docs](https://fusejs.io/) or skip to the ==Fuse.js: Practical Fuzzy Search== section. The algorithm deep-dive is optional but worth it if you're curious about how things actually work under the hood.

I learned this while working at a fintech startup: search breaks when it demands perfection. Users search "mutual fand" instead of "mutual fund" and get zero results. They type "mutual fnd" (missing a letter) or "mutual fundd" (extra letter) — and exact matching gives empty output.

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

==It's search with empathy== — understanding that humans make mistakes.

## How Do We Measure "Closeness"?

There's no single best algorithm. It depends on the use case. Here are the ones you actually need to know.

### 1. Hamming Distance

Counts how many characters need to be replaced so that the strings match. ==Simple, but limited==.

\`\`\`
fund → fand  (distance = 1, replace 'u' with 'a')
hello → heppo  (distance = 2, replace first 'l' with 'p' and second 'l' with 'p')
\`\`\`

**Key insight:** ==Lower distance = closer match==. When searching, results with the smallest Hamming distance are ranked highest because they require fewer changes to match.

**Limitation:** works only when both strings are the same length. If lengths differ, Hamming distance doesn't apply.

**Good for:**
- fixed-length IDs (e.g. phone numbers)
- codes (ISBNs, barcodes, error-correcting codes)

### 2. Levenshtein Distance (The Default Choice)

Allows three operations: replace, insert and delete unlike just replace in Hamming distance. ==This is the one you'll actually use==.

\`\`\`
fund → fnd   (distance = 1, delete 'u')
fund → fundd (distance = 1, insert 'd')
fund → fand  (distance = 1, replace 'u' with 'a')
man → human  (distance = 2, insert 'h' and 'u')
kitten → sitting (distance = 3, replace 'k'→'s', 'e'→'i', insert 'g')
\`\`\`

This is what most fuzzy search systems use under the hood. [Wikipedia has a solid explanation](https://en.wikipedia.org/wiki/Levenshtein_distance) if you want the formal definition.

## How Levenshtein Actually Works

You could brute-force all possibilities using recursion and compare all possibilities. That explodes fast — O(3^max(n,m)) bad news.

Instead, we use **Dynamic Programming** (aka the ==Wagner–Fischer algorithm==). This is similar to classic DP problems like [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/description/) — same table-building approach, but for edit distance.

> NOTE: If DP tables make you dizzy, just remember: we're building a 2D cache where each cell stores the minimum edits to match strings up to that point. The bottom-right cell is our answer.

Here's what the DP table looks like when comparing "man" vs "human". The ==green highlights== show the matches (m→m, a→a, n→n) and the bottom-right value of \`2\` is our final answer — it takes 2 edits to transform "man" into "human" (insert "h" and "u" at the start).

![Levenshtein distance DP table showing comparison of man vs human with green highlights indicating matches](/learnings/fuzzy-dp-table.png)

==Reading the table:== Each cell tells you the minimum edits needed to match substrings up to that point. Start from top-left (0), fill row-by-row and the bottom-right cell gives you the answer. The green cells show where characters match — when that happens, you take the diagonal value (no edit needed).

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

Fuzzy search isn't about complex algorithms — it's about ==measuring similarity instead of demanding perfection==. Under the hood, it's Levenshtein distance and a DP table. In practice, it's [Fuse.js](https://fusejs.io/) with a few lines of code.

==Ship fuzzy search early== — it's one of the highest-ROI features you can add. Most products don't need vector search or semantic understanding. They just need to forgive typos and rank results. Let humans be human.

If you want to dive deeper:
- [LeetCode Edit Distance](https://leetcode.com/problems/edit-distance/) — implement Levenshtein yourself
- [Fuse.js documentation](https://fusejs.io/) — production-ready fuzzy search
- [Elasticsearch fuzzy queries](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-fuzzy-query.html) — backend implementation
- [Soundex algorithm](https://en.wikipedia.org/wiki/Soundex) — phonetic matching

> NOTE: Questions or thoughts? Hit me up on [X](https://x.com/bedantaxdev) or [GitHub](https://github.com/r4inr3aper). Always down to nerd out about algorithms and product decisions.

Thanks for reading, see you in the next blog <3`,
    date: "2025-12-20",
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


  