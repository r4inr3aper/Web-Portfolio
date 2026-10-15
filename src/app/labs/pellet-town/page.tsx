import { PageTransition } from "@/components/animation/page-transition";
import { PelletTownGame } from "@/features/pellet-town/pellet-town-game";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pellet Town Secret Lab",
  description: "A hidden playable map from Bedanta's college experiments.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PelletTownPage() {
  return (
    <PageTransition>
      <section className="mb-6">
        <p className="mb-2 text-xs uppercase tracking-[0.28em] text-zinc-400">Interactive Resume Beta</p>
        <h1 className="mb-3 text-2xl sm:text-3xl">Pellet Town // Build Mode</h1>
        <p className="text-sm text-zinc-300 sm:text-base">
          I built this game out of curiosity in college, then integrated it here as an interactive portfolio map. Explore, inspect terminals, then route to contact.
        </p>
      </section>

      <PelletTownGame />
    </PageTransition>
  );
}
