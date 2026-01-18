import { useQuery } from "@tanstack/react-query";


export function useGetGames() {
  return useQuery({
    queryKey: ["games"],
    staleTime: Infinity,
    queryFn: async () => {
      const response = await fetch("/api/games");
      if (!response.ok) {
        throw new Error(`Error fetching games: ${response.statusText}`);
      }
      return response.json() as Promise<Array<{ gameid: number; name: string; completed: boolean }>>;
    },
  });
  
}