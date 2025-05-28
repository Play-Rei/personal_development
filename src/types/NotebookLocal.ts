export type NotebookLocal = {
    id: string;
    title: string;
    contentPath: string;
    updatedAt: string; // ISO文字列で保存
    createdAt: string; // ISO文字列で保存
    isArchived: boolean;
};
  