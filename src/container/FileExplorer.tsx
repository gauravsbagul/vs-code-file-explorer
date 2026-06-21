import { ChevronDown, ChevronRight, File, Folder, FolderOpen } from "lucide-react";
import type { FocusEvent, KeyboardEvent, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { ContextMenu } from "../components/ContextMenu";
import { NEW_FILE, NEW_FOLDER, RENAME, VSC } from "../constant";
import { getFileIcon } from "../lib/helper";
import type { ExplorerAction, ExplorerNode, FileNode } from "../types";

const showInput = [NEW_FILE, NEW_FOLDER, RENAME];

const ROW_H = 22;
const BASE_INDENT = 0;
const INDENT = 8;
const TWISTIE_W = 16;

type FileExplorerProps = {
  list: ExplorerNode[];
  onAddNewFileOrFolder: (option: ExplorerAction) => void;
  depth: number;
  onNewFileOrFolderName: (option: ExplorerAction) => void;
  onOpenFile: (file: FileNode) => void;
  activeFile?: FileNode | null;
  onDeleteFileOrFolder: (option: ExplorerAction) => void;
  setActiveFolder: (item: ExplorerNode) => void;
};

export const FileExplorer = ({
  list, onAddNewFileOrFolder, depth, onNewFileOrFolderName, onOpenFile, activeFile, onDeleteFileOrFolder, setActiveFolder,
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
    index: number,
    item: ExplorerNode, isFile: boolean
  ) => {
    const name = e.currentTarget.value.trim();
    if (name) onNewFileOrFolderName({ index, parentFolder: item.name, depth, name, isFile, id: item.id, item });
  };

  const indentLeft = BASE_INDENT + INDENT * depth; // where this level's rows start

  return (
    <>
      <ContextMenu
        onAddNewFileOrFolder={onAddNewFileOrFolder}
        onNewFileOrFolderName={onNewFileOrFolderName}
        onDeleteFileOrFolder={onDeleteFileOrFolder}
        position={position}
        menuVisible={menuVisible}
        option={option}
      />

      {list.map((item, index) => {
        const isActive = item.isFile && item.id === activeFile?.id;
        const expanded = isExpanded[item.id];

        return (
          <div key={`${item.id}-${depth}-${index}`}>
            {item.isFile ? (
              showInput.includes(item.name) ? (
                <InlineInput
                  indentLeft={indentLeft + TWISTIE_W}
                  placeholder="filename.ts"
                  value={item.currentName || ''}
                  icon={<File style={{ width: 16, height: 16, color: "#c5c5c5", flexShrink: 0 }} />}
                  onCommit={(e) => onCreateNewFileOrFolder(e, index, item, true)}
                />
              ) : (
                <TreeRow
                  isActive={isActive}
                  onClick={() => onOpenFile(item)}
                  paddingLeft={indentLeft + TWISTIE_W}
                  onContextMenu={(e) => {
                    setIsExpanded((p) => ({ ...p, [item.id]: true }));
                    handleContextMenu(e, { index, parentFolder: item.name, depth: depth + 1, id: item.id, isFile: true, item });
                  }}
                >
                  {getFileIcon(item.name)}
                  <span style={{ marginLeft: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: isActive ? VSC.fgBright : VSC.fg }}>
                    {item.name}
                  </span>
                </TreeRow>
              )
            ) : (
              <>
                {showInput.includes(item.name) ? (
                  /* ── inline rename input (folder) ── */
                  <InlineInput
                    indentLeft={indentLeft + TWISTIE_W}
                    placeholder="folder name"
                    icon={<Folder style={{ width: 16, height: 16, color: "#c09553", flexShrink: 0 }} />}
                    onCommit={(e) => onCreateNewFileOrFolder(e, index, item, false)}
                    value={item.currentName || ''}
                  />
                ) : (
                  <TreeRow
                    isActive={false}
                    onClick={() => {
                      setIsExpanded((p) => ({ ...p, [item.id]: !p[item.id] }));
                      setActiveFolder(item);
                    }}
                    onContextMenu={(e) => {
                      setIsExpanded((p) => ({ ...p, [item.id]: true }));
                      handleContextMenu(e, { index, parentFolder: item.name, depth: depth + 1, id: item.id, isFile: false, item });
                    }}
                    paddingLeft={indentLeft}
                  >
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

                {!item.isFile && expanded && item.filesAndFolders?.length ? (
                  <FileExplorer
                    list={item.filesAndFolders}
                    onAddNewFileOrFolder={onAddNewFileOrFolder}
                    onNewFileOrFolderName={onNewFileOrFolderName}
                    onDeleteFileOrFolder={onDeleteFileOrFolder}
                    setActiveFolder={setActiveFolder}
                    depth={depth + 1}
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
  indentLeft, placeholder, icon, onCommit, value
}: {
  indentLeft: number; placeholder: string;
  icon: React.ReactNode;
  onCommit: (e: KeyboardEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>) => void;
  value: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = value;
    }
  }, [value]);

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
        onChange={(e) => inputRef.current && (inputRef.current.value = e.target.value)}
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
