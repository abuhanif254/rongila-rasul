"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Image from "next/image";
import logo from "@/assets/the-brain-landscape-logo.png";
import { IconButton, Stack, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

// icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Link from "next/link";
import { NAV_ITEMS } from "@/utils/navItems";
import Header from "./Header";

function Navbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <Header />
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#1a1a2e",
          boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 56, md: 64 } }}>
            {/* Logo */}
            <Link href="/">
              <Image 
                src={logo} 
                alt="The Brain logo" 
                priority
                style={{ width: "120px", height: "auto", display: "block" }}
              />
            </Link>

            {/* Desktop navigation links */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                gap: 0.5,
              }}
            >
              {NAV_ITEMS.map((item) => (
                <Link key={item.route} href={item.pathname}>
                  <Button
                    sx={{
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      letterSpacing: "0.03em",
                      px: 2,
                      py: 1,
                      borderRadius: 1.5,
                      textTransform: "none",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.12)",
                        color: "#f39c12",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    {item.route}
                  </Button>
                </Link>
              ))}
            </Box>

            {/* Social icons - desktop */}
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Stack direction="row">
                <IconButton component="a" href="https://www.facebook.com/bitulla" target="_blank" sx={{ color: "white", "&:hover": { color: "#4267B2" } }}>
                  <FacebookIcon />
                </IconButton>
                <IconButton component="a" href="https://x.com/MohammadBitull1" target="_blank" sx={{ color: "white", "&:hover": { color: "#1DA1F2" } }}>
                  <TwitterIcon />
                </IconButton>
                <IconButton component="a" href="https://www.youtube.com/@MohammadBitullah" target="_blank" sx={{ color: "white", "&:hover": { color: "#FF0000" } }}>
                  <YouTubeIcon />
                </IconButton>
                <IconButton component="a" href="https://www.instagram.com/bitullah_aj" target="_blank" sx={{ color: "white", "&:hover": { color: "#E1306C" } }}>
                  <InstagramIcon />
                </IconButton>
                <IconButton component="a" href="https://www.linkedin.com/in/md-abu-hanif-mia" target="_blank" sx={{ color: "white", "&:hover": { color: "#0A66C2" } }}>
                  <LinkedInIcon />
                </IconButton>
              </Stack>
            </Box>

            {/* Mobile menu button */}
            <Box sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
              <IconButton
                size="large"
                onClick={handleDrawerToggle}
                sx={{ color: "white" }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: 260,
            backgroundColor: "#1a1a2e",
            color: "white",
          },
        }}
      >
        <Box sx={{ pt: 2 }}>
          <List>
            {NAV_ITEMS.map((item) => (
              <ListItem key={item.route} disablePadding>
                <Link
                  href={item.pathname}
                  style={{ width: "100%", textDecoration: "none", color: "inherit" }}
                  onClick={handleDrawerToggle}
                >
                  <ListItemButton
                    sx={{
                      px: 3,
                      py: 1.5,
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.08)",
                        color: "#f39c12",
                      },
                    }}
                  >
                    <ListItemText
                      primary={item.route}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>

          {/* Social icons in mobile */}
          <Stack direction="row" justifyContent="center" sx={{ mt: 2, gap: 1 }}>
            <IconButton component="a" href="https://www.facebook.com/bitulla" target="_blank" sx={{ color: "white" }}>
              <FacebookIcon />
            </IconButton>
            <IconButton component="a" href="https://x.com/MohammadBitull1" target="_blank" sx={{ color: "white" }}>
              <TwitterIcon />
            </IconButton>
            <IconButton component="a" href="https://www.youtube.com/@MohammadBitullah" target="_blank" sx={{ color: "white" }}>
              <YouTubeIcon />
            </IconButton>
            <IconButton component="a" href="https://www.instagram.com/bitullah_aj" target="_blank" sx={{ color: "white" }}>
              <InstagramIcon />
            </IconButton>
            <IconButton component="a" href="https://www.linkedin.com/in/md-abu-hanif-mia" target="_blank" sx={{ color: "white" }}>
              <LinkedInIcon />
            </IconButton>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;
