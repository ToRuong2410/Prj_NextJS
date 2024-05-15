"use client";

import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MoreIcon from "@mui/icons-material/MoreVert";
import Container from "@mui/material/Container";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { fetchDefaultImages } from "@/utils/api";
import Image from "next/image";
import ActiveLink from "./active.link";

// styled-components
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      // Kích thước thanh search
      width: "400px",
    },
  },
}));

export default function AppHeader() {
  const { data: session } = useSession();

  // dùng để điều hướng trang -> sử dụng hook trong NextJS là: useRouter
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      //   Chỉnh vị trí khi click vào Avatar
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem>
        <Link
          href={`/profile/${session?.user._id}`}
          style={{ color: "unset", textDecoration: "none" }}
        >
          Profile
        </Link>
      </MenuItem>
      <MenuItem
        style={{ color: "unset", textDecoration: "none" }}
        onClick={() => {
          handleMenuClose();
          signOut();
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {/* {session ? (
        <>
          <ActiveLink href={"/playlist"}>Playlist</ActiveLink>
          <ActiveLink href={"/like"}>Likes</ActiveLink>
          <ActiveLink href={"/track/upload"}>Upload</ActiveLink>
          <Image
            onClick={handleProfileMenuOpen}
            src={fetchDefaultImages(session.user.type)}
            alt="avatar"
            width={35}
            height={35}
          />
        </>
      ) : (
        <>
          <Link href={"/auth/signin"}>Login</Link>
        </>
      )} */}
      {session ? (
        <>
          <MenuItem
            sx={{
              "> a": {
                color: "unset",
                textDecoration: "none",
                "&.active": {
                  color: "red",
                },
              },
            }}
          >
            <ActiveLink href={"/playlist"}>Playlist</ActiveLink>
          </MenuItem>
          <MenuItem
            sx={{
              "> a": {
                color: "unset",
                textDecoration: "none",
                "&.active": {
                  color: "red",
                },
              },
            }}
          >
            <ActiveLink href={"/like"}>Likes</ActiveLink>
          </MenuItem>
          <MenuItem
            sx={{
              "> a": {
                color: "unset",
                textDecoration: "none",
                "&.active": {
                  color: "red",
                },
              },
            }}
          >
            <ActiveLink href={"/track/upload"}>Upload</ActiveLink>
          </MenuItem>
          <MenuItem onClick={handleProfileMenuOpen}>
            <Image
              onClick={handleProfileMenuOpen}
              src={fetchDefaultImages(session?.user?.type)}
              alt="avatar"
              width={35}
              height={35}
            />
          </MenuItem>
        </>
      ) : (
        <MenuItem
          sx={{
            "> a": {
              color: "unset",
              textDecoration: "none",
              "&.active": {
                color: "red",
              },
            },
          }}
        >
          <Link href={"/auth/signin"}>Login</Link>
        </MenuItem>
      )}
    </Menu>
  );

  // dùng để điều hướng đến trang Home
  const handleRedirectHome = () => {
    router.push("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: "#3c4c5c" }}>
        <Container>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" }, cursor: "pointer" }}
              onClick={() => {
                handleRedirectHome();
              }}
            >
              Sound Cloud
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                onKeyDown={(e: any) => {
                  if (e.key === "Enter") {
                    if (e?.target?.value)
                      router.push(`/search?result=${e?.target?.value}`);
                  }
                }}
              />
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: "25px",
                cursor: "pointer",

                "> a": {
                  color: "unset",
                  textDecoration: "none",
                  padding: "5px",
                  "&.active": {
                    backgroundColor: "#3b4a59",
                    color: "#cefaff",
                    borderRadius: "5px",
                  },
                },
              }}
            >
              {/* Kiểm tra xem có thông tin người dùng chưa */}
              {session ? (
                <>
                  <ActiveLink href={"/playlist"}>Playlist</ActiveLink>
                  <ActiveLink href={"/like"}>Likes</ActiveLink>
                  <ActiveLink href={"/track/upload"}>Upload</ActiveLink>
                  <Image
                    onClick={handleProfileMenuOpen}
                    src={fetchDefaultImages(session.user.type)}
                    alt="avatar"
                    width={35}
                    height={35}
                  />
                </>
              ) : (
                <>
                  <Link href={"/auth/signin"}>Login</Link>
                </>
              )}
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
