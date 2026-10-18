import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'
export const POST = async (request: Request) => { const handler = toNextJsHandler(auth); const response = await handler.POST(request); return Response.redirect(new URL('/login', request.url), response.status === 200 ? 303 : 303) }
