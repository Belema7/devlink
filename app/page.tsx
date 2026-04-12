import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { headers } from "next/headers"
import { auth } from "@/lib/auth"


export default async function Home() {
  const posts = await prisma.post.findMany();

  const session = await auth.api.getSession({
        headers: await headers()
    })


  if(!session) {
        return <div>Not authenticated</div>
    }
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

        <div>
            <h1>Welcome {session.user.name}</h1>
        </div>
    </main>
  );
}

