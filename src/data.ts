import type { ExplorerNode } from "./types";

export const filesAndFolders: ExplorerNode[] = [
  {
    name: "src",
    isFile: false,
    id: self.crypto.randomUUID(),
    filesAndFolders: [
      {
        name: "pages",
        isFile: false,
        id: self.crypto.randomUUID(),
        filesAndFolders: [
          {
            name: "index.tsx", isFile: true, id: self.crypto.randomUUID(), content: `import { PanelLeft, PanelRight } from "lucide-react";
import { memo, useCallback, useState, useRef, useEffect } from "react";
import { EditorPane } from "./components/EditorPane";
import { FileTab } from "./components/FileTab";
import { VSC } from "./constant";
import { FileExplorer } from "./container/FileExplorer";
import { filesAndFolders } from "./data";
import { addObjectAtDepth, deleteObject, getFilePath, replaceObject } from "./lib/helper";
import "./styles.css";
import type { ExplorerAction, ExplorerNode, FileNode, VscColors } from "./types";


export default function App() {
  const [list, setList] = useState<ExplorerNode[]>(filesAndFolders);
  const [openFiles, setOpenFiles] = useState<FileNode[]>([]);
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [activeFolder, setActiveFolder] = useState<ExplorerNode | null>(null);
  const [isPaneLeft, setIsPaneLeft] = useState<boolean>(true);


  const [drawerWidth, setDrawerWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  const startResizing = (mouseDownEvent: any) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (mouseMoveEvent: any) => {
      if (!isResizing) return;

      // Calculate new width based on mouse position relative to the viewport
      const newWidth = mouseMoveEvent.clientX;

      // Enforce minimum and maximum width constraints
      if (newWidth > 100 && newWidth < 600 && isPaneLeft) {
        setDrawerWidth(newWidth);
      }
      const rightPaneWidth = window.innerWidth - newWidth
      if (rightPaneWidth > 100 && rightPaneWidth < 600 && !isPaneLeft) {
        setDrawerWidth(rightPaneWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const onAddNewFileOrFolder = useCallback((option: ExplorerAction) => {
    const { parentFolder, name = "", depth, isFile } = option;
    const tempList = structuredClone(list) as ExplorerNode[];
    setList(addObjectAtDepth({
      list: tempList, targetDepth: depth, parentFolder,
      newObj: { name: "New file", ...(isFile ? { isFile: true as const, id: self.crypto.randomUUID() } : { filesAndFolders: [], isFile: false as const, id: self.crypto.randomUUID() }) },
    }));
  }, [list]);

  const onNewFileOrFolderName = useCallback((option: ExplorerAction) => {
    const { name = "", id, item } = option;
    const tempList = structuredClone(list) as ExplorerNode[];
    const updatedObj = { ...item, name, id, ...(option.currentName && { currentName: option.currentName }) } as ExplorerNode;

   
    setList(replaceObject({
      list: tempList,
      updatedObj,
    }));
  }, [list]);

  const onDeleteFileOrFolder = useCallback((option: ExplorerAction) => {
    const { id, name } = option;
    if (confirm("Are you sure you want to delete file")) {
      const tempList = structuredClone(list) as ExplorerNode[];
      setList(deleteObject(tempList, id));
    }
  }, [list]);

  const onOpenFile = useCallback((file: FileNode) => {
    setActiveFile(file);
    setOpenFiles((prev) => prev.some((f) => f.id === file.id) ? prev : [...prev, file]);
  }, []);

  const onCloseFile = useCallback((id: string) => {
    setOpenFiles((prev) => {
      const next = prev.filter((f) => f.id !== id);
      if (activeFile?.id === id) setActiveFile(next.length > 0 ? next[next.length - 1] : null);
      return next;
    });
  }, [activeFile]);


  const onCloseAll = useCallback(() => {
    setOpenFiles([]);
    setActiveFile(null);
  }, []);

  const onCloseOthers = useCallback((id: string) => {
    setOpenFiles((prev) => prev.filter((f) => f.id === id));
  }, []);

  const copyFilePath = useCallback((id: string) => {
    const filePath = getFilePath(list, id);
    navigator.clipboard.writeText(filePath || "");
  }, []);

  const currentFile = openFiles.find((f) => f.id === activeFile?.id);


  const resizeHandle = <div
    onMouseDown={startResizing}
    style={{
      width: '5px',
      cursor: 'col-resize',
      position: 'absolute',
      top: 0,
      ...(isPaneLeft ? { right: 0, } : { left: 0 }),
      bottom: 0,
      backgroundColor: isResizing ? '#007acc' : '#0000',
      transition: 'background-color 0.2s',
    }}
    className="resize-handle"
  />


  const sideBar = <aside ref={sidebarRef} style={{
    width: drawerWidth, minWidth: 100, display: "flex", flexDirection: "column",
    backgroundColor: VSC.sidebarBg, borderRight: "1px solid 1",
    overflow: "hidden",
    position: "relative",
  }}>
    <div style={{
      height: 35, display: "flex", alignItems: "center", paddingLeft: 12, flexShrink: 0,
      fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
      color: VSC.fgHeader, borderBottom: "1px solid 1", userSelect: "none",
      justifyContent: "space-between", gap: 4, paddingRight: 8,
    }}>
      Explorer

      {isPaneLeft ? <PanelLeft onClick={() => setIsPaneLeft(false)} /> : <PanelRight onClick={() => setIsPaneLeft(true)} />}
    </div>
    {resizeHandle}
    <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
      <FileExplorer
        list={list}
        onAddNewFileOrFolder={onAddNewFileOrFolder}
        onNewFileOrFolderName={onNewFileOrFolderName}
        onDeleteFileOrFolder={onDeleteFileOrFolder}
        setActiveFolder={setActiveFolder}
        depth={0}
        onOpenFile={onOpenFile}
        activeFile={activeFile}
      />
    </div>
  </aside>

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", backgroundColor: VSC.editorBg }}>
      {isPaneLeft && sideBar}

      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: VSC.editorBg }}>
        {openFiles.length > 0 && (
          <div style={{
            height: 35, display: "flex", alignItems: "stretch", flexShrink: 0,
            backgroundColor: VSC.sidebarBg, borderBottom: '1px solid 1',
            overflowX: "auto", overflowY: "hidden",
            flexDirection: isPaneLeft ? "row" : "row-reverse",
          }}>
            {openFiles.map((file) => (
              <FileTab
                key={file.id}
                file={file}
                isActive={file.id === activeFile?.id}
                onActivate={() => setActiveFile(file)}
                onClose={() => onCloseFile(file.id)}
                onCloseAll={onCloseAll}
                onCloseOthers={onCloseOthers}
                copyFilePath={copyFilePath}
              />
            ))}
          </div>
        )}

        <div style={{ flex: 1, overflow: "auto" }}>
          {currentFile ? (
            <EditorPane file={currentFile} />
          ) : (
            <EmptyState />
          )}
        </div>
      </main>
      {!isPaneLeft && sideBar}
    </div>
  );
}

const EmptyState = memo(() => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8 }}>
      <p style={{ color: VSC.fgMuted, fontSize: 13 }}>You can perform actions on files in the explorer</p>
      <p style={{ color: VSC.fgMuted, fontSize: 11, opacity: 0.5 }}>Right-click a folder in the explorer to create files</p>
      <p>Start Editing and playing around! with the editor!</p>
    </div>
  );
})
` },
          { name: "_app.tsx", isFile: true, id: self.crypto.randomUUID(), content: `import { useState } from "react";` },
          {
            name: "api",
            isFile: false,
            id: self.crypto.randomUUID(),
            filesAndFolders: [
              { name: "auth.ts", isFile: true, id: self.crypto.randomUUID(), content: `export const authenticate = () => { /* ... */ };` },
              { name: "products.ts", isFile: true, id: self.crypto.randomUUID(), content: `export const getProducts = () => { /* ... */ };` },
            ],
          },
        ],
      },
      {
        name: "components",
        isFile: false,
        id: self.crypto.randomUUID(),
        filesAndFolders: [
          {
            name: "ui",
            isFile: false,
            id: self.crypto.randomUUID(),
            filesAndFolders: [
              { name: "Button.tsx", isFile: true, id: self.crypto.randomUUID(), content: `export default function Button() { return <button>Click me</button> }` },
              { name: "Modal.tsx", isFile: true, id: self.crypto.randomUUID(), content: `export default function Modal() { return <div>Modal Content</div> }` },
            ],
          },
          {
            name: "layout",
            isFile: false,
            id: self.crypto.randomUUID(),
            filesAndFolders: [
              { name: "Header.tsx", isFile: true, id: self.crypto.randomUUID() },
              { name: "Footer.tsx", isFile: true, id: self.crypto.randomUUID() },
              { name: "Sidebar.tsx", isFile: true, id: self.crypto.randomUUID() },
            ],
          },
          {
            name: "shared",
            isFile: false,
            id: self.crypto.randomUUID(),
            filesAndFolders: [
              { name: "Spinner.tsx", isFile: true, id: self.crypto.randomUUID() },
              { name: "ErrorBoundary.tsx", isFile: true, id: self.crypto.randomUUID() },
            ],
          },
        ],
      },
      {
        name: "hooks",
        isFile: false,
        id: self.crypto.randomUUID(),
        filesAndFolders: [
          { name: "useAuth.ts", isFile: true, id: self.crypto.randomUUID() },
          { name: "useFetch.ts", isFile: true, id: self.crypto.randomUUID() },
        ],
      },
      {
        name: "utils",
        isFile: false,
        id: self.crypto.randomUUID(),
        filesAndFolders: [
          { name: "formatters.ts", isFile: true, id: self.crypto.randomUUID() },
          { name: "validators.ts", isFile: true, id: self.crypto.randomUUID() },
          { name: "constants.ts", isFile: true, id: self.crypto.randomUUID() },
        ],
      },
      {
        name: "styles",
        isFile: false,
        id: self.crypto.randomUUID(),
        filesAndFolders: [
          { name: "globals.css", isFile: true, id: self.crypto.randomUUID() },
          { name: "variables.css", isFile: true, id: self.crypto.randomUUID() },
        ],
      },
    ],
  },
  { name: "next.config.js", isFile: true, id: self.crypto.randomUUID() },
  {
    name: "package.json", isFile: true, id: self.crypto.randomUUID(), content: `{
  "name": "react",
  "version": "1.0.0",
  "description": "",
  "keywords": [],
  "main": "src/index.tsx",
  "dependencies": {
    "@tailwindcss/postcss": "^4.3.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^1.21.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-scripts": "^5.0.0",
    "shadcn": "^4.11.0",
    "tailwind-merge": "^3.6.0",
    "tailwindcss": "^4.3.1",
    "tw-animate-css": "^1.4.0"
  },
  "devDependencies": {
    "@types/react": "19.0.0",
    "@types/react-dom": "19.0.0",
    "loader-utils": "3.2.1",
    "typescript": "5.7.2"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  },
  "browserslist": [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
  ]
}
`},
  { name: "tsconfig.json", isFile: true, id: self.crypto.randomUUID() },
];