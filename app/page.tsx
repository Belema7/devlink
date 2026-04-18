import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getPublicLinks } from "@/lib/public-links";
import Navbar from "@/components/layout/navbar";
import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import HowItWorks from "@/components/home/how-it-works";
import FeedPreview from "@/components/home/feed-preview";
import Trending from "@/components/home/trending";
import DeveloperFeatures from "@/components/home/developer-features";
import CTA from "@/components/home/cta";
import Footer from "@/components/home/footer";

export const metadata: Metadata = {
  title: "DevLinks",
  description: "Save, organize, and share developer resources effortlessly.",
};

const Home = async () => {
  const [session, publicLinks] = await Promise.all([
    auth.api.getSession({
      headers: await headers(),
    }),
    getPublicLinks(),
  ]);

  const isSignedIn = Boolean(session?.user);
  const topVoteCount = publicLinks[0]?.voteCount ?? 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4">
        <Hero
          isSignedIn={isSignedIn}
          publicCount={publicLinks.length}
          tagCount={new Set(publicLinks.flatMap((link) => link.tags.map((tag) => tag.name))).size}
          topVoteCount={topVoteCount}
        />
        <Features />
        <HowItWorks />
        <FeedPreview links={publicLinks} />
        <Trending links={publicLinks} />
        <DeveloperFeatures />
        <CTA isSignedIn={isSignedIn} />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
