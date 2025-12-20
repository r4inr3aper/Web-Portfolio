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

  // Use fuselogo.png for fuzzy search post, default image for others
  const ogImage = post.slug === "making-search-feel-smart-without-ai" 
    ? "https://xbedanta.vercel.app/learnings/fuselogo.png"
    : "https://xbedanta.vercel.app/me.jpeg";

  return {
    title: `${post.title} - Bedanta Kataki`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      url: `https://xbedanta.vercel.app/learnings/${post.slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

export async function generateStaticParams() {
  const slugs = getAllLearningSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}


