
import { memo, useEffect, useId, useRef, useState } from "react";
import "../styles.css";
import { getFileIcon } from "../lib/helper";
import { OpenFile, VscColors } from "../types";

export const EditorPane = ({ file, vsc }: { file: OpenFile; vsc: VscColors }) => {
  const postTextAreaId = useId();
  const [content, setContent] = useState("");


  useEffect(() => {
    setContent(file.content || "");
  }, [file.id]);

  return (
    <div key={file.id} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{
        height: 22, display: "flex", alignItems: "center", gap: 4,
        paddingLeft: 12, fontSize: 13, color: vsc.fg, flexShrink: 0,
        borderBottom: `1px solid ${vsc.border}`,
      }}>
        {getFileIcon(file.name)}
        <span>{file.name}</span>
      </div>
      <div style={{ flex: 1, padding: "20px 28px", overflow: "auto" }}>
        {file.content ? (
          <div style={{
            flex: 1, display: "flex", flexDirection: "row",
          }}>
            <div>
              {Array.from({ length: 50 }, (_, i) => i + 1).map((n) => (
                <p key={n} style={{ display: "block", lineHeight: 1.6, fontSize: 14, color: vsc.fgMuted }}>{n}</p>
              ))}
            </div>
            <textarea
              id={postTextAreaId}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                marginLeft: 10, padding: 0,
                width: "100%", height: "100%",
                fontFamily: "'Cascadia Code', 'Fira Code', Consolas, monospace",
                fontSize: 14, lineHeight: 1.6, color: vsc.fg,
                backgroundColor: "transparent", border: "none", outline: "none",
                resize: "none",
              }}
              name="postContent"
              rows={1000}
              cols={50}
            />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "calc(100vh - 100px)", gap: 8, opacity: 0.4 }}>
            <span style={{ color: vsc.fgMuted, fontSize: 13 }}>{file.name} — no content</span>
          </div>
        )}
      </div>
    </div>
  );
}
