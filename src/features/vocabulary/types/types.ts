// types.ts

// 単語データの1行分の型
export interface WordRow {
    id: string;
    isChecked: boolean;
    word: string;
    meaning: string;
    partOfSpeech: string;
    exampleSentence: string;
    exampleTranslation: string;
  }
  
  // Editor.jsの保存形式の一部（必要に応じて拡張してください）
  export interface EditorJSFormat {
    time: number;
    blocks: {
      id: string;
      type: "wordTable";
      data: {
        words: WordRow[];
      };
    }[];
    version: string;
  }
  
  // WordTableコンポーネントのrefでExposeするメソッド
  export interface WordTableHandle {
    getSaveData: () => EditorJSFormat;
  }
  
  // TagSelector用のタグ型
  export interface OptionType {
    label: string;
    value: string | number;
  }
  