import type { NextRequest } from 'next/server'
 
export async function GET(_req: NextRequest, ctx: RouteContext<'/api/users/[id]'>) {
  const { id } = await ctx.params
  return Response.json({ id })
}