import React from "react";
import { useAuth } from "@/contexts/AuthContext";

const StatsCard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-white p-4 rounded shadow-sm">
        <p className="text-gray-500 text-sm">読み込み中...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white p-4 rounded shadow-sm">
        <p className="text-gray-500 text-sm">ユーザー情報が見つかりません。</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h2 className="text-lg font-semibold mb-2">統計情報</h2>
      <div className="text-sm text-gray-700 space-y-1">
        <p>総ノート数: <strong>{user.notesCount}</strong></p>
        <p>単語帳数: <strong>{user.vocabBooksCount}</strong></p>
        <p>今週の学習時間: <strong>4時間30分</strong></p> {/* 後で動的に */}
      </div>
    </div>
  );
};

export default StatsCard;
