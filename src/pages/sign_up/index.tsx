import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import googleLogo from "../../assets/images/web_neutral_rd_na.svg";  // Googleロゴのパスを設定
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Googleサインアップの処理（仮の実装）
  const handleGoogleSignUp = async () => {
    try {
      // await signInWithPopup(auth, provider);  // Googleのポップアップで認証
      // サインアップ後、ホームページなどにリダイレクト
      window.location.href = "/";  // 任意のリダイレクト先
    } catch (err: any) {
      setError(err.message);
      console.error("SignUp failed: ", err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("すべてのフィールドを入力してください");
    } else if (password !== confirmPassword) {
      setError("パスワードが一致しません");
    } else {
      // サインアップ処理が必要（仮のエラーハンドリング）
      setError(null);

      try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Firestore にユーザー情報を保存
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          name: name,
          createdAt: new Date()
        });

        navigate("/dashboard");
      } catch (error: any) {
        setError(error.message);
        console.error("アカウント作成失敗: ", error.message);
      }    
    }
  };

  return (
    <div className="flex justify-center items-center pt-4">
      <div className="bg-white p-6 rounded-lg w-100">
        <h2 className="text-2xl font-bold mb-4 text-center">サインアップ</h2>

        {/* Googleサインアップボタン */}
        <button
          className="bg-gray-100 text-black px-6 py-2 rounded hover:bg-gray-100 mb-4 flex items-center justify-center space-x-2 border border-gray-300 hover:border-gray-500 w-full"
          onClick={handleGoogleSignUp}
        >
          <img src={googleLogo} alt="Google Logo" className="w-10 h-10" />
          <span>Googleアカウントでサインアップ</span>
        </button>

        {/* Divider */}
        <div className="flex items-center my-4 w-full">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-xs text-gray-500">または</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* エラーメッセージ */}
        {error && <div className="text-red-500 text-xs mb-4">{error}</div>}

        {/* メールアドレスとパスワードのフォーム */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              ニックネーム
            </label>
            <input
              id="name"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="ニックネーム"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              パスワード（確認用）
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="確認用パスワード"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-3"
          >
            サインアップ
          </button>
        </form>

        <div className="mt-3 text-center text-sm">
          <a href="/login" className="text-blue-500 hover:underline">
            すでにアカウントをお持ちですか？ ログイン
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
