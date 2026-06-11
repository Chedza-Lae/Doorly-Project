import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { getUser, type StoredUser } from "../lib/api";

type Props = {
  children: ReactNode;
  roles?: StoredUser["tipo"][];
};

export default function ProtectedRoute({ children, roles }: Props) {
  const location = useLocation();
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(user.tipo)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
