import React, { useState, useEffect } from "react";
import googleLogo from "../../assets/images/web_neutral_rd_na.svg";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase"; 
import { useAuth } from "@/contexts/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

const LoginPage = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Googleログインの処理
  const handleGoogleLogin = async () => {
    // try {
    //   // await signInWithPopup(auth, provider);  // Googleのポップアップで認証
    //   // ログイン後、ホームページなどにリダイレクト
    //   await signInWithEmailAndPassword(auth, email, password);
    //   setError(null);
    //   navigate("/dashboard");
    // } catch (error: any) {
    //   console.error("Login error:", error.code);
    //   if (error.code === "auth/user-not-found") {
    //     setError("ユーザーが見つかりません");
    //   } else if (error.code === "auth/wrong-password") {
    //     setError("パスワードが間違っています");
    //   } else {
    //     setError("ログインに失敗しました");
    //   }
    // }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ログイン処理がないため、ここでは仮のエラーハンドリング
    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください");
    } else {
      try {
        // await signInWithPopup(auth, provider);  // Googleのポップアップで認証
        // ログイン後、ホームページなどにリダイレクト
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        setError(null);
      } catch (error: any) {
        console.error("Login error:", error.code);
        if (error.code === "auth/user-not-found") {
          setError("ユーザーが見つかりません");
        } else if (error.code === "auth/wrong-password") {
          setError("パスワードが間違っています");
        } else {
          setError("ログインに失敗しました");
        }
      }
    }
  };

  

  return (
    <div className="flex justify-center items-center pt-4">
      <div className="bg-white p-6 rounded-lg w-100">
        <h2 className="text-2xl font-bold mb-4 text-center">ログイン</h2>

        {/* Googleログインボタン */}
        <button
          className="bg-gray-100 text-black px-6 py-2 rounded mb-4 flex items-center justify-center space-x-2 border border-gray-300 hover:border-gray-500 w-full"
          onClick={handleGoogleLogin}
        >
            <img src={googleLogo} alt="Google Logo" className="w-10 h-10" />
            <span>Googleアカウントでログイン</span>
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

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-3"
          >
            メールアドレスでログインする
          </button>
        </form>

        <div className="mt-3 text-center text-sm">
          <a href="/dashboard" className="text-blue-500 hover:underline">
            パスワードをお忘れですか？
          </a>
        </div>

        <div className="mt-2 text-center text-sm">
          <a href="/sign_up" className="text-blue-500 hover:underline">
            新規登録
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
