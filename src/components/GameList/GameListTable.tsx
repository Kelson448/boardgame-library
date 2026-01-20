import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../ui/data-table";

export type Game = {
  gameid: string;
  name: string;
  completed: boolean;
};

export const columns: ColumnDef<Game>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "completed",
    header: "Completed",
  },
];

export function GameListTable({ data }: { data: Game[] }) {
  return <DataTable columns={columns} data={data} />;
}
