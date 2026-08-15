import { Button, AppBar, Toolbar, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const customerMobile =
    localStorage.getItem("customerMobile");

  const adminUsername =
    localStorage.getItem("adminUsername");

  const handleLogout = () => {
    localStorage.removeItem("customerMobile");
    localStorage.removeItem("adminUsername");

    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            color: "white",
            textDecoration: "none",
            flexGrow: 1,
            fontWeight: "bold",
          }}
        >
          Save The Change
        </Typography>

        <Box>
          {!customerMobile && !adminUsername && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/admin-login"
              >
                Admin
              </Button>

              <Button
                color="inherit"
                component={Link}
                to="/customer-login"
              >
                Customer
              </Button>
            </>
          )}

          {(customerMobile || adminUsername) && (
            <Button
              color="inherit"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;