import React, { useEffect, useImperativeHandle, useRef, forwardRef } from "react";
import EditorJS from "@editorjs/editorjs";
import type{ OutputData } from "@editorjs/editorjs";
import { VOCAB_EDITOR_TOOLS } from "../utils/vocabEditorTools"
import DragDrop from 'editorjs-drag-drop';

export type EditorHandle = {
  save: () => Promise<EditorJS.OutputData>;
};

type Props = {
  initialData?: OutputData;
};

const VocabEditor = forwardRef<EditorHandle, Props>(({ initialData }, ref) => {
  const editorRef = useRef<EditorJS | null>(null);

  useImperativeHandle(ref, () => ({
    save: async () => {
      if (editorRef.current) {
        return await editorRef.current.save();
      }
      throw new Error("Editor is not initialized");
    },
  }));

  useEffect(() => {
    let editor: EditorJS;

    const initEditor = async () => {
      editor = new EditorJS({
        holder: "editorjs",
        tools: {paragraph: {},} ,
        data : initialData,
        autofocus: true,
        placeholder: '単語カードを追加してください...',
        onReady: () => {
          editor.isReady.then(() => {
            new DragDrop(editor);
            const editorHolder = document.getElementById("editorjs");
            if (editorHolder) {
              editorHolder.addEventListener("keydown", handleKeyDown);
              console.log("Editor is ready and event listener is attached.");
            }
          });
        },
        
        inlineToolbar:false
      });

      editorRef.current = editor;
    };

    const handleKeyDown = async (e: KeyboardEvent) => {
      const currentEditor = editorRef.current;
      if (!currentEditor) return;

      const currentBlockIndex = currentEditor.blocks.getCurrentBlockIndex();
      if (currentBlockIndex === -1) return;

      const blockData = await currentEditor.blocks.getBlockByIndex(currentBlockIndex);
      if (!blockData) return;

      const savedData = await blockData.save();
      if (!savedData) return;

      const rawText = savedData.data.text ?? "";
      const textContent = rawText.replace(/<br\s*\/?>/g, "").trim();
      

      // Spaceキーによる変換処理
      if (e.key === " ") {
        if (textContent === "#") {
          e.preventDefault();
          await replaceBlock(currentEditor, currentBlockIndex, "header", { level: 1, text: "" }, blockData.id);
        } else if (textContent === "##") {
          e.preventDefault();
          await replaceBlock(currentEditor, currentBlockIndex, "header", { level: 2, text: "" }, blockData.id);
        } else if (textContent === "###") {
          e.preventDefault();
          await replaceBlock(currentEditor, currentBlockIndex, "header", { level: 3, text: "" }, blockData.id);
        } else if (textContent === "-" || textContent === "*") {
          e.preventDefault();
          await replaceBlock(currentEditor, currentBlockIndex, "list", { style: "unordered", items: [""] }, blockData.id);
        }
      }

      // Deleteキーによる変換処理
      if (e.key === "Backspace" || e.key === "Enter" ) {
        if (blockData.name === "header" && textContent === "") {
          e.preventDefault();
          await currentEditor.blocks.delete(currentBlockIndex);
        }
      }

    };



    const replaceBlock = async (
      editor: EditorJS,
      index: number,
      newType: string,
      data: any,
      id: string
    ) => {
      await editor.blocks.insert(newType as any, data, undefined, index, true, true, id); 
      await editor.caret.setToBlock(index, "end");
    };

    initEditor();

    return () => {
      const editorHolder = document.getElementById("editorjs");
      if (editorHolder) {
        editorHolder.removeEventListener("keydown", handleKeyDown);
      }

      if (editorRef.current && typeof editorRef.current.destroy === "function") {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <div
      id="editorjs"
      className="border-2 border-gray-300 rounded-md min-h-[500px] bg-white editorjs-content"
    />
  );
});

export default VocabEditor;
