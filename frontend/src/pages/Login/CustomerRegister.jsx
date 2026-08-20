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

function CustomerRegister() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    setMessage("");

    const mobile = mobileNumber.trim();

    // Mobile number validation
    if (!mobile) {
      setMessage("Enter your mobile number.");
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      setMessage(
        "Mobile number must contain exactly 10 digits."
      );
      return;
    }

    // Password validation
    if (!password.trim()) {
      setMessage("Enter a password.");
      return;
    }

    if (password.length < 6) {
      setMessage(
        "Password must be at least 6 characters."
      );
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/customer/register",
        {
          mobileNumber: mobile,
          password: password,
        }
      );

      setMessage(
        "Registration successful! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/customer-login");
      }, 1500);
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data ||
          "Unable to create account.";

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
              Create Account
            </Typography>

            <Typography
              align="center"
              color="text.secondary"
              sx={{ mt: 1, mb: 4 }}
            >
              Join Save The Change
            </Typography>

            <TextField
              label="Mobile Number"
              type="tel"
              fullWidth
              margin="normal"
              value={mobileNumber}
              onChange={(e) =>
                setMobileNumber(e.target.value)
              }
              inputProps={{
                maxLength: 10,
              }}
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

            <TextField
              label="Confirm Password"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                    >
                      {showConfirmPassword ? (
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
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              onClick={handleRegister}
            >
              Sign Up
            </Button>

            <Button
              variant="text"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() =>
                navigate("/customer-login")
              }
            >
              Already have an account? Login
            </Button>

            <Button
              variant="text"
              fullWidth
              onClick={() => navigate("/")}
            >
              ← Back to Home
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default CustomerRegister;