import { FileCode, FileJson, FileText, File as FileIcon } from "lucide-react";
import { cn } from "../lib/utils";

type FileProps = {
  name: string;
  isActive?: boolean;
  onClick?: () => void;
};

function getIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  const cls = "h-4 w-4 shrink-0";
  switch (ext) {
    case "ts":
    case "tsx":
      return <FileCode className={cls} style={{ color: "var(--color-file-ts)" }} />;
    case "js":
    case "jsx":
      return <FileCode className={cls} style={{ color: "var(--color-file-js)" }} />;
    case "json":
      return <FileJson className={cls} style={{ color: "var(--color-file-json)" }} />;
    case "css":
    case "scss":
      return <FileIcon className={cls} style={{ color: "var(--color-file-css)" }} />;
    case "md":
    case "mdx":
      return <FileText className={cls} style={{ color: "var(--color-file-md)" }} />;
    default:
      return <FileIcon className={cn(cls, "text-muted-foreground")} />;
  }
}

export const File = ({ name, isActive, onClick }: FileProps) => {
  return (
    <div
      role="button"
      onClick={onClick}
      className="flex items-center gap-1.5 px-2 py-0.5 text-xs cursor-pointer select-none transition-colors"
      style={{
        color: isActive ? "var(--color-foreground)" : "var(--color-muted-foreground)",
        backgroundColor: isActive ? "var(--color-sidebar-active)" : undefined,
      }}
    >
      {getIcon(name)}
      <span className="truncate">{name}</span>
    </div>
  );
};
