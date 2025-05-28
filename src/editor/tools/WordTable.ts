import Sortable from "sortablejs";
import React from "react";
import ReactDOM from "react-dom/client";
import SearchSelectBox from "@/shared/components/TagSelector";
import type {OptionType} from "@/shared/components/TagSelector";
import '@fortawesome/fontawesome-free/css/all.min.css';

interface WordTableData {
  words: {
    isChecked: boolean;
    word: string;
    meaning: string;
    partOfSpeech: string;
    exampleSentence: string;
    exampleTranslation: string;
  }[];
  selectedTag?: OptionType | null; 
}

export default class WordTable {
  static get toolbox() {
    return {
      title: '単語帳',
      icon: '<svg>...</svg>', // 任意のアイコン
    };
  }

  data: WordTableData;
  wrapper: HTMLElement;
  isFirstRowInserted: boolean = false; // 最初の行が挿入されたかどうかを示すフラグ
  
  constructor({ data }: { data: WordTableData }) {
    this.data = data || { words: [], selectedTag: null };
    this.wrapper = document.createElement("div");
    this.wrapper.className = "word-table";
  }

  render() {
    this.wrapper.innerHTML = '';  // 初期化してテーブルを作成
    this.wrapper.style.marginLeft = "-20px"; // 左にずらす
    this.wrapper.style.position = "relative"; // z-index を効かせる
    this.wrapper.style.zIndex = "0"; // 高めに設定して被りを防ぐ
    this.wrapper.style.overflow = "visible";
    

    const container = document.createElement("div");
    container.style.overflowX = 'auto';
    container.style.maxWidth = '100%'; // 明示的に制限
    container.style.display = 'block'; // インライン要素にしない
    
    //タグ選択セレクターを追加
    
    const tagSelectorWrapper = document.createElement("div");
    tagSelectorWrapper.id = "tag-selector-container";
    tagSelectorWrapper.style.height = "40px";
    tagSelectorWrapper.style.display = "flex";
    tagSelectorWrapper.style.alignItems = "center";
    tagSelectorWrapper.style.gap = "8px";
    tagSelectorWrapper.style.marginLeft = "16px";
    

    // 2. ラベル要素を追加
    const label = document.createElement("span");
    label.textContent = "単語帳を設定:";
    label.style.fontSize = "11px";
    label.style.color = "gray";
    label.style.fontWeight = "500";
    label.style.flexShrink = "0";
    tagSelectorWrapper.appendChild(label);

    // 3. React の描画ターゲットを別に作る
    const reactRootContainer = document.createElement("div");
    reactRootContainer.style.flexGrow = "1"; 
    tagSelectorWrapper.appendChild(reactRootContainer);

    // 4. ラベル＋セレクトボックス全体を DOM に追加
    this.wrapper.appendChild(tagSelectorWrapper);

    const root = ReactDOM.createRoot(reactRootContainer);
    root.render(
      React.createElement(SearchSelectBox, {
        selectedTag: this.data.selectedTag ?? undefined,
        onTagChange: (selectedTag) => {
          this.data.selectedTag = selectedTag || null;
        },
      })
    );

    const table = document.createElement("table");
    table.className = "table-auto border-none";
    table.style.tableLayout = "fixed";
    container.style.overflowX = 'auto';
    container.style.overflow = "visible";
    table.style.width = "80%";
    table.style.height = "100%";
    table.style.borderCollapse = "collapse";  // セル間のスペースをなくす
    table.style.marginLeft = "-30px"; // 左にずらす
    table.style.position = "relative"; // z-index を効かせる
    table.style.zIndex = "100"; // 高めに設定して被りを防ぐ

    const colgroup = document.createElement("colgroup");
    const colWidths = [40, 40, 150, 150, 100, 200, 200]; // px
    colWidths.forEach(width => {
      const col = document.createElement("col");
      col.style.width = `${width}px`;
      colgroup.appendChild(col);
    });
    table.appendChild(colgroup);

    // thead
    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th></th>
        <th style="vertical-align: middle; text-align: center;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" ><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
        </th>
        <th>単語</th>
        <th>意味</th>
        <th>品詞</th>
        <th>例文</th>
        <th>例文和訳</th>
      </tr>
    `;
    this.addResizeHandleToHeader(thead, table); // ヘッダーのリサイズハンドルを追加
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    tbody.className = "sortable-body"; // 並び替え用のクラスを追加

    // ⛑️ 配列として初期化
    if (!Array.isArray(this.data.words)) {
      this.data.words = [];
    }

    const words = this.data.words;

    words.forEach((row, index) => {
      const tr = this.createRow(row.word, row.meaning, row.partOfSpeech, row.exampleSentence, row.exampleTranslation, index);
      tbody.appendChild(tr);
    });

    

    if (!this.isFirstRowInserted && words.length === 0) {
      // 最初の空行をdata.wordsにも追加
      this.data.words.push({
        isChecked: false,
        word: '',
        meaning: '',
        partOfSpeech: '',
        exampleSentence: '',
        exampleTranslation: ''
      });
  
      // 見せかけの空行をtbodyに追加
      tbody.appendChild(this.createRow('', '', '', '', '', words.length - 1));
      this.isFirstRowInserted = true; // 最初の行を挿入したことをフラグで記録
    }

    table.appendChild(tbody);
    container.appendChild(table);
    this.wrapper.appendChild(container);

    const addButton = document.createElement("button");
    addButton.textContent = "+ 追加";
    addButton.className = "w-full px-4 py-1 bg-white text-xs text-gray-600 text-left rounded hover:bg-gray-200 transition";
    addButton.addEventListener("click", () => {
      if (!Array.isArray(this.data.words)) {
        this.data.words = [];
      }

      const index = this.data.words.length;

      this.data.words.push({
        isChecked: false,
        word: '',
        meaning: '',
        partOfSpeech: '',
        exampleSentence: '',
        exampleTranslation: ''
      });

      const newRow = this.createRow('', '', '', '', '', index);
      tbody.appendChild(newRow);
    });

    const buttonWrapper = document.createElement("div");
    buttonWrapper.className = "flex justify-end mt-2";
    buttonWrapper.appendChild(addButton);
    this.wrapper.appendChild(buttonWrapper);

    // 並び替え機能を tbody に追加
    Sortable.create(tbody, {
      animation: 150,
      handle: ".drag-handle",  // ドラッグハンドルを指定
      ghostClass: "bg-gray-100",  // ドラッグ中のアイテムに適用されるクラス
      onEnd: (evt) => {
        const { oldIndex, newIndex } = evt;
        if (oldIndex == null || newIndex == null) return;
        // 最後の空行は除外（並び替えしない）
        const validLength = this.data.words.length;
    
        if (
          oldIndex != null &&
          newIndex != null &&
          oldIndex !== newIndex &&
          oldIndex < validLength &&
          newIndex < validLength
        ) {
          const moved = this.data.words.splice(oldIndex, 1)[0];
          this.data.words.splice(newIndex, 0, moved);
    
          // 再描画で順序を反映
          this.render(); // render() メソッドを再実行して順序を反映
        }
      },
      // スクロール設定など
      scroll: true,  // 長いリストの場合のスクロールを有効にする
      scrollSensitivity: 50, // スクロール開始の感度
      scrollSpeed: 10,  // スクロール速度
    });
    

    return this.wrapper;
  }

  createRow(word = '', meaning = '', partOfSpeech = '', exampleSentence = '', exampleTranslation = '', index: number) {
    const tr = document.createElement("tr");
    tr.className = "group relative";

    // 操作セル（削除ボタン＋ドラッグハンドル）
    const actionTd = document.createElement("td");
    actionTd.className = `
      w-10 h-full text-center 
      border-none 
      group-hover:border group-hover:border-gray-300 
      transition-all duration-200 
    `;

    // 削除ボタン
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15"fill="currentColor" viewBox="0 0 30 30">
        <path d="M 13 3 A 1.0001 1.0001 0 0 0 11.986328 4 L 6 4 A 1.0001 1.0001 0 1 0 6 6 L 24 6 A 1.0001 1.0001 0 1 0 24 4 L 18.013672 4 A 1.0001 1.0001 0 0 0 17 3 L 13 3 z M 6 8 L 6 24 C 6 25.105 6.895 26 8 26 L 22 26 C 23.105 26 24 25.105 24 24 L 24 8 L 6 8 z"></path>
      </svg>`;
    deleteBtn.title = "削除";
    deleteBtn.className = `
      opacity-0 group-hover:opacity-100 
      text-gray-400 hover:text-gray-800 text-sm 
      inline-flex justify-center mt-1
      transition-opacity duration-200
    `;
    deleteBtn.addEventListener("click", () => {
      if (Array.isArray(this.data.words)) {
        this.data.words.splice(index, 1);
      }
      this.render(); // 再描画でインデックス更新
    });

    // 並び替えハンドル（ドラッグ）
    const dragHandle = document.createElement("span");
    dragHandle.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
        <path d="M2 4.5h12a.5.5 0 0 1 0 1H2a.5.5 0 0 1 0-1zm0 3h12a.5.5 0 0 1 0 1H2a.5.5 0 0 1 0-1zm0 3h12a.5.5 0 0 1 0 1H2a.5.5 0 0 1 0-1z"/>
      </svg>`;
    dragHandle.title = "ドラッグして並び替え";
    dragHandle.className = `
      drag-handle cursor-move text-sm 
      opacity-0 group-hover:opacity-100 
      text-gray-400 hover:text-gray-800 
      inline-flex justify-center mt-1
      transition-opacity duration-200
    `;

    actionTd.appendChild(deleteBtn);
    actionTd.appendChild(dragHandle);
    tr.appendChild(actionTd);

    // チェックボックスセル
    const checkboxTd = document.createElement("td");
    checkboxTd.className = "text-center border-t border-[#e5e7eb]";
    checkboxTd.style.verticalAlign = "middle";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "form-checkbox w-4 h-4 text-blue-600 p-0";
    checkbox.style.marginTop = '6px';

    checkbox.checked = this.data.words[index]?.isChecked ?? false;

    checkbox.addEventListener("change", () => {
      if (Array.isArray(this.data.words) && this.data.words[index]) {
        this.data.words[index].isChecked = checkbox.checked;
      }
    });

    checkboxTd.appendChild(checkbox);
    tr.appendChild(checkboxTd); 

    // データセル追加
    tr.appendChild(this.createEditableCell(word, index, 'word', false));
    tr.appendChild(this.createEditableCell(meaning, index, 'meaning', false));
    tr.appendChild(this.createEditableCell(partOfSpeech, index, 'partOfSpeech',false));
    tr.appendChild(this.createEditableCell(exampleSentence, index, 'exampleSentence', false));
    tr.appendChild(this.createEditableCell(exampleTranslation, index, 'exampleTranslation', true));

    return tr;
  }

  createEditableCell(value: string, index: number, type: 'word' | 'meaning' | 'partOfSpeech' | 'exampleSentence' | 'exampleTranslation', isLastColumn: boolean) {
    const td = document.createElement("td");
    td.className = `border-t border-[#e5e7eb] ${isLastColumn ? 'border-r-none' : 'border-r border-[#e5e7eb]'}`;    

    td.style.padding = '0'; // セルの余白を0に設定
    const textarea = document.createElement("textarea");
    textarea.className = "w-full resize-none";
    textarea.value = value || '';  // 空のセルでも空文字に設定
    textarea.rows = 1;
    textarea.style.overflow = 'hidden';
    textarea.style.display = 'block';
    textarea.style.height = '100%';
    textarea.style.minHeight = '35px';
    textarea.style.fontSize = '16px';
    textarea.style.padding = '0.25rem';
    

    // 自動高さ調整
    const autoResize = () => {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    };

    textarea.addEventListener('keydown', (event) => {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        // `backspace` や `delete` キーが押されたときにセル間を移動しない
        event.stopPropagation(); // イベントの伝播を止めて、セル間移動を防止
      }
    });

    textarea.addEventListener('input', () => {
      autoResize();
      this.adjustRowTextareaHeights();

      if (!Array.isArray(this.data.words)) {
        this.data.words = [];
      }

      if (!this.data.words[index]) {
        this.data.words[index] = {
          isChecked: false,
          word: '',
          meaning: '',
          partOfSpeech: '',
          exampleSentence: '',
          exampleTranslation: '',
        };
      }

      this.data.words[index][type] = textarea.value;
    });

    // セルがクリックされたときにtextareaにフォーカスを当てる
    td.addEventListener('click', () => {
      textarea.focus(); // フォーカスをtextareaに設定
      // セルの内容を即座に同期
      textarea.value = this.data.words[index][type]; // 同期処理
    });
    td.appendChild(textarea);
    autoResize();
    return td;
  }

