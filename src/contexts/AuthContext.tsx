import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase"; // Firebaseの設定をインポート
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";

// ユーザー情報の型定義
type UserInfo = {
  uid: string;
  name: string;
  email: string;
  createdAt: string;
  notesCount: number;
  vocabBooksCount: number;
};

type AuthContextType = {
  user: UserInfo | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // ユーザーがログインしている場合、Firestoreからユーザー情報を取得
        try {
          const db = getFirestore();
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          const notesRef = collection(db, "users", firebaseUser.uid, "notes");
          const notesSnap = await getDocs(notesRef);
          const notesCount = notesSnap.size;

          const vocabRef = collection(db, "users", firebaseUser.uid, "vocab_books");
          const vocabSnap = await getDocs(vocabRef);
          const vocabBooksCount = vocabSnap.size;
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUser({
              uid: firebaseUser.uid,
              name: userData.name,
              email: userData.email,
              createdAt: userData.createdAt,
              notesCount,
              vocabBooksCount,
            }); // ユーザー情報を設定
          } else {
            console.error("ユーザー情報がFirestoreに存在しません");
            setUser(null);
          }
        } catch (error) {
          console.error("Firestoreからユーザー情報の取得に失敗:", error);
          setUser(null);
        }
      } else {
        // ユーザーがログアウトしている場合、nullに設定
        setUser(null);
      }
      setLoading(false);
    });

    // クリーンアップ
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
