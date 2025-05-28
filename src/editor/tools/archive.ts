import Sortable from "sortablejs";

interface WordTableData {
  words: {
    word: string;
    meaning: string;
    partOfSpeech: string;
    exampleSentence: string;
    exampleTranslation: string;
  }[];
}

export default class WordTable {
  static get toolbox() {
    return {
      title: '単語帳',
      icon: '<svg>...</svg>',
    };
  }

  data: WordTableData;
  wrapper: HTMLElement;
  isFirstRowInserted: boolean = false;

  constructor({ data }: { data: WordTableData }) {
    this.data = data || { words: [] };
    this.wrapper = document.createElement("div");
    this.wrapper.className = "word-table";
  }

  render() {
    this.wrapper.innerHTML = '';

    const container = document.createElement("div");
    container.style.overflowX = 'auto';
    container.style.maxWidth = '100%';
    container.style.display = 'block';

    const table = document.createElement("table");
    table.className = "table-auto border-collapse border-none";
    table.style.tableLayout = "fixed";
    table.style.width = "100%";

    // colgroup
    const colgroup = document.createElement("colgroup");
    const colWidths = [40, 150, 150, 120, 200, 200]; // px
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
        <th>単語</th>
        <th>意味</th>
        <th>品詞</th>
        <th>例文</th>
        <th>例文和訳</th>
      </tr>
    `;
    table.appendChild(thead);
    this.addResizeHandleToHeader(thead, table);

    // tbody
    const tbody = document.createElement("tbody");
    tbody.className = "sortable-body";

    const words = this.data.words || [];
    words.forEach((row, index) => {
      const tr = this.createRow(row.word, row.meaning, row.partOfSpeech, row.exampleSentence, row.exampleTranslation, index);
      tbody.appendChild(tr);
    });

    if (!this.isFirstRowInserted && words.length === 0) {
      tbody.appendChild(this.createRow('', '', '', '', '', 0));
      this.isFirstRowInserted = true;
    }

    table.appendChild(tbody);
    container.appendChild(table);
    this.wrapper.appendChild(container);

    // Add Row Button
    const addButton = document.createElement("button");
    addButton.textContent = "+ 追加";
    addButton.className = "mt-2 w-full bg-white text-left text-sm text-gray-600 rounded hover:bg-gray-100 px-2 py-1";
    addButton.addEventListener("click", () => {
      const index = this.data.words.length;
      this.data.words.push({ word: '', meaning: '', partOfSpeech: '', exampleSentence: '', exampleTranslation: '' });
      tbody.appendChild(this.createRow('', '', '', '', '', index));
    });

    this.wrapper.appendChild(addButton);

    // Sortable
    Sortable.create(tbody, {
      animation: 150,
      handle: ".drag-handle",
      ghostClass: "bg-gray-100",
      onEnd: (evt) => {
        const { oldIndex, newIndex } = evt;
        if (
          oldIndex != null &&
          newIndex != null &&
          oldIndex !== newIndex &&
          oldIndex < this.data.words.length &&
          newIndex < this.data.words.length
        ) {
          const moved = this.data.words.splice(oldIndex, 1)[0];
          this.data.words.splice(newIndex, 0, moved);
          this.render();
        }
      },
    });

    return this.wrapper;
  }

  createRow(word: string, meaning: string, partOfSpeech: string, exampleSentence: string, exampleTranslation: string, index: number) {
    const tr = document.createElement("tr");

    const actionTd = document.createElement("td");
    actionTd.className = "text-center";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.title = "削除";
    deleteBtn.addEventListener("click", () => {
      this.data.words.splice(index, 1);
      this.render();
    });

    const dragHandle = document.createElement("span");
    dragHandle.textContent = "☰";
    dragHandle.className = "drag-handle cursor-move ml-1";

    actionTd.appendChild(deleteBtn);
    actionTd.appendChild(dragHandle);
    tr.appendChild(actionTd);

    tr.appendChild(this.createEditableCell(word, index, 'word'));
    tr.appendChild(this.createEditableCell(meaning, index, 'meaning'));
    tr.appendChild(this.createEditableCell(partOfSpeech, index, 'partOfSpeech'));
    tr.appendChild(this.createEditableCell(exampleSentence, index, 'exampleSentence'));
    tr.appendChild(this.createEditableCell(exampleTranslation, index, 'exampleTranslation'));

    return tr;
  }

  createEditableCell(value: string, index: number, type: keyof WordTableData["words"][0]) {
    const td = document.createElement("td");

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.rows = 1;
    textarea.style.width = "100%";
    textarea.style.boxSizing = "border-box";
    textarea.style.resize = "none";
    textarea.style.overflow = "hidden";
    textarea.style.minHeight = "30px";
    textarea.style.fontSize = "14px";

    const autoResize = () => {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    };

    textarea.addEventListener("input", () => {
      autoResize();
      this.data.words[index][type] = textarea.value;
    });

    autoResize();
    td.appendChild(textarea);
    return td;
  }

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

      th.appendChild(handle);

      let isResizing = false;
      let startX = 0;

      const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing) return;
        const delta = e.clientX - startX;
        const col = colElements[index] as HTMLTableColElement;
        const newWidth = Math.max(col.offsetWidth + delta, 50);
        col.style.width = `${newWidth}px`;
        startX = e.clientX;
      };

      handle.addEventListener("mousedown", (e) => {
        isResizing = true;
        startX = e.clientX;

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", () => {
          isResizing = false;
          document.removeEventListener("mousemove", handleMouseMove);
        }, { once: true });
      });
    });
  }

  save() {
    return this.data;
  }
}
