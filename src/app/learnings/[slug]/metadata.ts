import type { Metadata } from "next";
import { getLearningPostBySlug, getAllLearningSlugs } from "../data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getLearningPostBySlug(slug);

  if (!post) {
    return {
      title: "Learning Not Found - Bedanta Kataki",
    };
  }

  return {
    title: `${post.title} - Bedanta Kataki`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      url: `https://xbedanta.vercel.app/learnings/${post.slug}`,
    },
  };
}

export async function generateStaticParams() {
  const slugs = getAllLearningSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}


