// utils/editorTools.ts
import Header from "@editorjs/header";
import List from "@editorjs/list";
import WordTable from "@/editor/tools/WordTable";


export const EDITOR_TOOLS = {
    
    header: {
        class: Header as any,
        inlineToolbar: ["link"],
        config: {
          placeholder: '見出し',
          levels: [1, 2, 3],
          defaultLevel: 1
        },
        shortcut: 'CMD+SHIFT+H'
    },
    list: List,
    wordTable: {
        class: WordTable as any,  // `WordTable` がクラスの場合
    },
};
