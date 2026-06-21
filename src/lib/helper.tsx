import { File, FileCode, FileJson, FileText, } from "lucide-react";
import type { ExplorerNode } from "../types";

export const isFolderNode = (node: ExplorerNode): node is Extract<ExplorerNode, { isFile: false }> =>
    !node.isFile;

export const addObjectAtDepth = ({
    list, targetDepth, newObj, parentFolder, currentDepth = 0, nodeName = "",
}: {
    list: ExplorerNode[]; targetDepth: number; newObj: ExplorerNode;
    parentFolder: string; currentDepth?: number; nodeName?: string;
}): ExplorerNode[] => {
    if (!Array.isArray(list)) return list;
    if (currentDepth === targetDepth && nodeName === parentFolder) { list.push(newObj); return list; }
    list.forEach((node) => {
        if (isFolderNode(node)) addObjectAtDepth({ list: node.filesAndFolders, targetDepth, newObj, parentFolder, currentDepth: currentDepth + 1, nodeName: node.name });
    });
    return list;
};

export const replaceObject = ({
    list, updatedObj,
}: {
    list: ExplorerNode[]; updatedObj: ExplorerNode;
}): ExplorerNode[] => {
    if (!Array.isArray(list)) return list;
    return list.map((node) => {
        if (updatedObj.id === node.id) {
            return { ...updatedObj };
        }
        if (isFolderNode(node)) return { ...node, filesAndFolders: replaceObject({ list: node.filesAndFolders, updatedObj, }) };
        return node;
    });
};

export const hasRenameConflict = ({
    list, updatedObj,
}: {
    list: ExplorerNode[]; updatedObj: ExplorerNode;
}): boolean => {
    if (!Array.isArray(list)) return false;

    for (const node of list) {
        if (node.id === updatedObj.id) {
            return list.some((sibling) => sibling.name === updatedObj.name && sibling.id !== updatedObj.id);
        }

        if (isFolderNode(node) && hasRenameConflict({ list: node.filesAndFolders, updatedObj })) {
            return true;
        }
    }

    return false;
};



export const deleteObject = (list: ExplorerNode[], id: string): ExplorerNode[] => {
    return list.filter((node) => {
        if (node.id === id) return false;
        if (isFolderNode(node)) node.filesAndFolders = deleteObject(node.filesAndFolders, id);
        return true;
    });
};

export const getFileIcon = (name: string, size = 16) => {
    const ext = name.split(".").pop()?.toLowerCase();
    const s = { width: size, height: size, flexShrink: 0 } as const;
    switch (ext) {
        case "ts": case "tsx": return <FileCode style={{ ...s, color: "#3178c6" }} />;
        case "js": case "jsx": return <FileCode style={{ ...s, color: "#e8c547" }} />;
        case "json": return <FileJson style={{ ...s, color: "#cbcb41" }} />;
        case "css": case "scss": return <File style={{ ...s, color: "#519aba" }} />;
        case "md": case "mdx": return <FileText style={{ ...s, color: "#519aba" }} />;
        default: return <File style={{ ...s, color: "#c5c5c5" }} />;
    }
}