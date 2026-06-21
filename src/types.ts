export type FileNode = {
  name: string;
  isFile: true;
  content?: string;
  id: string;
  currentName?: string;
};

export type FolderNode = {
  name: string;
  isFile: false;
  filesAndFolders: ExplorerNode[];
  id: string;
  currentName?: string;
};

export type ExplorerNode = FileNode | FolderNode;

export type ExplorerAction = {
  index: number;
  parentFolder: string;
  depth: number;
  name?: string;
  isFile?: boolean;
  currentName?: string;
  id: string;
  item?: ExplorerNode;
};

export type ContextMenuOption = {
  name: string;
  isFile?: boolean;
  icon: React.ReactNode;
};