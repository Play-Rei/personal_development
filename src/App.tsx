// App.tsx
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/login"; 
import SignUpPage from "./pages/sign_up";
import DashboardPage from "./pages/DashboardPage";
import CreateNotebookPage from "./pages/CreateNotebookPage";
import EditNotebookPage from "./pages/EditNotebookPage";
import CreateVocabkPage from "./features/vocabulary/containers/CreateVocabPage";
import Header from "./shared/components/Header";
import Footer from "./shared/components/Footer";
import DemoDashboardPage from "./features/demo/container/DemoDashBoardPage";
import DemoCreateNotebookPage from "./features/demo/container/DemoCreateNotebookPage";
import DemoEditNotebookPage from "./features/demo/container/DemoEditNotebookPage";
import DemoCreateVocabkPage from "./features/demo/container/DemoCreateVocabPage";
import './styles/main.css';

import { useAuth } from "./contexts/AuthContext";
import PrivateRoute from "./shared/components/PrivateRoute";

function App() {

  const {loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-10">読み込み中...</div>;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header /> {/* ヘッダーを全ページで共通表示 */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign_up" element={<SignUpPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/notebooks/create"
          element={
            <PrivateRoute>
              <CreateNotebookPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/notebooks/edit/:noteId"
          element={
            <PrivateRoute>
              <EditNotebookPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/vocab/create"
          element={
            <PrivateRoute>
              <CreateVocabkPage />
            </PrivateRoute>
          }
        />
        <Route path="/demo" element={<DemoDashboardPage />} />
        <Route path="/demo_notebooks/create" element={<DemoCreateNotebookPage />} />
        <Route path="/demo_notebooks/edit/:noteId" element={<DemoEditNotebookPage />} />
        <Route path="/demo_vocab/create" element={<DemoCreateVocabkPage />} />
      </Routes>
      <Footer /> {/* ヘッダーを全ページで共通表示 */}
    </div>
  );
}

export default App;
