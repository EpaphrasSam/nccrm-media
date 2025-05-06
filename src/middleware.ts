import { auth } from "./utils/auth";

export default auth;

export const config = {
  matcher: [
    // Match all paths except static files, images, and auth endpoints
    "/((?!_next/static|_next/image|images|public|favicon.ico|api/auth|api/health-check|backend).*)",
  ],
};
