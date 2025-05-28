import React from "react";
import type { VocabularyBook } from "@/types/vocabulary";

type Props = {
  vocabBook: VocabularyBook;
};

const VocabularyCard: React.FC<Props> = ({ vocabBook }) => {

  const progress = vocabBook.words_count
    ? Math.min(
        Math.round((vocabBook.checked_words_count / vocabBook.words_count) * 100),
        100
      )
    : 0;
  return (
    <div className="aspect-[3/4] w-48 bg-white rounded-lg shadow flex flex-col justify-between flex-shrink-0 pb-2">
      <div className="h-36 bg-gray-200 rounded-t-lg rounded-b-none" />
      <div>
      <h4 className="text-sm font-semibold truncate px-2 pt-2">{vocabBook.title}</h4>
        <p className="text-xs text-gray-500 px-2">
          作成日: {new Date(vocabBook.created_at).toLocaleDateString()}
        </p>
      </div>
      <div className="flex-1" />
      {/* プログレスバー */}
      <div className="px-2 mt-2">
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-sky-400 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-right text-gray-500 mt-1">{progress}%</p>
      </div>
      <p className="text-xs text-gray-500 px-2">
          合計 {vocabBook.words_count} 単語
      </p>
      <p className="text-xs text-gray-500 px-2">
          チェック済み {vocabBook.checked_words_count} 単語
      </p>
      
    </div>
  );
};

export default VocabularyCard;
