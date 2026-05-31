import { PageTransition } from "@/components/animation/page-transition";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bedanta Kataki - Full Stack AI Engineer Portfolio | Home",
  description: "Welcome to Bedanta Kataki's portfolio. Full Stack AI Engineer and Electronics & Instrumentation student at NIT Silchar. Building RAG pipelines, agentic systems, and modern web apps with TypeScript, Python, LangGraph, and React.",
  keywords: [
    "Bedanta Kataki",
    "Full Stack AI Engineer",
    "AI Engineer",
    "Portfolio",
    "NIT Silchar",
    "TypeScript",
    "LangGraph",
    "RAG",
    "React",
    "Python",
    "Web Development"
  ],
};

export default function Home() {
  return (
    <PageTransition>
      <section className="w-full flex flex-col justify-start p-[0.4rem] mb-8">
        <h2 className="text-xl sm:text-2xl font-medium mb-4">Hello ~</h2>
        <p className="mb-4 text-sm sm:text-base">
          22 y/o semicolon dev trying to build better web interfaces. taught by
          the web itself, I write typescript, I love mern stack but I use the{" "}
          <span className="text-white hover:opacity-80 transition-opacity underline cursor-pointer">
            t3-stack
          </span>{" "}
          ~ cus{" "}
          <span className="text-white hover:opacity-80 transition-opacity underline cursor-pointer">
            theo
          </span>{" "}
          said{" "}
          <mark className="text-[hsla(32,98%,83%,.9)] font- rounded">
            typesafety isn&apos;t optional
          </mark>{" "}
          apparently &amp; btw I don&apos;t use neovim.
        </p>
        <p className="mb-4 text-sm sm:text-base">
          I&apos;m a full stack AI engineer &amp; dev, student at{" "}
          <span className="text-white hover:opacity-80 transition-opacity underline cursor-pointer">
            NIT
          </span>
            , oasis fanboy, technical writer (when inspiration hits), shitposter,
            hackathon grinder and currently on{" "}
            <mark className="text-[hsla(32,98%,83%,.9)] font-normal rounded">
              Leetcode
            </mark>
            {" "} grind too. I can write typescript, python, cpp, and I ship{" "}
          <mark className="text-[hsla(32,98%,83%,.9)] font-normal rounded">
            LLM-powered systems
          </mark>
          : RAG pipelines, knowledge graphs, agent workflows with LangGraph. I enjoy sneaking{" "}
          <mark className="text-[hsla(32,98%,83%,.9)] font-normal rounded">
            GraphQL{" "}
          </mark>{" "}
          into projects whenever I can ~ I just like when things are structured
          but flexible.{" "}
          <mark className="text-[hsla(32,98%,83%,.9)] font-normal rounded">
            System design?{" "}
          </mark>{" "}
          Love it. Nothing beats the thrill of watching complex parts fall into
          place.
        </p>
        <p className="mb-0 text-sm sm:text-base">
          I like minimalism and simplicity and I try to reflect that in my works
          as well. I often jam to music while working. Meaningful and deep
          lyrics is what I look for in songs. My all time fav artist is{" "}
          <span className="text-white hover:opacity-80 transition-opacity underline cursor-pointer">
            Louis Tomlinson
          </span>
          . Apart from this I also like playing FPS games like{" "}
          <span className="text-white hover:opacity-80 transition-opacity underline cursor-pointer">
            VALORANT
          </span>
          , lifting{" "}
          <mark className="text-[hsla(32,98%,83%,.9)] font-normal rounded">
            weights
          </mark>
          , clutching in Table Tennis and binge watching shows on{" "}
          <span className="text-white hover:opacity-80 transition-opacity underline cursor-pointer">
            netflix
          </span>
          .
        </p>
      </section>

      {/* Last Played Section */}
      <div className="w-full h-full mb-8">
        <div
          className="border border-stone-800/90 p-3 rounded-lg flex flex-row justify-between bg-stone-900/20"
          style={{ opacity: 1, transform: "none" }}
        >
          <div className="flex flex-col gap-2 h-20 items-start justify-between">
            <p className="mb-0 leading-none text-xs sm:text-sm text-zinc-500">
              Last played
            </p>
            <p className="mb-0 leading-none text-sm sm:text-base">
              <span className="no-underline text-white hover:opacity-80 transition-opacity cursor-pointer">
                Line Without a Hook // Montgomery Ricky
              </span>
            </p>
          </div>
          <div className="w-20 h-20 bg-zinc-800/50 rounded-md overflow-hidden">
            <Image
              src="https://images.genius.com/c17eacd4676137d5780d7ec97b48d6d1.816x816x1.jpg"
              alt="Album cover"
              width={128}
              height={128}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Social Links Section */}
      <section className="w-full flex flex-col justify-start p-[0.4rem]">
        <h2 className="text-xl sm:text-2xl font-medium mb-6">Find me here ~</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-y-6 gap-x-12">
          <div>
            <p className="mb-2 text-zinc-400 font-medium text-sm">GitHub</p>
            <a
              href="https://github.com/r4inr3aper"
              className="text-white hover:opacity-80 transition-opacity underline"
              target="_blank"
            >
              @r4inr3aper
            </a>
          </div>
          <div>
            <p className="mb-2 text-zinc-400 font-medium text-sm">Leetcode</p>
            <a
              href="https://leetcode.com/u/xbedanta/"
              className="text-white hover:opacity-80 transition-opacity underline"
              target="_blank"
            >
              @xbedanta
            </a>
          </div>
          <div>
            <p className="mb-2 text-zinc-400 font-medium text-sm">
              X (formerly Twitter)
            </p>
            <a
              href="https://x.com/bedantaxdev"
              className="text-white hover:opacity-80 transition-opacity underline"
              target="_blank"
            >
              @bedantaxdev
            </a>
          </div>
          <div>
            <p className="mb-2 text-zinc-400 font-medium text-sm">LinkedIn</p>
            <a
              href="https://www.linkedin.com/in/bedanta-kataki-0b5205257/"
              target="_blank"
              className="text-white hover:opacity-80 transition-opacity underline"
            >
              @bedanta
            </a>
          </div>
          <div>
            <p className="mb-2 text-zinc-400 font-medium text-sm">Email</p>
            <a
              href="mailto:bedanta.074@gmail.com"
              target="_blank"
              className="text-white hover:opacity-80 transition-opacity underline"
            >
              bedanta.074@gmail.com
            </a>
          </div>
          {/* <div>
            <p className="mb-2 text-zinc-400 font-medium text-sm">CV</p>
            <a
              href="https://read.cv/bedanta"
              target="_blank"
              className="text-white hover:opacity-80 transition-opacity underline"
            >
              read.cv/bedanta
            </a>
          </div> */}
        </div>
      </section>
    </PageTransition>
  );
}
