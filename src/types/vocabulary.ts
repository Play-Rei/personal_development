export type VocabularyBook = {
  id: number;
  user_id: number;
  title: string;
  words_count: number;
  checked_words_count: number;
  book_url: string;
  is_archived: boolean;
  created_at: string;
};
