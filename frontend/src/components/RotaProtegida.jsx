import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

export function RotaAdmin({ children }) {
  if (!authService.isLogado()) return <Navigate to="/" replace />;
  if (!authService.isAdmin()) return <Navigate to="/catalogo" replace />;
  return children;
}

export function RotaCliente({ children }) {
  if (!authService.isLogado()) return <Navigate to="/" replace />;
  return children;
}