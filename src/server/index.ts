import { serve } from "bun";
import { Database } from "bun:sqlite";
import index from "@/static/index.html";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },

    "/api/games": {
      async GET(req) {
        let db: Database | null = null;
        try {
          db = new Database("./src/data/boardgame-library.sqlite", { create: false, strict: true });

          const stmt = db.prepare("SELECT gameid, name, completed FROM boardgame");
          const results = stmt.all() as Array<{ gameid: number; name: string; completed: boolean }>;

          if (!results || results.length === 0) {
            return Response.json([]);
          }

          return Response.json(results);
        } catch (err) {
          return new Response(JSON.stringify({ error: String(err), stack: err instanceof Error ? err.stack : null }), { status: 500 });
        }
        finally {
          if (db) {
            db.close();
          }
        }
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
