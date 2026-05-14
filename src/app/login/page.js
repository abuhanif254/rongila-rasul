"use client";
import { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/the-brain-logo.png";
import Link from "next/link";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import SecurityIcon from "@mui/icons-material/Security";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const FEATURES = [
  "Manage breaking news articles",
  "Moderate comments & readers",
  "Access analytics dashboard",
  "Control site-wide settings",
];

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // Send token to backend to create session
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (data.status) {
        const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;
        document.cookie = `admin_token=${data.token}; path=/; max-age=${maxAge}`;
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.message || "Authentication failed. Please try again.");
      }
    } catch (firebaseError) {
      console.error("Firebase auth error:", firebaseError);
      
      // Handle Firebase-specific errors
      let errorMessage = "Authentication failed. Please try again.";
      
      if (firebaseError.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password.";
      } else if (firebaseError.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (firebaseError.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (firebaseError.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (firebaseError.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      fontFamily: "'Inter', sans-serif",
      "&:hover fieldset": { borderColor: "#c0392b" },
      "&.Mui-focused fieldset": { borderColor: "#c0392b" },
    },
    "& label.Mui-focused": { color: "#c0392b" },
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      <Grid container sx={{ minHeight: "100vh" }}>
        {/* ── Left brand panel ── */}
        <Grid
          item
          xs={false}
          md={5}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            px: 6,
            background: "linear-gradient(160deg, #1a1a2e 0%, #2c1654 50%, #c0392b 100%)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: "-30%",
              right: "-20%",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.03)",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "-20%",
              left: "-10%",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.03)",
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Link href="/">
              <Image
                src={logo}
                width={80}
                height={80}
                alt="The Brain"
                style={{ filter: "brightness(0) invert(1)", opacity: 0.9, marginBottom: 32, width: 'auto', height: 'auto' }}
              />
            </Link>
            <Typography
              variant="h3"
              fontWeight={900}
              sx={{
                fontFamily: "'Playfair Display', serif",
                color: "white",
                lineHeight: 1.2,
                mb: 2,
              }}
            >
              The Brain
              <br />
              <span style={{ color: "#f39c12" }}>Admin Portal</span>
            </Typography>
            <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.65)", mb: 4, lineHeight: 1.8 }}>
              Central command for The Brain editorial team.
              Secure, fast, and powerful.
            </Typography>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 3 }} />

            <Stack spacing={1.5}>
              {FEATURES.map((f) => (
                <Stack key={f} direction="row" alignItems="center" gap={1.5}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "rgba(243,156,18,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <NewspaperIcon sx={{ fontSize: 13, color: "#f39c12" }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)" }}>
                    {f}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Grid>

        {/* ── Right form panel ── */}
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 3, sm: 6, md: 8 },
            py: 6,
            backgroundColor: "background.default",
          }}
        >
          {/* Back link */}
          <Link href="/" style={{ alignSelf: "flex-start", marginBottom: 24 }}>
            <Stack direction="row" alignItems="center" gap={0.5} sx={{ color: "text.secondary", transition: "color 0.2s", "&:hover": { color: "#c0392b" } }}>
              <ArrowBackIcon fontSize="small" />
              <Typography variant="body2">Back to Home</Typography>
            </Stack>
          </Link>

          <Box sx={{ width: "100%", maxWidth: 440 }}>
            {/* Mobile logo */}
            <Box sx={{ display: { md: "none" }, textAlign: "center", mb: 3 }}>
              <Link href="/">
                <Image src={logo} width={70} height={70} alt="The Brain" style={{ width: 'auto', height: 'auto' }} />
              </Link>
            </Box>

            <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 1.5 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #c0392b, #1a1a2e)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LockIcon sx={{ color: "white", fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={800} sx={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.2 }}>
                  Sign In
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Secure admin access with Firebase
                </Typography>
              </Box>
            </Stack>

            <Paper
              elevation={0}
              sx={{
                p: 0,
                border: "none",
                background: "transparent",
              }}
            >
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2, fontFamily: "'Inter', sans-serif" }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleLogin} noValidate>
                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    label="Admin Email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={fieldSx}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={fieldSx}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((p) => !p)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          size="small"
                          sx={{ color: "#c0392b", "&.Mui-checked": { color: "#c0392b" } }}
                        />
                      }
                      label={<Typography variant="body2">Remember me for 30 days</Typography>}
                    />
                  </Stack>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      background: loading ? undefined : "linear-gradient(135deg, #c0392b, #e74c3c)",
                      py: 1.5,
                      fontWeight: 700,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "1rem",
                      borderRadius: 2.5,
                      textTransform: "none",
                      boxShadow: "0 4px 16px rgba(192,57,43,0.3)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #96281b, #c0392b)",
                        boxShadow: "0 6px 20px rgba(192,57,43,0.45)",
                      },
                    }}
                  >
                    {loading ? "Authenticating…" : "Sign In to Dashboard"}
                  </Button>
                </Stack>
              </Box>

              <Stack direction="row" alignItems="center" gap={1} sx={{ mt: 3, p: 2, borderRadius: 2, backgroundColor: "rgba(0,0,0,0.03)", border: "1px solid", borderColor: "divider" }}>
                <SecurityIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">
                  Protected by Firebase Authentication. Create admin users in Firebase Console.
                </Typography>
              </Stack>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginPage;
