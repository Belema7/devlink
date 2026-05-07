import { NextResponse, type NextRequest } from "next/server";

const HOME_PATH = "/";
const SESSION_ENDPOINT = "/api/auth/get-session";

type SessionResponse = {
  user?: {
    id: string;
  };
};

async function isAuthenticated(request: NextRequest) {
  try {
    const sessionResponse = await fetch(new URL(SESSION_ENDPOINT, request.url), {
      method: "GET",
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    });

    if (!sessionResponse.ok) {
      return false;
    }

    const session = (await sessionResponse.json()) as SessionResponse | null;
    return !!session?.user?.id;
  } catch (error) {
    console.error("Auth proxy session check failed:", error);
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const authenticated = await isAuthenticated(request);

  if (authenticated) {
    return NextResponse.next();
  }

  const loginUrl = new URL(HOME_PATH, request.url);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/add-link/:path*", "/edit-link/:path*", "/dashboard", "/trending"],
};
