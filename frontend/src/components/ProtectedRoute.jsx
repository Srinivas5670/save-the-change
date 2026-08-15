import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, type }) {
  const customerMobile =
    localStorage.getItem("customerMobile");

  const adminUsername =
    localStorage.getItem("adminUsername");

  if (type === "customer" && !customerMobile) {
    return <Navigate to="/customer-login" replace />;
  }

  if (type === "admin" && !adminUsername) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

export default ProtectedRoute;