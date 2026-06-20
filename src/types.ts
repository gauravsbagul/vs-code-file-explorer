export type FileNode = {
  name: string;
  isFile: true;
  content?: string;
};

export type FolderNode = {
  name: string;
  isFile: false;
  filesAndFolders: ExplorerNode[];
};

export type ExplorerNode = FileNode | FolderNode;

export type ExplorerAction = {
  index: number;
  parentFolder: string;
  depth: number;
  name?: string;
  isFile?: boolean;
};

export type ContextMenuOption = {
  name: string;
  isFile?: boolean;
};