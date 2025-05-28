import type { VocabularyBook } from "@/types/vocabulary";

export const mockVocabBooks: VocabularyBook[] = [
  {
    id: 1,
    user_id: 1,
    title: "TOEIC 600",
    words_count: 200,
    checked_words_count: 45,
    book_url: "/vocab/toeic-600",
    is_archived: false,
    created_at: "2025-05-01",
  },
  {
    id: 2,
    user_id: 1,
    title: "英検準1級",
    words_count: 300,
    checked_words_count: 120,
    book_url: "/vocab/eiken-1",
    is_archived: false,
    created_at: "2025-04-25",
  },
  {
    id: 3,
    user_id: 1,
    title: "英単語ターゲット",
    words_count: 500,
    checked_words_count: 305,
    book_url: "/vocab/target",
    is_archived: false,
    created_at: "2025-03-10",
  },
];
