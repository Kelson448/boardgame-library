import { useGetGames } from "@/queries/games";
import { Input } from "../ui/input";
import Fuse from "fuse.js";
import { useState, useMemo } from "react";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Pagination, PaginationContent } from "../ui/pagination";
import { GameListTable } from "./GameListTable";

export function GameList() {
  const gamesQuery = useGetGames();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);

  const games = gamesQuery.data;
  const filteredGames = useMemo(() => {
    if (!searchTerm) return games;
    const fuse = new Fuse(games || [], {
      keys: ["name"],
      threshold: 0.3,
    });
    return fuse.search(searchTerm).map((result) => result.item);
  }, [games, searchTerm]);

  if (gamesQuery.isLoading) {
    return <div>Loading games...</div>;
  }
  if (gamesQuery.isError) {
    return <div>Error loading games: {String(gamesQuery.error)}</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />{" "}
        <Checkbox
          checked={showCompleted}
          onClick={() => setShowCompleted(!showCompleted)}
        />{" "}
        Show Completed
      </div>
      <div>Found {filteredGames?.length || 0} games</div>
      <div className="mt-4 space-y-2">
        <GameListTable data={filteredGames || []} />
      </div>
    </div>
  );
}
