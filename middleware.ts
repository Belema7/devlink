import { NextResponse, type NextRequest } from "next/server";

const LOGIN_PATH = "/login";
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
    console.error("Auth middleware session check failed:", error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const authenticated = await isAuthenticated(request);

  if (authenticated) {
    return NextResponse.next();
  }

  const loginUrl = new URL(LOGIN_PATH, request.url);
  loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname + request.nextUrl.search);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/links/:path*", "/profile/:path*", "/tags/:path*"],
};
