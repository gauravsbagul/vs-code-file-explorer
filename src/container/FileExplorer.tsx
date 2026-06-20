import { useEffect, useRef, useState } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileCode, FileJson, FileText, File } from "lucide-react";
import { ContextMenu } from "../components/ContextMenu";
import { getFileIcon, VSC } from "../App";
import type { ExplorerAction, ExplorerNode } from "../types";
import type { FocusEvent, KeyboardEvent, MouseEvent } from "react";

// VS Code tree layout constants
const ROW_H = 22;          // px — every row is exactly 22px tall
const BASE_INDENT = 0;     // px — no extra base offset; root starts flush
const INDENT = 8;          // px per depth level
const TWISTIE_W = 16;      // px — chevron zone width (also used as spacer for files)

type FileExplorerProps = {
  list: ExplorerNode[];
  onAddNewFileOrFolder: (option: ExplorerAction) => void;
  depth: number;
  setNewFileOrFolderName: (option: ExplorerAction) => void;
  onOpenFile: (file: { name: string; content?: string }) => void;
  activeFile?: string | null;
};

export const FileExplorer = ({
  list, onAddNewFileOrFolder, depth, setNewFileOrFolderName, onOpenFile, activeFile,
}: FileExplorerProps) => {
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [menuVisible, setMenuVisible] = useState(false);
  const [option, setOption] = useState<ExplorerAction | null>(null);

  const handleContextMenu = (e: MouseEvent<HTMLDivElement>, nextOption: ExplorerAction) => {
    e.preventDefault();
    setOption(nextOption);
    setPosition({ x: e.pageX, y: e.pageY });
    setMenuVisible(true);
  };

  useEffect(() => {
    const close = () => setMenuVisible(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const onCreateNewFileOrFolder = (
    e: KeyboardEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>,
    index: number, item: ExplorerNode, isFile: boolean
  ) => {
    const name = e.currentTarget.value.trim();
    if (name) setNewFileOrFolderName({ index, parentFolder: item.name, depth, name, isFile });
  };

  const indentLeft = BASE_INDENT + INDENT * depth; // where this level's rows start

  return (
    <>
      <ContextMenu
        onAddNewFileOrFolder={onAddNewFileOrFolder}
        position={position}
        menuVisible={menuVisible}
        option={option}
      />

      {list.map((item, index) => {
        const isActive = item.isFile && item.name === activeFile;
        const expanded = isExpanded[item.name];

        return (
          <div key={`${item.name}-${depth}-${index}`}>
            {item.isFile ? (
              item.name === "New file" ? (
                /* ── inline rename input (file) ── */
                <InlineInput
                  indentLeft={indentLeft + TWISTIE_W}
                  placeholder="filename.ts"
                  icon={<File style={{ width: 16, height: 16, color: "#c5c5c5", flexShrink: 0 }} />}
                  onCommit={(e) => onCreateNewFileOrFolder(e, index, item, true)}
                />
              ) : (
                /* ── file row ── */
                <TreeRow
                  isActive={isActive}
                  onClick={() => onOpenFile(item)}
                  paddingLeft={indentLeft + TWISTIE_W}
                >
                  {getFileIcon(item.name)}
                  <span style={{ marginLeft: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: isActive ? VSC.fgBright : VSC.fg }}>
                    {item.name}
                  </span>
                </TreeRow>
              )
            ) : (
              <>
                {item.name === "New folder" ? (
                  /* ── inline rename input (folder) ── */
                  <InlineInput
                    indentLeft={indentLeft + TWISTIE_W}
                    placeholder="folder name"
                    icon={<Folder style={{ width: 16, height: 16, color: "#c09553", flexShrink: 0 }} />}
                    onCommit={(e) => onCreateNewFileOrFolder(e, index, item, false)}
                  />
                ) : (
                  /* ── folder row ── */
                  <TreeRow
                    isActive={false}
                    onClick={() => setIsExpanded((p) => ({ ...p, [item.name]: !p[item.name] }))}
                    onContextMenu={(e) => {
                      setIsExpanded((p) => ({ ...p, [item.name]: true }));
                      handleContextMenu(e, { index, parentFolder: item.name, depth: depth + 1 });
                    }}
                    paddingLeft={indentLeft}
                  >
                    {/* chevron */}
                    <span style={{ width: TWISTIE_W, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {expanded
                        ? <ChevronDown style={{ width: 14, height: 14, color: VSC.fgMuted }} />
                        : <ChevronRight style={{ width: 14, height: 14, color: VSC.fgMuted }} />}
                    </span>
                    {expanded
                      ? <FolderOpen style={{ width: 16, height: 16, color: "#c09553", flexShrink: 0 }} />
                      : <Folder style={{ width: 16, height: 16, color: "#c09553", flexShrink: 0 }} />}
                    <span style={{ marginLeft: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: VSC.fg }}>
                      {item.name}
                    </span>
                  </TreeRow>
                )}

                {/* children */}
                {!item.isFile && expanded && item.filesAndFolders?.length ? (
                  <FileExplorer
                    list={item.filesAndFolders}
                    onAddNewFileOrFolder={onAddNewFileOrFolder}
                    depth={depth + 1}
                    setNewFileOrFolderName={setNewFileOrFolderName}
                    onOpenFile={onOpenFile}
                    activeFile={activeFile}
                  />
                ) : null}
              </>
            )}
          </div>
        );
      })}
    </>
  );
};

/* ── Shared row component ── */
function TreeRow({
  children, isActive, onClick, onContextMenu, paddingLeft,
}: {
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
  onContextMenu?: (e: MouseEvent<HTMLDivElement>) => void;
  paddingLeft: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      role="button"
      onClick={onClick}
      onContextMenu={onContextMenu}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: ROW_H,
        display: "flex", alignItems: "center",
        paddingLeft, paddingRight: 12,
        cursor: "pointer", userSelect: "none",
        fontSize: 13, lineHeight: 1,
        backgroundColor: isActive ? VSC.active : (hovered ? VSC.hover : "transparent"),
        outline: isActive ? `1px solid ${VSC.active}` : "none",
        outlineOffset: -1,
        position: "relative",
      }}
    >
      {/* active indicator — left edge */}
      {isActive && (
        <span style={{
          position: "absolute", left: 0, top: 0, width: 2, height: "100%",
          backgroundColor: VSC.accent,
        }} />
      )}
      {children}
    </div>
  );
}

/* ── Inline rename input ── */
function InlineInput({
  indentLeft, placeholder, icon, onCommit,
}: {
  indentLeft: number; placeholder: string;
  icon: React.ReactNode;
  onCommit: (e: KeyboardEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div style={{
      height: ROW_H, display: "flex", alignItems: "center", gap: 4,
      paddingLeft: indentLeft, paddingRight: 12,
      backgroundColor: VSC.active,
    }}>
      {icon}
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        autoFocus
        style={{
          flex: 1, minWidth: 0, height: 18, padding: "0 4px",
          fontSize: 13, outline: "none", border: `1px solid ${VSC.accent}`,
          backgroundColor: "#3c3c3c", color: VSC.fgBright,
          borderRadius: 0,
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") onCommit(e);
          if (e.key === "Escape") onCommit(e);
        }}
        onBlur={onCommit}
      />
    </div>
  );
}
