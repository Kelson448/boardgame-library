import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";
import { Button } from "../ui/button";
import { toast } from "sonner";

export type Game = {
  gameid: number;
  name: string;
  completed: boolean;
};

export const columns: ColumnDef<Game>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <Button
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(
              `https://app.bgstatsapp.com/addPlay.html?gameId=${row.getValue(
                "gameid"
              )}`
            );
            toast.success(
              `Copied link for "${row.getValue("name")}" to clipboard!`
            );
          }}
        >
          {row.getValue("name")}
        </Button>
      );
    },
  },
  {
    accessorKey: "completed",
    header: "Completed",
    cell: ({ row }) => (row.getValue("completed") ? "✅" : "❌"),
  },
];

export function GameListTable({ data }: { data: Game[] }) {
  return <DataTable columns={columns} data={data} />;
}
