import {
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Card
          elevation={4}
          sx={{
            borderRadius: 3,
            p: 3,
          }}
        >
          <CardContent>
            <Typography
              variant="h3"
              align="center"
              color="primary"
              fontWeight="bold"
            >
              Save The Change
            </Typography>

            <Typography
              variant="h6"
              align="center"
              sx={{ mt: 1, mb: 5 }}
              color="text.secondary"
            >
              Every Rupee Counts
            </Typography>

            <Stack spacing={3}>
              <Button
                component={Link}
                to="/admin-login"
                variant="contained"
                size="large"
                fullWidth
                sx={{ py: 1.5 }}
              >
                Login as Admin
              </Button>

              <Button
                component={Link}
                to="/customer-login"
                variant="outlined"
                size="large"
                fullWidth
                sx={{ py: 1.5 }}
              >
                Login as Customer
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default Home;