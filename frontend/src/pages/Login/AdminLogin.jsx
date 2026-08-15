import LoginCard from "../../components/LoginCard";

function AdminLogin() {
  return (
    <LoginCard
      title="Admin Login"
      usernameLabel="Username"
      buttonText="Login"
      loginType="admin"
    />
  );
}

export default AdminLogin;