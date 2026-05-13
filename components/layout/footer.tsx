import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t-2 border-black bg-white text-black">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-heading text-xl font-black">DevLinks</p>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            Save, organize, and share developer resources.
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase">
          <Link href="/" className="rounded border-2 border-transparent px-3 py-2 hover:border-black hover:bg-muted">
            Home
          </Link>
          <Link href="/feed" className="rounded border-2 border-transparent px-3 py-2 hover:border-black hover:bg-muted">
            Feed
          </Link>
          <Link href="/trending" className="rounded border-2 border-transparent px-3 py-2 hover:border-black hover:bg-muted">
            Trending
          </Link>
          <Link href="/dashboard" className="rounded border-2 border-transparent px-3 py-2 hover:border-black hover:bg-muted">
            Dashboard
          </Link>
        </nav>

        <p className="text-sm font-bold text-muted-foreground">
          (c) {new Date().getFullYear()} DevLinks
        </p>
      </div>
    </footer>
  )
}

export default Footer
