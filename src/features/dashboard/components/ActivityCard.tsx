import React from "react";

const ActivityCard = () => {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h2 className="text-lg font-semibold mb-2">最近のアクティビティ</h2>
      <ul className="text-sm text-gray-600 space-y-1">
        <li>ノート「英会話フレーズ」を編集しました。</li>
        <li>単語帳「TOEIC単語帳」を復習しました。</li>
        <li>ノートを新規作成しました。</li>
      </ul>
    </div>
  );
};

export default ActivityCard;
