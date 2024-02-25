import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";

type LeaderboardColumn = {
  id: string;
  name: string;
  points: string;
};
const column: ColumnDef<LeaderboardColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "points",
    header: "Points",
  },
];
const Leaderboard = ({ leaderboard }: { leaderboard: any }) => {
  return (
    <>
      <div className="flex flex-col p-[40px]">
        <DataTable columns={column} data={leaderboard} />
      </div>{" "}
    </>
  );
};

export default Leaderboard;
