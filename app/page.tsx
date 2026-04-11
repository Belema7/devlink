import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";

export default async function Home() {
  const posts = await prisma.post.findMany();
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Posts</h1>
      <ul className="mt-4 space-y-4">
        {posts.map((p) => (
          <li key={p.id} className="p-4 border rounded">
            <strong className="text-lg">{p.title}</strong>
            <p className="text-muted-foreground">{p.content}</p>
          </li>
        ))}
      </ul>
      <Button  variant="secondary" >Click me</Button>
    </main>
  );
}

