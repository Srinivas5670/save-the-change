import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import Navbar from "../../components/Navbar";

function AdminDashboard() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  // ==============================
  // SEARCH CUSTOMER
  // ==============================
  const searchCustomer = async () => {
    setMessage("");
    setCustomer(null);
    setTransactions([]);

    if (!/^[0-9]{10}$/.test(mobileNumber)) {
      setMessage(
        "Customer mobile number must contain exactly 10 digits."
      );
      return;
    }

    try {
      const customerResponse = await axios.get(
        `http://localhost:8080/api/customer/profile/${mobileNumber}`
      );

      setCustomer(customerResponse.data);

      const transactionResponse = await axios.get(
        `http://localhost:8080/api/transactions/${mobileNumber}`
      );

      setTransactions(transactionResponse.data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Customer not found.";

      setMessage(errorMessage);
    }
  };

  // ==============================
  // REFRESH TRANSACTIONS
  // ==============================
  const refreshTransactions = async () => {
    if (!mobileNumber) {
      setMessage("Search for a customer first.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/transactions/${mobileNumber}`
      );

      setTransactions(response.data);
      setMessage("");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to load transactions.";

      setMessage(errorMessage);
    }
  };

  // ==============================
  // SELECT QUICK AMOUNT
  // ==============================
  const selectAmount = (value) => {
    setAmount(value);
    setMessage("");
  };

  // ==============================
  // ADD CUSTOMER CHANGE
  // ==============================
  const handleAddChange = async () => {
    setMessage("");

    if (!customer) {
      setMessage("Search for a customer first.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setMessage("Amount must be greater than zero.");
      return;
    }

    const confirmed = window.confirm(
      `Add ₹${amount} to customer ${mobileNumber}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/customer/add-balance?mobileNumber=${mobileNumber}&amount=${amount}`
      );

      setCustomer(response.data);
      setAmount("");
      setMessage(`₹${amount} added successfully!`);

      await refreshTransactions();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to add change.";

      setMessage(errorMessage);
    }
  };

  // ==============================
  // CLEAR SEARCH
  // ==============================
  const clearCustomer = () => {
    setMobileNumber("");
    setCustomer(null);
    setTransactions([]);
    setAmount("");
    setMessage("");
  };

  // ==============================
  // TRANSACTION LABEL
  // ==============================
  const getTransactionLabel = (type) => {
    switch (type) {
      case "ADD":
        return "Change Added";

      case "USE":
        return "Metro Ticket";

      case "TRANSFER_SENT":
        return "Money Sent";

      case "TRANSFER_RECEIVED":
        return "Money Received";

      default:
        return type;
    }
  };

  // ==============================
  // TRANSACTION SIGN
  // ==============================
  const getTransactionSign = (type) => {
    if (
      type === "ADD" ||
      type === "TRANSFER_RECEIVED"
    ) {
      return "+";
    }

    return "-";
  };

  return (
    <>
      <Navbar />

      <Container
        maxWidth="lg"
        sx={{ mt: 5, mb: 6 }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary"
          sx={{ mb: 1 }}
        >
          Admin Dashboard
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Manage customer saved change
        </Typography>

        <Grid container spacing={3}>
          {/* ==========================
              CUSTOMER MANAGEMENT
          ========================== */}
          <Grid item xs={12} md={7}>
            <Card
              elevation={4}
              sx={{ borderRadius: 3 }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  Customer Management
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, mb: 3 }}
                >
                  Search for a customer using
                  their mobile number.
                </Typography>

                <TextField
                  label="Customer Mobile Number"
                  fullWidth
                  type="tel"
                  value={mobileNumber}
                  inputProps={{
                    maxLength: 10,
                    inputMode: "numeric",
                  }}
                  onChange={(e) =>
                    setMobileNumber(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                />

                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                  onClick={searchCustomer}
                >
                  Search Customer
                </Button>

                <Button
                  variant="text"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={clearCustomer}
                >
                  Clear
                </Button>

                {customer && (
                  <Box sx={{ mt: 4 }}>
                    <Divider sx={{ mb: 3 }} />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Customer Mobile
                    </Typography>

                    <Typography
                      fontWeight="bold"
                      sx={{ mb: 2 }}
                    >
                      {customer.mobileNumber}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Current Balance
                    </Typography>

                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      color="primary"
                      sx={{ mt: 1 }}
                    >
                      ₹
                      {Number(
                        customer.balance
                      ).toFixed(2)}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* ==========================
              ADD CHANGE
          ========================== */}
          <Grid item xs={12} md={5}>
            <Card
              elevation={4}
              sx={{ borderRadius: 3 }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  Add Change
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, mb: 3 }}
                >
                  Add leftover money to the
                  selected customer's wallet.
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {[5, 10, 20, 50].map(
                    (value) => (
                      <Button
                        key={value}
                        variant={
                          Number(amount) === value
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() =>
                          selectAmount(value)
                        }
                      >
                        ₹{value}
                      </Button>
                    )
                  )}
                </Box>

                <TextField
                  label="Custom Amount"
                  type="number"
                  fullWidth
                  sx={{ mt: 3 }}
                  value={amount}
                  inputProps={{
                    min: 0.01,
                    step: 0.01,
                  }}
                  onChange={(e) =>
                    setAmount(
                      e.target.value
                    )
                  }
                />

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                  onClick={handleAddChange}
                >
                  Add Change
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* ==========================
              TRANSACTIONS
          ========================== */}
          <Grid item xs={12}>
            <Card
              elevation={4}
              sx={{ borderRadius: 3 }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                  >
                    Recent Transactions
                  </Typography>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={
                      refreshTransactions
                    }
                    disabled={!customer}
                  >
                    Refresh
                  </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                {!customer ? (
                  <Typography color="text.secondary">
                    Search for a customer to view
                    transactions.
                  </Typography>
                ) : transactions.length === 0 ? (
                  <Typography color="text.secondary">
                    No transactions found.
                  </Typography>
                ) : (
                  transactions.map(
                    (transaction) => (
                      <Box
                        key={transaction.id}
                        sx={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "center",
                          py: 2,
                          borderBottom:
                            "1px solid #eee",
                        }}
                      >
                        <Box>
                          <Typography fontWeight="bold">
                            {getTransactionLabel(
                              transaction.type
                            )}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {new Date(
                              transaction.timestamp
                            ).toLocaleString()}
                          </Typography>
                        </Box>

                        <Typography
                          fontWeight="bold"
                          color={
                            getTransactionSign(
                              transaction.type
                            ) === "+"
                              ? "success.main"
                              : "error.main"
                          }
                        >
                          {getTransactionSign(
                            transaction.type
                          )}
                          ₹
                          {Number(
                            transaction.amount
                          ).toFixed(2)}
                        </Typography>
                      </Box>
                    )
                  )
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* ==========================
            MESSAGE
        ========================== */}
        {message && (
          <Typography
            align="center"
            sx={{ mt: 3 }}
            color={
              message
                .toLowerCase()
                .includes("success")
                ? "success.main"
                : "error.main"
            }
          >
            {message}
          </Typography>
        )}
      </Container>
    </>
  );
}

export default AdminDashboard;