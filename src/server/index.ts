import { serve } from "bun";
import { Database } from "bun:sqlite";
import index from "@/static/index.html";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/games": {
      async GET(req) {
        let db: Database | null = null;
        try {
          db = new Database("./src/data/boardgame-library.sqlite", { create: false, strict: true });

          const stmt = db.prepare("SELECT gameid, name, completed FROM boardgame");
          const results = stmt.all() as Array<{ gameid: number; name: string; completed: number }>;

          if (!results || results.length === 0) {
            return Response.json([]);
          }
          const games = results.map(game => ({
            gameid: game.gameid,
            name: game.name,
            completed: Boolean(game.completed),
          }));
          return Response.json(games);
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

    "/api/games/:id": {
      async GET(req) {
        let db: Database | null = null;
        try {
          const idParam = req.params.id;
          const id = Number(idParam);
          if (!idParam || Number.isNaN(id)) {
            return new Response(JSON.stringify({ error: 'Invalid id parameter' }), { status: 400 });
          }

          db = new Database("./src/data/boardgame-library.sqlite", { create: false, strict: true });
          const stmt = db.prepare("SELECT gameid, name, completed FROM boardgame WHERE gameid = ?");
          const rows = stmt.all(id) as Array<{ gameid: number; name: string; completed: number | null }>;
          if (!rows || rows.length === 0) {
            return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
          }

          const game = rows[0];
          return Response.json({ gameid: game!.gameid, name: game!.name, completed: Boolean(game!.completed) });
        } catch (err) {
          return new Response(JSON.stringify({ error: String(err), stack: err instanceof Error ? err.stack : null }), { status: 500 });
        } finally {
          if (db) db.close();
        }
      },

      async PATCH(req) {
        let db: Database | null = null;
        try {
          const idParam = req.params.id;
          const id = Number(idParam);
          if (!idParam || Number.isNaN(id)) {
            return new Response(JSON.stringify({ error: 'Invalid id parameter' }), { status: 400 });
          }

          const body = await req.json();
          const completed = body.completed;
          if (typeof completed !== 'boolean') {
            return new Response(JSON.stringify({ error: 'Invalid completed value' }), { status: 400 });
          }

          db = new Database("./src/data/boardgame-library.sqlite", { create: false, strict: true });

          const stmt = db.prepare("UPDATE boardgame SET completed = ? WHERE gameid = ?");
          const result = stmt.run(completed ? 1 : 0, id);

          if (result.changes === 0) {
            return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
          }

          return new Response(null, { status: 204 });

        } catch (err) {
          return new Response(JSON.stringify({ error: String(err), stack: err instanceof Error ? err.stack : null }), { status: 500 });
        } finally {
          if (db) db.close();
        }


        return new Response(JSON.stringify({}),{status: 204});
      }
      
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
