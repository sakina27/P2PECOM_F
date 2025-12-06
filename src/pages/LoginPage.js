import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Stack,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await client.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at top left,#1e40af,#020617)",
        p: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 1100,
          width: "100%",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
          gap: 4,
          alignItems: "center",
        }}
      >
        {/* Left panel – marketing text */}
        <Box sx={{ color: "white", display: { xs: "none", md: "block" } }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Welcome back
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.85, mb: 3 }}>
            Sign in to continue shopping, manage your seller profile and keep
            track of your marketplace activity.
          </Typography>
          <Stack spacing={1.5} sx={{ opacity: 0.9 }}>
            <Typography variant="body1">• Curated tech deals daily</Typography>
            <Typography variant="body1">
              • Secure payments & buyer protection
            </Typography>
            <Typography variant="body1">
              • Switch between buyer and seller in one click
            </Typography>
          </Stack>
        </Box>

        {/* Right panel – login card */}
        <Card
          sx={{
            maxWidth: 430,
            width: "100%",
            mx: "auto",
            borderRadius: 4,
            boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              align="center"
              sx={{ mb: 1, fontWeight: 600 }}
            >
              Marketplace Login
            </Typography>
            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Access your buyer and seller accounts with one login.
            </Typography>

            <form onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && (
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    py: 1.4,
                    mt: 1,
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  Login
                </Button>
              </Stack>
            </form>

            <Divider sx={{ my: 3 }} />
            <Typography variant="body2" align="center">
              New here?{" "}
              <Link
                component="button"
                onClick={() => navigate("/register")}
                underline="hover"
              >
                Create an account
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default LoginPage;
