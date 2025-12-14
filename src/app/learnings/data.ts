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
    title: "Lorem Ipsum Dolor Sit Amet",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    content: `# Lorem Ipsum Dolor Sit Amet

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Duis Aute Irure

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

## Nemo Enim Ipsam

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

- Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet
- Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt
- Ut labore et dolore magnam aliquam quaerat voluptatem

## Ut Enim Ad Minima

Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.

\`\`\`javascript
function loremIpsum() {
  const dolor = "sit amet";
  const consectetur = "adipiscing elit";
  return dolor + " " + consectetur;
}
\`\`\`

## Vel Illum Qui

Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.

Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.

## Conclusion

Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.`,
    date: "2025-01-20",
    readTime: "4 min read",
    category: "Lorem Ipsum",
    slug: "lorem-ipsum-dolor-sit-amet",
  },
];

export function getLearningPostBySlug(slug: string): LearningPost | undefined {
  return learningPosts.find((post) => post.slug === slug);
}

export function getAllLearningSlugs(): string[] {
  return learningPosts.map((post) => post.slug);
}

