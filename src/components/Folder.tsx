import { Folder as FolderIcon, FolderOpen, ChevronRight, ChevronDown } from "lucide-react";

type FolderProps = {
  name: string;
  isOpen?: boolean;
  onClick?: () => void;
};

export const Folder = ({ name, isOpen, onClick }: FolderProps) => {
  return (
    <div
      role="button"
      onClick={onClick}
      className="flex items-center gap-1.5 px-2 py-0.5 text-xs cursor-pointer select-none transition-colors"
      style={{ color: "var(--color-foreground)" }}
    >
      {isOpen ? (
        <ChevronDown className="h-3 w-3 shrink-0" style={{ color: "var(--color-muted-foreground)" }} />
      ) : (
        <ChevronRight className="h-3 w-3 shrink-0" style={{ color: "var(--color-muted-foreground)" }} />
      )}
      {isOpen ? (
        <FolderOpen className="h-4 w-4 shrink-0" style={{ color: "var(--color-folder)" }} />
      ) : (
        <FolderIcon className="h-4 w-4 shrink-0" style={{ color: "var(--color-folder)" }} />
      )}
      <span className="truncate font-medium">{name}</span>
    </div>
  );
};
