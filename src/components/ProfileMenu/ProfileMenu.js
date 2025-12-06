import React, { useEffect, useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  Typography,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import SellerRegisterDialog from "../modals/SellerRegisterDialog";
import OtpDialog from "../modals/OtpDialog";

function ProfileMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profile, setProfile] = useState(null);
  const [sellerDialogOpen, setSellerDialogOpen] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const navigate = useNavigate();

  const loadProfile = () => {
    client
      .get("/users/me")
      .then((res) => setProfile(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleBecomeSeller = () => {
    setSellerDialogOpen(true);
    handleMenuClose();
  };

  const handleSwitchToSeller = async () => {
    //await client.post("/users/switch-role/request-otp?channel=email");
    setOtpDialogOpen(true);
    handleMenuClose();
  };




    const handleSwitchToBuyer = async () => {
    try {
      const res = await client.post("/users/switch-role/buyer");
      localStorage.setItem("token", res.data.token);
      loadProfile();
      navigate("/dashboard");  // go back to buyer view
    } catch (e) {
      console.error("Failed to switch to buyer", e);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

    const handleOtpVerified = (newToken) => {
    localStorage.setItem("token", newToken);
    loadProfile();
    navigate("/seller");
  };


  return (
    <>
      <IconButton color="inherit" onClick={handleMenuOpen}>
        <AccountCircle />
        {profile && (
          <Typography sx={{ ml: 1, fontSize: 14 }}>
            {profile.fullName} ({profile.activeRole.toLowerCase()})
          </Typography>
        )}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {profile && !profile.hasSellerProfile && (
        <MenuItem onClick={handleBecomeSeller}>
        <ListItemText primary="Do you want to become a seller?" />
        </MenuItem>
        )}

        {profile && profile.hasSellerProfile && profile.activeRole === "BUYER" && (
        <MenuItem onClick={handleSwitchToSeller}>
        <ListItemText primary="Switch to seller profile (OTP)" />
        </MenuItem>
        )}

        {profile && profile.activeRole === "SELLER" && (
        <MenuItem onClick={handleSwitchToBuyer}>
        <ListItemText primary="Switch to buyer profile" />
        </MenuItem>
        )}

        <MenuItem onClick={() => navigate("/dashboard")}>
          <ListItemText primary="Buyer dashboard" />
        </MenuItem>

        {profile && profile.hasSellerProfile && (
          <MenuItem onClick={() => navigate("/seller")}>
            <ListItemText primary="Seller dashboard" />
          </MenuItem>
        )}

        <MenuItem onClick={handleLogout}>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>

      <SellerRegisterDialog
        open={sellerDialogOpen}
        onClose={() => setSellerDialogOpen(false)}
        onSuccess={loadProfile}
      />

      <OtpDialog
        open={otpDialogOpen}
        onClose={() => setOtpDialogOpen(false)}
        onVerified={handleOtpVerified}
      />
    </>
  );
}

export default ProfileMenu;
