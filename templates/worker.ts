import server from '../dist/server/server.js'

export default {
  async fetch(request: Request, env: { ASSETS: { fetch: (req: Request) => Promise<Response> } }) {
    const url = new URL(request.url)

    // Static asset requests — serve from ASSETS binding
    if (isStaticAsset(url.pathname)) {
      const assetResponse = await env.ASSETS.fetch(request)
      if (assetResponse.status !== 404) return assetResponse
    }

    // Everything else — SSR
    return server.fetch(request)
  },
} satisfies ExportedHandler<{ ASSETS: Fetcher }>

function isStaticAsset(pathname: string): boolean {
  return /\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot|json|webmanifest|txt|xml|map)$/i.test(pathname)
}
