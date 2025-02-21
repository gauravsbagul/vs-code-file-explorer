import React from "react";
import { FileExplorer } from "../container/FileExplorer";

export const Folder = ({ name }) => {
  console.log("name", name);
  return (
    <div style={{ height: 30, maring: 5, backgroundColor: "#ccc" }}>{name}</div>
  );
};
