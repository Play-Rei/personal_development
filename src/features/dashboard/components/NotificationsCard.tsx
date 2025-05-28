import React from "react";

const NotificationsCard = () => {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h2 className="text-lg font-semibold mb-2">通知</h2>
      <ul className="text-sm text-gray-600 space-y-1">
        <li>📢 メール認証を完了してください。</li>
        <li>✅ 新しい単語帳が追加されました。</li>
        <li>🔔 学習リマインダーの設定を確認しましょう。</li>
      </ul>
    </div>
  );
};

export default NotificationsCard;
