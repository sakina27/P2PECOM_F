import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  Stack,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import client from "../api/client";
import ProfileMenu from "../components/ProfileMenu/ProfileMenu";

function BuyerDashboard() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    client.get("/products").then((res) => setProducts(res.data));
  }, []);

  const filteredProducts = products.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  });

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <AppBar
        position="static"
        sx={{ background: "linear-gradient(90deg,#2563eb,#1d4ed8)" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Marketplace
          </Typography>
          <ProfileMenu />
        </Toolbar>
      </AppBar>

      {/* Hero section */}
      <Box
        sx={{
          background: "linear-gradient(135deg,#e0f2fe,#ffffff)",
          py: 6,
          mb: 4,
          borderBottom: "1px solid rgba(15,23,42,0.06)",
        }}
      >
        <Container>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Hi there 👋
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: 620 }}
          >
            Discover trending tech, gadgets and accessories curated just for
            you. Switch to seller mode anytime and turn your ideas into a
            storefront.
          </Typography>
          <Stack spacing={1.5} direction={{ xs: "column", sm: "row" }}>
            <Chip label="Free shipping on top picks" color="primary" />
            <Chip label="Secure payments" variant="outlined" />
            <Chip label="Easy returns" variant="outlined" />
          </Stack>
        </Container>
      </Box>

      <Container sx={{ pb: 8 }}>
        {/* Search + categories row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 1 }}
            >
              Browse by category
            </Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              {[
                "Headphones",
                "Keyboards",
                "Gaming",
                "Mobiles",
                "Smart TV",
                "Accessories",
              ].map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  sx={{
                    borderRadius: 999,
                    backgroundColor: "#e5edff",
                    "&:hover": { backgroundColor: "#d6e0ff" },
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* Search bar */}
          <TextField
            placeholder="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{
              width: { xs: "100%", md: 320 },
              backgroundColor: "white",
              borderRadius: 2,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Products */}
        <Typography variant="h5" mb={3} sx={{ fontWeight: 600 }}>
          Recommended for you
        </Typography>

        <Grid container spacing={3} mb={8}>
          {filteredProducts.map((p) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
                  "&:hover": {
                    boxShadow: "0 14px 30px rgba(15,23,42,0.14)",
                    transform: "translateY(-4px)",
                    transition: "all 0.2s ease",
                  },
                }}
              >
                <Box
                  sx={{
                    height: 130,
                    background:
                      "radial-gradient(circle at top,#bfdbfe,#eff6ff)",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {p.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, minHeight: 40 }}
                  >
                    {p.description}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    ₹ {p.price}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button size="small">View</Button>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ ml: "auto", borderRadius: 2 }}
                  >
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Why shop with us – clearly separated section */}
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 2 }}
          >
            Why shop with Marketplace?
          </Typography>

          <Grid container spacing={3} alignItems="stretch">
            {[
              {
                title: "Handpicked products",
                text: "Only a curated set of items appear on your home feed to keep decisions simple.",
              },
              {
                title: "Verified sellers",
                text: "Seller onboarding requires OTP and profile verification to keep the platform safe.",
              },
            ].map((item) => (
              <Grid item xs={12} md={4} key={item.title}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    boxShadow: "0 8px 20px rgba(15,23,42,0.08)",
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.text}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default BuyerDashboard;
