// src/components/modals/OtpDialog.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import client from "../../api/client";

function OtpDialog({ open, onClose, onVerified, initialChannel = null }) {
  const [selectedChannel, setSelectedChannel] = useState(initialChannel); // "email" | "sms" | null
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(""); // success/info messages
  const [error, setError] = useState(""); // error messages

  useEffect(() => {
    if (open) {
      // reset UI each time dialog opens
      setSelectedChannel(initialChannel ?? null);
      setOtp("");
      setInfo("");
      setError("");
    }
  }, [open, initialChannel]);

  // Request (or resend) OTP using the selected channel
  const sendOtp = async (channel) => {
    if (!channel) {
      setError("Please select a channel first.");
      return;
    }
    setLoading(true);
    setError("");
    setInfo("");
    try {
      await client.post(`/users/switch-role/request-otp?channel=${encodeURIComponent(channel)}`);
      setInfo(`OTP sent via ${channel.toUpperCase()}.`);
    } catch (e) {
      console.error("Failed to request OTP:", e);
      setError("Failed to send OTP. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChannel = (ev) => {
    const ch = ev.target.value;
    setSelectedChannel(ch);
    setInfo(""); setError("");
    // Auto-send as soon as user selects a channel (optional). If you prefer manual 'Send' keep that out.
    sendOtp(ch);
  };

  const handleResend = () => {
    sendOtp(selectedChannel);
  };

  const handleVerify = async () => {
    if (!otp || otp.trim().length === 0) {
      setError("Enter the OTP before verifying.");
      return;
    }
    setLoading(true);
    setError("");
    setInfo("");
    try {
      // backend assumed to accept { code: "..." } and return { token: "..." } on success
      const res = await client.post("/users/switch-role/verify-otp", { code: otp.trim() });
      if (res?.data?.token) {
        setInfo("OTP verified.");
        onVerified(res.data.token);
        onClose();
      } else {
        // if your API returns success differently, adapt here
        setError("Verification failed. Please try again.");
      }
    } catch (e) {
      console.error("OTP verify failed:", e);
      // Give friendly message if server reports invalid code
      const msg = e?.response?.data || e?.message || "Verification failed";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  const isChannelChosen = !!selectedChannel;

  return (
    <Dialog open={open} onClose={() => { if (!loading) onClose(); }}>
      <DialogTitle>Verify OTP</DialogTitle>
      <DialogContent sx={{ minWidth: 360 }}>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Choose where you'd like to receive the OTP:
          </Typography>

          <FormControl component="fieldset">
            <FormLabel component="legend">Delivery channel</FormLabel>
            <RadioGroup
              row
              value={selectedChannel ?? ""}
              onChange={handleSelectChannel}
            >
              <FormControlLabel
                value="email"
                control={<Radio />}
                label="Email"
              />
              <FormControlLabel
                value="sms"
                control={<Radio />}
                label="SMS"
              />
            </RadioGroup>
          </FormControl>

          {/* show info / errors */}
          {info && <Alert severity="success">{info}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          {/* Only show OTP input after a channel is chosen (or after auto-send) */}
          {isChannelChosen && (
            <>
              <Typography variant="body2" color="text.secondary">
                Enter the 6-digit code you received via {selectedChannel.toUpperCase()}.
              </Typography>
              <TextField
                label="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                inputProps={{ maxLength: 10 }}
                fullWidth
                autoFocus
              />
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        {/* left side: resend */}
        <Stack direction="row" spacing={1} sx={{ mr: "auto", alignItems: "center" }}>
          <Button
            size="small"
            onClick={handleResend}
            disabled={!isChannelChosen || loading}
          >
            Resend
          </Button>
          {loading && <CircularProgress size={20} />}
        </Stack>

        <Button onClick={() => { if (!loading) onClose(); }} disabled={loading}>
          Close
        </Button>
        <Button
          variant="contained"
          onClick={handleVerify}
          disabled={loading || !isChannelChosen || otp.trim().length === 0}
        >
          Verify
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OtpDialog;
