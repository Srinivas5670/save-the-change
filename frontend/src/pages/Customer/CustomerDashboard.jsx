import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import Navbar from "../../components/Navbar";

function CustomerDashboard() {
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [ticketAmount, setTicketAmount] = useState("");
  const [receiverMobile, setReceiverMobile] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [message, setMessage] = useState("");

  const mobileNumber = localStorage.getItem("customerMobile");

  if (!mobileNumber) {
    window.location.href = "/customer-login";
  }

  // ==============================
  // FETCH CUSTOMER DETAILS
  // ==============================
  const fetchCustomer = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://save-the-change-production.up.railway.app/api/customer/profile/${mobileNumber}`
      );

      setCustomer(response.data);
    } catch (error) {
      setMessage("Unable to load customer details.");
    }
  }, [mobileNumber]);

  // ==============================
  // FETCH TRANSACTIONS
  // ==============================
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://save-the-change-production.up.railway.app/api/transactions/${mobileNumber}`
      );

      setTransactions(response.data);
    } catch (error) {
      setMessage("Unable to load transaction history.");
    }
  }, [mobileNumber]);

  // ==============================
  // LOAD CUSTOMER DATA
  // ==============================
  useEffect(() => {
    fetchCustomer();
    fetchTransactions();
  }, [fetchCustomer, fetchTransactions]);

  // ==============================
  // BUY METRO TICKET
  // ==============================
  const handlePurchase = async () => {
    setMessage("");

    if (!ticketAmount || Number(ticketAmount) <= 0) {
      setMessage("Enter a valid ticket amount.");
      return;
    }

    if (
      customer &&
      Number(ticketAmount) > Number(customer.balance)
    ) {
      setMessage("Insufficient balance.");
      return;
    }

    const confirmed = window.confirm(
      `Purchase metro ticket for ₹${ticketAmount}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await axios.post(
        `https://save-the-change-production.up.railway.app/api/customer/use-balance?mobileNumber=${mobileNumber}&amount=${ticketAmount}`
      );

      setCustomer(response.data);
      setTicketAmount("");
      setMessage("Metro ticket purchased successfully!");

      await fetchTransactions();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to purchase ticket.";

      setMessage(errorMessage);
    }
  };

  // ==============================
  // SEND CHANGE
  // ==============================
  const handleTransfer = async () => {
    setMessage("");

    if (!receiverMobile || !transferAmount) {
      setMessage(
        "Enter receiver mobile number and amount."
      );
      return;
    }

    if (!/^[0-9]{10}$/.test(receiverMobile)) {
      setMessage(
        "Receiver mobile number must contain exactly 10 digits."
      );
      return;
    }

    if (Number(transferAmount) <= 0) {
      setMessage(
        "Transfer amount must be greater than zero."
      );
      return;
    }

    if (receiverMobile === mobileNumber) {
      setMessage(
        "You cannot send money to yourself."
      );
      return;
    }

    if (
      customer &&
      Number(transferAmount) >
        Number(customer.balance)
    ) {
      setMessage("Insufficient balance.");
      return;
    }

    // ==============================
    // CHECK RECEIVER
    // ==============================
    try {
      await axios.get(
        `https://save-the-change-production.up.railway.app/api/customer/profile/${receiverMobile}`
      );
    } catch (error) {
      setMessage(
        "Receiver customer does not exist."
      );
      return;
    }

    // ==============================
    // CONFIRM TRANSFER
    // ==============================
    const confirmed = window.confirm(
      `Send ₹${transferAmount} to ${receiverMobile}?`
    );

    if (!confirmed) {
      return;
    }

    // ==============================
    // PERFORM TRANSFER
    // ==============================
    try {
      const response = await axios.post(
        "https://save-the-change-production.up.railway.app/api/customer/transfer",
        {
          senderMobile: mobileNumber,
          receiverMobile: receiverMobile,
          amount: Number(transferAmount),
        }
      );

      setTransferAmount("");
      setReceiverMobile("");
      setMessage(response.data);

      await fetchCustomer();
      await fetchTransactions();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to transfer change.";

      setMessage(errorMessage);
    }
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
        maxWidth="md"
        sx={{ mt: 5, mb: 6 }}
      >
        {customer && (
          <>
            {/* ==========================
                BALANCE
            ========================== */}
            <Card
              elevation={4}
              sx={{
                borderRadius: 3,
                mb: 3,
              }}
            >
              <CardContent
                sx={{
                  p: 4,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h6"
                  color="text.secondary"
                >
                  Available Change
                </Typography>

                <Typography
                  variant="h2"
                  fontWeight="bold"
                  color="primary"
                  sx={{ my: 2 }}
                >
                  ₹
                  {Number(
                    customer.balance
                  ).toFixed(2)}
                </Typography>

                <Typography color="text.secondary">
                  Use your saved change for metro
                  tickets or send it to another
                  customer.
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  {transactions.length} transaction
                  {transactions.length !== 1
                    ? "s"
                    : ""}
                </Typography>
              </CardContent>
            </Card>

            {/* ==========================
                METRO TICKET
            ========================== */}
            <Card
              elevation={4}
              sx={{
                borderRadius: 3,
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  Buy Metro Ticket
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Enter a ticket amount or select
                  a quick amount.
                </Typography>

                {/* Quick ticket amounts */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    mt: 2,
                  }}
                >
                  {[10, 20, 35, 50].map(
                    (value) => (
                      <Button
                        key={value}
                        variant={
                          Number(ticketAmount) ===
                          value
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() =>
                          setTicketAmount(value)
                        }
                      >
                        ₹{value}
                      </Button>
                    )
                  )}
                </Box>

                <TextField
                  label="Ticket Amount"
                  type="number"
                  fullWidth
                  sx={{ mt: 2 }}
                  value={ticketAmount}
                  inputProps={{
                    min: 0.01,
                    step: 0.01,
                  }}
                  onChange={(e) =>
                    setTicketAmount(
                      e.target.value
                    )
                  }
                />

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                  onClick={handlePurchase}
                >
                  Buy Metro Ticket
                </Button>
              </CardContent>
            </Card>

            {/* ==========================
                SEND CHANGE
            ========================== */}
            <Card
              elevation={4}
              sx={{
                borderRadius: 3,
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  Send Change
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Send your saved change to another
                  Save The Change customer.
                </Typography>

                <Divider sx={{ my: 3 }} />

                <TextField
                  label="Receiver Mobile Number"
                  type="tel"
                  fullWidth
                  value={receiverMobile}
                  inputProps={{
                    maxLength: 10,
                    inputMode: "numeric",
                  }}
                  onChange={(e) =>
                    setReceiverMobile(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                />

                <TextField
                  label="Amount"
                  type="number"
                  fullWidth
                  sx={{ mt: 2 }}
                  value={transferAmount}
                  inputProps={{
                    min: 0.01,
                    step: 0.01,
                  }}
                  onChange={(e) =>
                    setTransferAmount(
                      e.target.value
                    )
                  }
                />

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                  onClick={handleTransfer}
                >
                  Send Change
                </Button>
              </CardContent>
            </Card>

            {/* ==========================
                TRANSACTION HISTORY
            ========================== */}
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
                    Transaction History
                  </Typography>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={
                      fetchTransactions
                    }
                  >
                    Refresh
                  </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                {transactions.length ===
                0 ? (
                  <Typography color="text.secondary">
                    No transactions yet.
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
          </>
        )}
      </Container>
    </>
  );
}

export default CustomerDashboard;