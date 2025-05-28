// WordTableComponent.tsx
import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  type ForwardedRef,
  type RefObject,
} from "react";
import "../styles/WordTableComponentsStyle.css"
import type { OptionType } from "@/shared/components/TagSelector";
import type { WordRow, WordTableHandle, EditorJSFormat } from "../types/types";
import { generateId, getInitialWords } from "../utils/wordUtils";
import { SortableBody } from "./SortableBody";

import "../styles/WordTableComponentsStyle.css";

interface Props {
  initialWords?: WordRow[];
  allWords: Record<string, WordRow[]>;
  initialSelectedTag?: OptionType | null;
  onChange?: (words: WordRow[], selectedTag: OptionType | null) => void;
  id: string;
}

const MIN_COL_WIDTH = 40;

const WordTableComponent = (
  { allWords, id, initialWords = [], initialSelectedTag = null, onChange }: Props,
  ref: ForwardedRef<WordTableHandle>
) => {
  const [allWordsState, setAllWordsState] = useState<Record<string, WordRow[]>>(allWords);

  const [words, setWords] = useState<WordRow[]>(() => getInitialWords(allWords, id, initialWords));
  const [selectedTag, setSelectedTag] = useState<OptionType | null>(initialSelectedTag);

  const getSaveData = (): EditorJSFormat => ({
    time: Date.now(),
    blocks: [
      {
        id,
        type: "wordTable",
        data: { words },
      },
    ],
    version: "2.0.0",
  });

  useImperativeHandle(ref, () => ({ getSaveData }));

  const [colWidths, setColWidths] = useState<number[]>([40, 40, 150, 150, 100, 200, 200]);

  const tableRef = useRef<HTMLTableElement>(null);

  const resizingColIndex = useRef<number | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  function onResizeMouseDown(e: React.MouseEvent<HTMLDivElement>, colIndex: number) {
    e.preventDefault();
    resizingColIndex.current = colIndex;
    startX.current = e.clientX;
    startWidth.current = colWidths[colIndex];
    window.addEventListener("mousemove", onResizeMouseMove);
    window.addEventListener("mouseup", onResizeMouseUp);
  }

  function onResizeMouseMove(e: MouseEvent) {
    if (resizingColIndex.current === null) return;
    const deltaX = e.clientX - startX.current;
    const newWidth = Math.max(MIN_COL_WIDTH, startWidth.current + deltaX);
    setColWidths((prev) => {
      const updated = [...prev];
      updated[resizingColIndex.current!] = newWidth;
      return updated;
    });
  }

  function onResizeMouseUp() {
    resizingColIndex.current = null;
    window.removeEventListener("mousemove", onResizeMouseMove);
    window.removeEventListener("mouseup", onResizeMouseUp);
  }

  function adjustRowTextareaHeights(tableRef: RefObject<HTMLTableElement | null>): void {
    const table = tableRef.current;
    if (!table) return;
  
    const rows = table.querySelectorAll("tbody tr");
  
    rows.forEach((row) => {
      const textareas = row.querySelectorAll("textarea");
      
      // 一旦全てのtextareaの高さをautoにリセット
      textareas.forEach((ta) => {
        ta.style.height = "auto";
      });
  
      // 各textareaのscrollHeightを取得し、最大の高さに揃える
      const maxHeight = Math.max(...Array.from(textareas).map((ta) => ta.scrollHeight));
  
      textareas.forEach((ta) => {
        ta.style.height = `${maxHeight}px`;
      });
    });
  }

  function updateWord(index: number, field: keyof WordRow, value: string | boolean) {
    const updated = [...words];
    updated[index] = { ...updated[index], [field]: value };
  
    setWords(updated);
    setAllWordsState((prev) => ({ ...prev, [id]: updated }));
  
    if (onChange) {
      onChange(updated, selectedTag);
    }
    adjustRowTextareaHeights(tableRef);
    
  }
  

  function deleteRow(index: number) {
    const updated = [...words];
    updated.splice(index, 1);
  
    // 最低1行は残す
    if (updated.length === 0) {
      updated.push({
        id: generateId(),
        isChecked: false,
        word: "",
        meaning: "",
        partOfSpeech: "",
        exampleSentence: "",
        exampleTranslation: "",
      });
    }
  
    setWords(updated);
    setAllWordsState((prev) => ({ ...prev, [id]: updated }));
  
    if (onChange) {
      onChange(updated, selectedTag);
    }
  }
  

  function addRow() {
    const newRow: WordRow = {
      id: generateId(),
      isChecked: false,
      word: "",
      meaning: "",
      partOfSpeech: "",
      exampleSentence: "",
      exampleTranslation: "",
    };
  
    const updated = [...words, newRow];
    setWords(updated);
    setAllWordsState((prev) => ({ ...prev, [id]: updated }));
  
    if (onChange) {
      onChange(updated, selectedTag);
    }
  }

  function onSortEnd(oldIndex: number, newIndex: number) {
    if (
      oldIndex === newIndex ||
      oldIndex >= words.length ||
      newIndex >= words.length
    ) return;
  
    const newWords = [...words];
    const [movedItem] = newWords.splice(oldIndex, 1);
    newWords.splice(newIndex, 0, movedItem);
  
    setWords(newWords); // 状態を直接更新
    setAllWordsState((prev) => ({ ...prev, [id]: newWords }));
  
    if (onChange) {
      onChange(newWords, selectedTag);
    }
  }

  return (
    <div
      className="word-table"
      style={{
        marginLeft: -10,
        position: "relative",
        zIndex: 0,
        overflow: "visible",
      }}
    >
      <div
        style={{
          overflowX: "visible",
          overflowY: "visible",
          maxWidth: "100%",
          display: "block",
          position: "relative",
        }}
      >
        <table
          ref={tableRef}
          className="table-auto border-none"
          style={{
            tableLayout: "fixed",
            width: "80%",
            height: "100%",
            borderCollapse: "collapse",
            marginLeft: -30,
            position: "relative",
            zIndex: 100,
          }}
        >
          <colgroup>
            {colWidths.map((width, i) => (
              <col key={i} style={{ width: `${width}px` }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {[
                "", // 削除・ドラッグ列
                "チェック",
                "単語",
                "意味",
                "品詞",
                "例文",
                "例文和訳",
              ].map((title, i) => (
                <th
                  key={i}
                  className="table-header-cell"
                  style={{
                    position: "relative",
                    userSelect: "none",
                    verticalAlign: "middle",
                    textAlign: i === 1 ? "center" : "left",
                  }}
                >
                  {i === 1 ? (
                    // チェック列アイコン
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      width={16}
                      height={16}
                    >
                      <path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                    </svg>
                  ) : (
                    title
                  )}
                  {/* リサイズハンドル（最終列はつけない） */}
                  {i < colWidths.length && (
                    <div
                      className="resize-handle"
                      onMouseDown={(e) => onResizeMouseDown(e, i)}
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        height: "100%",
                        width: 3,
                        cursor: "col-resize",
                        userSelect: "none",
                        zIndex: 10,
                      }}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          {/* ここを SortableBody に置き換え */}
          <SortableBody words={words} onSortEnd={onSortEnd}>
            {words.map((row, i) => (
              <tr key={row.id} className="group relative">
                <td
                  className="w-10 h-full text-center border-none group-hover:border group-hover:border-gray-300 transition-all duration-200"
                  style={{ position: "relative", zIndex: 10, height: '35px' }}
                >
                  <button
                    title="削除"
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-800 text-sm inline-flex justify-center mt-1 transition-opacity duration-200"
                    onClick={() => deleteRow(i)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="15"
                      height="15"
                      fill="currentColor"
                      viewBox="0 0 30 30"
                    >
                      <path d="M 13 3 A 1.0001 1.0001 0 0 0 11.986328 4 L 6 4 A 1.0001 1.0001 0 1 0 6 6 L 24 6 A 1.0001 1.0001 0 1 0 24 4 L 18.013672 4 A 1.0001 1.0001 0 0 0 17 3 L 13 3 z M 6 8 L 6 24 C 6 25.105 6.895 26 8 26 L 22 26 C 23.105 26 24 25.105 24 24 L 24 8 L 6 8 z" />
                    </svg>
                  </button>
                  <span
                    title="ドラッグして並び替え"
                    className="drag-handle cursor-move text-sm opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-800 inline-flex justify-center mt-1 transition-opacity duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="15"
                      height="15"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 4.5h12a.5.5 0 0 1 0 1H2a.5.5 0 0 1 0-1zm0 3h12a.5.5 0 0 1 0 1H2a.5.5 0 0 1 0-1zm0 3h12a.5.5 0 0 1 0 1H2a.5.5 0 0 1 0-1z" />
                    </svg>
                  </span>
                </td>
                <td className="text-center ">
                  <input
                    type="checkbox"
                    className="form-checkbox text-indigo-600"
                    checked={row.isChecked}
                    onChange={(e) => updateWord(i, "isChecked", e.target.checked)}
                  />
                </td>
                <td className="border-r border-t border-gray-200 px-1 py-1 align-top y-full">
                  <textarea
                    value={row.word}
                    onChange={(e) => updateWord(i, "word", e.target.value)}
                    className="block text-base w-full border rounded px-1 resize-none border border-gray-300"
                    rows={1}
                    spellCheck={false}
                  />
                </td>
                <td className="border-r border-t border-gray-200 px-1 py-1 align-top y-full" >
                  <textarea
                    value={row.meaning}
                    onChange={(e) => updateWord(i, "meaning", e.target.value)}
                    className="block text-base w-full border rounded px-1 resize-none border border-gray-300"
                    rows={1}
                    spellCheck={false}
                  />
                </td>
                <td className="border-r border-t border-gray-200 px-1 py-1 align-top y-full">
                  <textarea                  
                    value={row.partOfSpeech}
                    onChange={(e) => updateWord(i, "partOfSpeech", e.target.value)}
                    className="block text-base w-full border rounded px-1 resize-none"
                    rows={1}
                    spellCheck={false}
                  />
                </td>
                <td className="border-r border-t border-gray-200 px-1 py-1 align-top y-full">
                  <textarea
                    value={row.exampleSentence}
                    onChange={(e) => updateWord(i, "exampleSentence", e.target.value)}
                    className="block text-base w-full border rounded px-1 resize-none"
                    rows={1}
                    spellCheck={false}
                  />
                </td>
                <td className="border-t border-gray-200 px-1 py-1 align-top y-full">
                  <textarea
                    value={row.exampleTranslation}
                    onChange={(e) => updateWord(i, "exampleTranslation", e.target.value)}
                    className="block text-base w-full border rounded px-1 resize-none "
                    rows={1}
                    spellCheck={false}
                  />
                </td>
              </tr>
            ))}
          </SortableBody>
        </table>
      </div>
      <button
        className="w-full text-left text-xs text-gray-600 px-4 py-1 rounded bg-gray-100 hover:bg-gray-200"
        onClick={addRow}
      >
        ＋行を追加
      </button>
    </div>
  );
};

export default forwardRef(WordTableComponent);
