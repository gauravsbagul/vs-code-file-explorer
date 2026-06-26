
import { useEffect, useId, useState, } from "react";
import Editor from '@monaco-editor/react';
import { VSC } from '../constant'

import { getFileIcon } from "../lib/helper";
import "../styles.css";
import { OpenFile, } from "../types";

export const EditorPane = ({ file, }: { file?: OpenFile; }) => {
  const postTextAreaId = useId();
  const [content, setContent] = useState("");

  const [language, setLanguage] = useState('');


  useEffect(() => {
    setContent(file?.content || "");
    setLanguage(file?.name?.split('.')[1] || '');
  }, [file?.id]);

  const handleEditorDidMount = (editor: any, monaco: any) => {

  }



  return (
    <div key={file?.id} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{
        height: 22, display: "flex", alignItems: "center", gap: 4,
        paddingLeft: 12, fontSize: 13, color: VSC.fg, flexShrink: 0,
        borderBottom: `1px solid ${VSC.border}`,
      }}>
        {getFileIcon(file?.name || '')}
        <span>{file?.name}</span>
      </div>
      <Editor
        height={'100vh'}
        theme="vs-dark"
        language={language}
        value={content}
        onChange={(newValue) => setContent(newValue || '')}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          automaticLayout: true,
        }}
        className='editor'
      />
    </div>
  );
}
