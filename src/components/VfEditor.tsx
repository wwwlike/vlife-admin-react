import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import React, { useState, useEffect } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";

import { useUpdateEffect } from "ahooks";
import { VfBaseProps } from "@src/dsl/schema/component";
const apiUrl = import.meta.env.VITE_APP_API_URL;
interface VfEditorProps extends VfBaseProps<string, string> {}

function VfEditor({ value, onDataChange, read }: VfEditorProps) {
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语法
  // const [editor, setEditor] = useState(null)                   // JS 语法

  // 编辑器内容
  const [html, setHtml] = useState(value);

  useUpdateEffect(() => {
    onDataChange(html);
  }, [html]);

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {}; // TS 语法
  // const toolbarConfig = { }                        // JS 语法

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    // TS 语法
    // const editorConfig = {                         // JS 语法
    placeholder: "请输入内容...",

    MENU_CONF: {
      uploadImage: {
        server: apiUrl + "/sysFile/upload",
      },
    },
  };

  // editorConfig.MENU_CONF["uploadImage"] = {
  //   server: "http://localhost:8288/oa/sysFile/upload",
  // };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return read ? (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <>
      <div style={{ border: "1px solid #ccc", zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: "1px solid #ccc" }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor) => setHtml(editor.getHtml())}
          mode="default"
          style={{ height: "500px", overflowY: "hidden" }}
        />
      </div>
      {/* <div style={{ marginTop: "15px" }}>{html}</div>{" "} */}
    </>
  );
}
export default VfEditor;