  // ヘッダーにリサイズハンドルを追加するメソッド
  addResizeHandleToHeader(thead: HTMLElement, table: HTMLTableElement) {
    const thElements = thead.querySelectorAll("th");
    const colElements = table.querySelectorAll("col");

    thElements.forEach((th, index) => {
      if (index === 0) return;

      th.style.position = "relative";
      const handle = document.createElement("div");
      handle.style.position = "absolute";
      handle.style.top = "0";
      handle.style.right = "0";
      handle.style.width = "5px";
      handle.style.height = "100%";
      handle.style.cursor = "col-resize";
      handle.style.zIndex = "10";
      handle.className = "resize-handle";

      th.appendChild(handle);

      let isResizing = false;
      let startX = 0;
      let startWidth = 0;

      const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing) return;
        const delta = e.clientX - startX;
        const col = colElements[index] as HTMLTableColElement;
        const newWidth = Math.max(startWidth + delta, 40);
        col.style.width = `${newWidth}px`;
      };

      handle.addEventListener("mousedown", (e) => {
        isResizing = true;
        startX = e.clientX;        
        const col = colElements[index] as HTMLTableColElement;
        startWidth = col.offsetWidth;

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", () => {
          isResizing = false;
          document.removeEventListener("mousemove", handleMouseMove);
        }, { once: true });
      });
    });
  }

  adjustRowTextareaHeights() {
    const rows = this.wrapper.querySelectorAll("tbody tr");
  
    rows.forEach(row => {
      const textareas = row.querySelectorAll("textarea");
  
      // 1. 全 textarea の高さをリセットして scrollHeight を再計算
      textareas.forEach((ta: HTMLTextAreaElement) => {
        ta.style.height = "auto";
      });
  
      // 2. 最大の高さを取得
      let maxHeight = 0;
      textareas.forEach((ta: HTMLTextAreaElement) => {
        maxHeight = Math.max(maxHeight, ta.scrollHeight);
      });
  
      // 3. 全 textarea にその高さを設定
      textareas.forEach((ta: HTMLTextAreaElement) => {
        ta.style.height = maxHeight + "px";
      });  
    });
  }

  save() {
    return this.data;
  }
}
