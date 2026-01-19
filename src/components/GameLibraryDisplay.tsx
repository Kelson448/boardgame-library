import { useGetGames } from "@/queries/games";

export function GameLibraryDisplay() {
  const gamesQuery = useGetGames();

  if (gamesQuery.isLoading) {
    return <div>Loading games...</div>;
  }
  if (gamesQuery.isError) {
    return <div>Error loading games: {String(gamesQuery.error)}</div>;
  }
  const games = gamesQuery.data;

  return <div>There are a total of {games?.length} games in the library.</div>;
}
