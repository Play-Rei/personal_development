import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type PrivateRouteProps = {
  children: React.JSX.Element;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    // ログインしていないかメールアドレスログインユーザでない場合はログインページへ
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
