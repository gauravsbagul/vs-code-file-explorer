import { useState } from "react";
import { FilePlus, FolderPlus , FileText, Trash2} from "lucide-react";
import { VSC } from "../App";
import type { ContextMenuOption, ExplorerAction } from "../types";
import { NEW_FILE, NEW_FOLDER, RENAME ,DELETE} from "../constant";

type ContextMenuProps = {
  menuVisible: boolean;
  option: ExplorerAction | null;
  onAddNewFileOrFolder: (option: ExplorerAction) => void;
  onNewFileOrFolderName: (option: ExplorerAction) => void;
  onDeleteFileOrFolder: (option: ExplorerAction) => void;
  position: { x: number; y: number };
};

const MENU_OPTIONS: ContextMenuOption[] = [
  { name: NEW_FILE, isFile: true , icon: <FilePlus style={{ width: 14, height: 14, flexShrink: 0, opacity: 0.8 }} /> },
  { name: NEW_FOLDER, isFile: false, icon: <FolderPlus style={{ width: 14, height: 14, flexShrink: 0, opacity: 0.8 }} /> },
  { name: RENAME, icon: <FileText style={{ width: 14, height: 14, flexShrink: 0, opacity: 0.8 }} /> },
  { name: DELETE, icon: <Trash2 style={{ width: 14, height: 14, flexShrink: 0, opacity: 0.8 }} /> },
];

export const ContextMenu = ({ menuVisible, option, onAddNewFileOrFolder, onNewFileOrFolderName, onDeleteFileOrFolder, position }: ContextMenuProps) => {
  if (!menuVisible || !option) return null;


  const menu = option.isFile ? MENU_OPTIONS.filter((item) => item.name == RENAME || item.name == DELETE) : MENU_OPTIONS;


  const onOptionClick = (item: ContextMenuOption) => {
    if (item.name === RENAME) {
      onNewFileOrFolderName({ ...option, ...item, name: RENAME, currentName: option.parentFolder });
    } else if (item.name === DELETE) {
      onDeleteFileOrFolder({ ...option, ...item, name: DELETE });
    } else {
      onAddNewFileOrFolder({ ...option, ...item, name: item.isFile ? "file" : "folder" });
    }
  }
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
      {menu.map((item) => (
        <ContextMenuItem
          key={item.name}
          label={item.name}
          Icon={item.icon}
          isFile={item.isFile ?? true}
          onClick={()=> onOptionClick( item)}
        />
      ))}
    </div>
  );
};

function ContextMenuItem({ label, isFile, onClick, Icon }: { label: string; isFile: boolean; onClick: () => void; Icon: React.ReactNode }) {
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
      {Icon}
      <span>{label}</span>
    </div>
  );
}
