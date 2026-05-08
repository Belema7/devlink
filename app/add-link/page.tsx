import Navbar from "@/components/layout/navbar";
import LinkForm from "@/components/links/link-form";
import { BGPattern } from "@/components/ui/bg-pattern";
import { requireUser } from "@/lib/auth-guard";

const AddLinkPage = async () => {
  await requireUser();

  return (
    <div className="warm-library-theme min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="warm-library-shell relative isolate min-h-screen overflow-hidden px-6 py-14 text-foreground">
        <BGPattern
          aria-hidden="true"
          variant="grid"
          mask="fade-y"
          size={32}
          fill="color-mix(in srgb, var(--primary) 24%, transparent)"
          className="pointer-events-none z-0 opacity-30"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-0 py-0">
          <LinkForm />
        </div>
      </main>
    </div>
  );
};

export default AddLinkPage;
