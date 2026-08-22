import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import axios from "axios";

function LoginCard({
  title,
  usernameLabel,
  buttonText,
  loginType,
  showSignup = false,
}) {
  const [showPassword, setShowPassword] =
    useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setMessage("");

    // Clear any old login session before starting
    // a new login attempt.
    localStorage.removeItem("customerMobile");
    localStorage.removeItem("adminUsername");

    if (!username.trim() || !password.trim()) {
      setMessage(
        loginType === "admin"
          ? "Enter username and password."
          : "Enter mobile number and password."
      );
      return;
    }

    try {
      const endpoint =
        loginType === "admin"
          ? "https://save-the-change-production.up.railway.app/api/admin/login"
          : "https://save-the-change-production.up.railway.app/api/customer/login";

      const requestBody =
        loginType === "admin"
          ? {
              username: username.trim(),
              password: password,
            }
          : {
              mobileNumber: username.trim(),
              password: password,
            };

      const response = await axios.post(
        endpoint,
        requestBody
      );

      setMessage(response.data);

      if (response.status === 200) {
        if (loginType === "customer") {
          localStorage.setItem(
            "customerMobile",
            username.trim()
          );
        }

        if (loginType === "admin") {
          localStorage.setItem(
            "adminUsername",
            username.trim()
          );
        }

        setTimeout(() => {
          if (loginType === "admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/customer-dashboard");
          }
        }, 500);
      }
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data ||
          "Login failed.";

        setMessage(errorMessage);
      } else {
        setMessage(
          "Unable to connect to the server."
        );
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          elevation={5}
          sx={{
            width: "100%",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h4"
              align="center"
              fontWeight="bold"
              color="primary"
            >
              {title}
            </Typography>

            <Typography
              align="center"
              color="text.secondary"
              sx={{ mt: 1, mb: 4 }}
            >
              Save The Change
            </Typography>

            <TextField
              label={usernameLabel}
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />

            <TextField
              label="Password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {message && (
              <Typography
                align="center"
                sx={{ mt: 2 }}
                color={
                  message
                    .toLowerCase()
                    .includes("successful")
                    ? "success.main"
                    : "error.main"
                }
              >
                {message}
              </Typography>
            )}

            <Button
              variant="text"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate("/")}
            >
              ← Back to Home
            </Button>

            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              onClick={handleLogin}
            >
              {buttonText}
            </Button>

            {showSignup && (
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Don't have an account?
                </Typography>

                <Button
                  variant="text"
                  onClick={() =>
                    navigate("/customer-register")
                  }
                  sx={{ mt: 0.5 }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default LoginCard;