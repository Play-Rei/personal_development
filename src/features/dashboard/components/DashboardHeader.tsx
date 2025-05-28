import React from "react";
import { useAuth } from "@/contexts/AuthContext";

const DashboardHeader = () => {

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
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800">ホーム</h1>
      <p className="text-sm text-gray-500">こんにちは、{user.name}さん！ 学習の進捗を確認しましょう。</p>
    </div>
  );
};

export default DashboardHeader;
