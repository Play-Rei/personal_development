import type { Notebook } from "@/types/notebook";

export const mockNotebooks: Notebook[] = [
  {
    id: 1,
    user_id: 101,
    title: "英語学習ノート",
    content_url: "/notebooks/1",
    is_archived: false,
  },
  {
    id: 2,
    user_id: 101,
    title: "数学ノート",
    content_url: "/notebooks/2",
    is_archived: false,
  },
  {
    id: 3,
    user_id: 101,
    title: "歴史ノート（アーカイブ）",
    content_url: "/notebooks/3",
    is_archived: true,
  },
];
