import {
  clerkMiddleware,
  createRouteMatcher
} from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/',
  '/profile',
  // '/api/assistant/create',
  '/api/assistant',
  '/api/assistant/thread',
  '/api/assistant/message/create',
  '/api/assistant/message/list',
  '/api/assistant/run/create',
  '/api/assistant/run/retrieve',
  '/api/challengeUpdate',
  '/api/challengeUpdate',




]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};