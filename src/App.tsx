import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APITester } from "./components/APITester";
import "@/static/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useGetGames } from "./queries/games";
import { GameLibraryDisplay } from "./components/GameLibraryDisplay";
import { GameList } from "./components/GameList/GameList";
import { Toaster } from "./components/ui/sonner";

const queryClient = new QueryClient();
// This code is only for TypeScript
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
  }
}

// // This code is for all users
// window.__TANSTACK_QUERY_CLIENT__ = queryClient;

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto p-8 text-center relative z-10">
        <div className="flex justify-center items-center gap-8 mb-8"></div>
        <Card>
          <CardHeader className="gap-4">
            <CardTitle className="text-3xl font-bold">
              Game Library Tagger
            </CardTitle>
            <CardDescription>
              <GameLibraryDisplay />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* <APITester /> */}
            <GameList />
          </CardContent>
        </Card>
      </div>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
