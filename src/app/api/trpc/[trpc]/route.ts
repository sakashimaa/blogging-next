import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers/_app";

// If you need context (auth, headers), extend createContext accordingly.
function createContext() {
  return {};
}

const handler = async (req: Request) => {
  try {
    console.log('tRPC request received:', req.method, req.url);
    
    return fetchRequestHandler({
      endpoint: '/api/trpc',
      req,
      router: appRouter,
      createContext,
      onError: ({ error, path }) => {
        console.error('tRPC error on path:', path);
        console.error('Error details:', error);
      },
    });
  } catch (error) {
    console.error('Handler error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

export { handler as GET, handler as POST };
