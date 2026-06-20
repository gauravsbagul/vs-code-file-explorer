import { useState } from "react";
import { FilePlus, FolderPlus } from "lucide-react";
import { VSC } from "../App";
import type { ContextMenuOption, ExplorerAction } from "../types";

type ContextMenuProps = {
  menuVisible: boolean;
  option: ExplorerAction | null;
  onAddNewFileOrFolder: (option: ExplorerAction) => void;
  position: { x: number; y: number };
};

const MENU_OPTIONS: ContextMenuOption[] = [
  { name: "New File...", isFile: true },
  { name: "New Folder...", isFile: false },
];

export const ContextMenu = ({ menuVisible, option, onAddNewFileOrFolder, position }: ContextMenuProps) => {
  if (!menuVisible || !option) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: position.y, left: position.x,
        zIndex: 9999,
        backgroundColor: "#252526",
        border: `1px solid #454545`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.6)",
        minWidth: 200,
        padding: "4px 0",
      }}
    >
      {MENU_OPTIONS.map((item) => (
        <ContextMenuItem
          key={item.name}
          label={item.name}
          isFile={item.isFile ?? true}
          onClick={() => onAddNewFileOrFolder({ ...option, ...item, name: item.isFile ? "file" : "folder" })}
        />
      ))}
    </div>
  );
};

function ContextMenuItem({ label, isFile, onClick }: { label: string; isFile: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      role="menuitem"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        height: 26, paddingLeft: 8, paddingRight: 16,
        cursor: "pointer", fontSize: 13,
        color: VSC.fg,
        backgroundColor: hovered ? VSC.accent : "transparent",
        userSelect: "none",
      }}
    >
      {isFile
        ? <FilePlus style={{ width: 14, height: 14, flexShrink: 0, opacity: 0.8 }} />
        : <FolderPlus style={{ width: 14, height: 14, flexShrink: 0, opacity: 0.8 }} />}
      <span>{label}</span>
    </div>
  );
}
