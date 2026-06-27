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

export const getFilePath = (list: ExplorerNode[], id: string, currentPath = ""): string | null => {
    for (const node of list) {
        const newPath = currentPath ? `${currentPath}/${node.name}` : node.name;
        if (node.id === id) return newPath;
        if (isFolderNode(node)) {
            const result = getFilePath(node.filesAndFolders, id, newPath);
            if (result) return result;
        }
    }
    return null;
}

/** Find a FileNode by its slash-separated path (e.g. "my-app/src/pages/index.tsx") */
export const findNodeByPath = (list: ExplorerNode[], path: string): import("../types").FileNode | null => {
    const parts = path.split("/").filter(Boolean);
    let current: ExplorerNode[] = list;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const node = current.find((n) => n.name === part);
        if (!node) return null;
        if (i === parts.length - 1) return node.isFile ? node : null;
        if (!node.isFile) { current = node.filesAndFolders; continue; }
        return null;
    }
    return null;
};

/** Return the IDs of all ancestor folder nodes for a given node ID */
export const getAncestorIds = (
    list: ExplorerNode[],
    targetId: string,
    ancestors: string[] = []
): string[] | null => {
    for (const node of list) {
        if (node.id === targetId) return ancestors;
        if (isFolderNode(node)) {
            const result = getAncestorIds(node.filesAndFolders, targetId, [...ancestors, node.id]);
            if (result) return result;
        }
    }
    return null;
};