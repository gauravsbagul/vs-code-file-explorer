import { CopyX, XLineTop } from "lucide-react";
import { useState } from "react";
import { CLOSE_ALL, CLOSE_OTHERS, VSC } from "../constant";
import type { ContextMenuOption, ExplorerAction, OpenFile } from "../types";

type ContextMenuProps = {
  menuVisible: boolean;
  fileOption?: OpenFile | null;
  onCloseAll: () => void;
  onCloseOthers: () => void;
  position: { x: number; y: number };
};

const MENU_OPTIONS: ContextMenuOption[] = [
  { name: CLOSE_ALL, icon: <CopyX style={{ width: 14, height: 14, flexShrink: 0, opacity: 0.8 }} /> },
  { name: CLOSE_OTHERS, icon: <XLineTop style={{ width: 14, height: 14, flexShrink: 0, opacity: 0.8 }} /> },
];

export const ContextmenuFileTab = ({ menuVisible, fileOption, onCloseAll, onCloseOthers, position }: ContextMenuProps) => {
  if (!menuVisible) return null;

  const onOptionClick = (item: ContextMenuOption) => {
    if (item.name === CLOSE_ALL) {
      onCloseAll();
    } else if (item.name === CLOSE_OTHERS) {
      onCloseOthers();
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
      {MENU_OPTIONS.map((item) => (
        <ContextMenuItem
          key={item.name}
          label={item.name}
          Icon={item.icon}
          isFile={item.isFile ?? true}
          onClick={() => onOptionClick(item)}
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
