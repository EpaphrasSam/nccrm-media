import { auth } from "./utils/auth";

export default auth;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|images|public|favicon.ico|api/auth|api/health-check|api/config|backend).*)",
  ],
};
