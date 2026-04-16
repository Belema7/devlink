import { Code2 } from "lucide-react";

const footerLinks = [
  { href: "https://github.com", label: "GitHub" },
  { href: "#features", label: "About" },
  { href: "mailto:hello@devlinks.app", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#d8d0bc] bg-[#f6f1e8] py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-[#242220] text-[#f5e27f]">
            <Code2 className="size-5" />
          </span>
          <div>
            <p className="font-semibold text-zinc-900">DevLinks</p>
            <p className="text-sm text-zinc-600">A curated home for developer resources.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm text-zinc-600">
          {footerLinks.map((link) => (
            <a key={link.label} href={link.href} className="transition-colors hover:text-zinc-900">
              {link.label}
            </a>
          ))}
        </div>

        <p className="text-sm text-zinc-500">Copyright {new Date().getFullYear()} DevLinks. All rights reserved.</p>
      </div>
    </footer>
  );
}
