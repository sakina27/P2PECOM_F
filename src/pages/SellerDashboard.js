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
} from "@mui/material";
import client from "../api/client";
import ProfileMenu from "../components/ProfileMenu/ProfileMenu";
import AddProductDialog from "../components/modals/AddProductDialog";

function SellerDashboard() {
  const [howToSell, setHowToSell] = useState("");
  const [myProducts, setMyProducts] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const loadData = () => {
    client
      .get("/seller/how-to-sell")
      .then((res) => setHowToSell(res.data.content))
      .catch(() => setHowToSell("Unable to load instructions."));

    client
      .get("/seller/products")
      .then((res) => setMyProducts(res.data))
      .catch(() => setMyProducts([]));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#0f172a" }}>
      <AppBar position="static" sx={{ background: "linear-gradient(90deg,#1d4ed8,#1e293b)" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Seller Center
          </Typography>
          <ProfileMenu />
        </Toolbar>
      </AppBar>

      {/* Hero */}
      <Box
        sx={{
          background: "linear-gradient(135deg,#1d4ed8,#38bdf8)",
          py: 6,
          mb: 0,
          color: "white",
        }}
      >
        <Container>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Manage your shop
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3, maxWidth: 620 }}>
            Track your listings, add new products and keep an eye on how your
            marketplace store is performing.
          </Typography>
          <Chip
            label="Seller mode"
            sx={{ backgroundColor: "rgba(15,23,42,0.2)", color: "white" }}
          />
        </Container>
      </Box>

      <Container sx={{ py: 5 }}>
        {/* Top stats row (dummy numbers) */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: "Active listings", value: myProducts.length || 0 },
            { label: "Orders this week", value: 0 },
            { label: "Total revenue", value: "₹ 0" },
          ].map((stat) => (
            <Grid item xs={12} md={4} key={stat.label}>
              <Paper
                sx={{
                  p: 3,
                  backgroundColor: "#020617",
                  color: "#e5e7eb",
                  borderRadius: 3,
                  boxShadow: "0 12px 30px rgba(15,23,42,0.6)",
                }}
              >
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {stat.label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                  {stat.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          {/* How to sell card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: 3,
                height: "100%",
                boxShadow: "0 12px 30px rgba(15,23,42,0.45)",
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  How to sell effectively
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {howToSell}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Seller products */}
          <Grid item xs={12} md={8}>
            <Box
  sx={{
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    justifyContent: "space-between",
    alignItems: { xs: "flex-start", sm: "center" },
    gap: 2,
    mb: 3,
  }}
>
  <Typography
    variant="h6"
    sx={{ fontWeight: 600, color: "#e5e7eb", pr: 1 }}
  >
    Your products
  </Typography>

  <Button
    variant="contained"
    onClick={() => setAddDialogOpen(true)}
    sx={{
      borderRadius: 2,
      alignSelf: { xs: "stretch", sm: "auto" },
      fontWeight: 600,
    }}
  >
    ADD NEW PRODUCT
  </Button>
</Box>


            {myProducts.length === 0 ? (
              <Typography color="#9ca3af">
                You have no products yet. Click “Add new product” to list your first item.
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {myProducts.map((p) => (
                  <Grid item xs={12} sm={6} key={p.id}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 10px 25px rgba(15,23,42,0.6)",
                      }}
                    >
                      <Box
                        sx={{
                          height: 110,
                          background:
                            "radial-gradient(circle at top,#fee2e2,#f9fafb)",
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
                        <Button size="small" color="error" disabled>
                          Remove (todo)
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>

      <AddProductDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdded={loadData}
      />
    </Box>
  );
}

export default SellerDashboard;
