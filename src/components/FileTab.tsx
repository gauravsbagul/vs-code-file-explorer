
import { X } from "lucide-react";
import type { MouseEvent } from "react";
import { useState } from "react";
import { getFileIcon } from "../lib/helper";
import "../styles.css";
import type { OpenFile, VscColors } from "../types";
import { ContextmenuFileTab } from "./ContextmenuFileTab";
import { VSC } from "../constant";

export const FileTab = ({ file, isActive, onActivate, onClose, onCloseAll, onCloseOthers, copyFilePath }: {
  file: OpenFile; isActive: boolean;
  onActivate: () => void; onClose: () => void;
  onCloseAll: () => void;
  onCloseOthers: (id: string) => void;
  copyFilePath: (id: string) => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [menuVisible, setMenuVisible] = useState(false);
  const [fileOption, setFile] = useState<OpenFile | null>(null);


  const handleContextMenu = (e: MouseEvent<HTMLButtonElement>, file: OpenFile) => {
    e.preventDefault();
    setFile(file);
    setPosition({ x: e.pageX, y: e.pageY });
    setMenuVisible(true);
  };

  return (
    <>
      <ContextmenuFileTab
        onCloseAll={onCloseAll}
        onCloseOthers={onCloseOthers}
        copyFilePath={copyFilePath}
        position={position}
        menuVisible={menuVisible}
        setMenuVisible={setMenuVisible}
        fileOption={fileOption} />
      <button
        onClick={onActivate}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onContextMenu={(e) => {
          handleContextMenu(e, file);
        }}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "0 10px", height: "100%", flexShrink: 0,
          cursor: "pointer", border: "none", outline: "none", fontSize: 13,
          whiteSpace: "nowrap", borderRight: `1px solid ${VSC.border}`,
          borderTop: `1px solid ${isActive ? VSC.accent : "transparent"}`,
          backgroundColor: isActive ? VSC.editorBg : (hovered ? VSC.hover : VSC.tabInactive),
          color: isActive ? VSC.fgBright : VSC.fgMuted,
          transition: "background-color 0.1s",
        }}
      >
        {getFileIcon(file.name)}
        <span>{file.name}</span>
        <span
          role="button"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = VSC.active; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 20, height: 20, borderRadius: 3, marginLeft: 2,
            opacity: hovered || isActive ? 1 : 0, cursor: "pointer",
            backgroundColor: "transparent", color: VSC.fgMuted,
            transition: "opacity 0.1s",
          }}
        >
          <X width={14} height={14} />
        </span>
      </button>
    </>
  );
}

