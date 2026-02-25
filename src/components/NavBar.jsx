import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Popover,
  Chip,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useAuth } from "../context/AuthContext";

const APP_NAME = "CareConnect";

const ROLE_BADGES = {
  User: "👤 User",
  Admin: "👨‍💼 Admin",
  Logistics: "🚚 Logistics",
};

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const anchorRef = useRef(null);

  const { user, logout } = useAuth();

  const handleNav = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setDrawerOpen(false);
    setProfileOpen(false);
  };

  // ✅ ROLE BASED NAVIGATION (UPDATED)
  const navItems = [];

  if (user?.role === "User") {
    navItems.push(
      { path: "/donate", label: "Donate", icon: <AddCircleOutlineIcon /> },
      { path: "/browse", label: "Browse Items", icon: <StorefrontIcon /> },
      { path: "/my-donations", label: "My Donations", icon: <Inventory2Icon /> },
      { path: "/my-requests", label: "My Requests", icon: <RequestPageIcon /> }
    );
  }

  if (user?.role === "Admin") {
    navItems.push({
      path: "/admin",
      label: "Admin Dashboard",
      icon: <AdminPanelSettingsIcon />,
    });
  }

  if (user?.role === "Logistics") {
    navItems.push({
      path: "/logistics",
      label: "Logistics Dashboard",
      icon: <LocalShippingIcon />,
    });
  }

  const profileDropdown = (
    <Popover
      open={profileOpen}
      anchorEl={anchorRef.current}
      onClose={() => setProfileOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Box sx={{ p: 2, minWidth: 260 }}>
        <Typography fontWeight={600}>
          {user?.name || "User"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.email}
        </Typography>

        <Chip
          label={ROLE_BADGES[user?.role] || user?.role}
          size="small"
          color="primary"
          sx={{ mt: 1, mb: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Popover>
  );

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box
            component="button"
            onClick={() => handleNav("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "inherit",
            }}
          >
            <VolunteerActivismIcon />
            <Typography variant="h6" fontWeight={600}>
              {APP_NAME}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {!isMobile && (
            <>
              {navItems.map(({ path, label }) => (
                <Button
                  key={path}
                  color="inherit"
                  onClick={() => handleNav(path)}
                  sx={{
                    textTransform: "none",
                    fontWeight:
                      location.pathname === path ? 600 : 400,
                  }}
                >
                  {label}
                </Button>
              ))}

              <Box ref={anchorRef}>
                <Button
                  color="inherit"
                  startIcon={<PersonIcon />}
                  endIcon={<ExpandMoreIcon />}
                  onClick={() => setProfileOpen(!profileOpen)}
                  sx={{ textTransform: "none" }}
                >
                  {user?.name}
                </Button>
                {profileDropdown}
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 260 } }}
      >
        <Toolbar>
          <VolunteerActivismIcon sx={{ mr: 1 }} />
          <Typography variant="h6">{APP_NAME}</Typography>
        </Toolbar>

        <List>
          {navItems.map(({ path, label, icon }) => (
            <ListItem key={path} disablePadding>
              <ListItemButton
                selected={location.pathname === path}
                onClick={() => handleNav(path)}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}

          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}