import LoginCard from "../../components/LoginCard";

function CustomerLogin() {
  return (
    <LoginCard
      title="Customer Login"
      usernameLabel="Mobile Number"
      buttonText="Login"
      loginType="customer"
      showSignup={true}
    />
  );
}

export default CustomerLogin;