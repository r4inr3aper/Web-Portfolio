import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Bedanta Kataki - Full Stack Developer Portfolio",
  description: "Bedanta Kataki is a Full Stack Developer and Computer Science student at NIT Silchar. Specializing in TypeScript, React, Node.js, and modern web technologies. View projects, experience, and contact information.",
  keywords: [
    "Bedanta Kataki",
    "Full Stack Developer",
    "TypeScript Developer",
    "React Developer",
    "Node.js Developer",
    "Web Developer",
    "NIT Silchar",
    "Portfolio",
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "MERN Stack",
    "T3 Stack",
    "GraphQL",
    "System Design"
  ],
  authors: [{ name: "Bedanta Kataki" }],
  creator: "Bedanta Kataki",
  publisher: "Bedanta Kataki",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://xbedanta.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Bedanta Kataki - Full Stack Developer Portfolio",
    description: "Full Stack Developer and Electronics & Instrumentation student at NIT Silchar. Specializing in TypeScript, React, Node.js, and modern web technologies.",
    url: 'https://xbedanta.vercel.app',
    siteName: 'Bedanta Kataki Portfolio',
    images: [
      {
        url: 'https://images.genius.com/c17eacd4676137d5780d7ec97b48d6d1.816x816x1.jpg',
        width: 1200,
        height: 630,
        alt: 'Bedanta Kataki - Full Stack Developer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Bedanta Kataki - Full Stack Developer Portfolio",
    description: "Full Stack Developer and Electronics & Instrumentation student at NIT Silchar. Specializing in TypeScript, React, Node.js, and modern web technologies.",
    images: ['https://images.genius.com/c17eacd4676137d5780d7ec97b48d6d1.816x816x1.jpg'],
    creator: '@bedantaxdev',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://xbedanta.vercel.app" />
        <meta name="author" content="Bedanta Kataki" />
        <meta name="robots" content="index, follow" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Bedanta Kataki",
              "jobTitle": "Full Stack Developer",
              "description": "Full Stack Developer and Electronics & Instrumentation student at NIT Silchar",
              "url": "https://xbedanta.vercel.app",
              "image": "https://xbedanta.vercel.app/me.jpeg",
              "email": "bedanta.074@gmail.com",
              "alumniOf": {
                "@type": "CollegeOrUniversity",
                "name": "National Institute of Technology, Silchar"
              },
              "knowsAbout": [
                "TypeScript",
                "React",
                "Node.js",
                "Full Stack Development",
                "Web Development",
                "System Design",
                "GraphQL",
                "MERN Stack"
              ],
              "sameAs": [
                "https://github.com/r4inr3aper",
                "https://leetcode.com/u/xbedanta/",
                "https://x.com/bedantaxdev",
                "https://www.linkedin.com/in/bedanta-kataki-0b5205257/"
              ]
            })
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col items-center justify-between">
        <main className="p-4 py-24 gap-6 w-full lg:w-[55%]">
          <Header />
          <div className="flex flex-col gap-12 w-full h-full">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
