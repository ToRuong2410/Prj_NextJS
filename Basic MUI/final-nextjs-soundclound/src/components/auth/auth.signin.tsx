"use client";

import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const AuthSignIn = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  //   kiểm tra lỗi
  const [isErrorUsername, setIsErrorUsername] = useState<boolean>(false);
  const [isErrorPassword, setIsErrorPassword] = useState<boolean>(false);

  //   thông báo lỗi
  const [errorUsername, setErrorUsername] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");

  const [openMessage, setOpenMessage] = useState<boolean>(false);
  const [resMessage, setResMessage] = useState<string>("");

  const handleSubmit = async () => {
    setIsErrorUsername(false);
    setIsErrorPassword(false);
    setErrorUsername("");
    setErrorPassword("");

    if (!username) {
      setIsErrorUsername(true);
      setErrorUsername("Username is required");
      return;
    }
    if (!password) {
      setIsErrorPassword(true);
      setErrorPassword("Password is required");
      return;
    }
    // gửi lên thông tin "credentials" là đang đăng nhập và mk, và gửi lên thông tin tk mk đó
    const res = await signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
    });

    if (!res?.error) {
      router.push("/");
    } else {
      setResMessage(res.error);
      setOpenMessage(true);
    }
  };

  return (
    <Box
    // sx={{
    //   backgroundImage:
    //     "linear-gradient(to bottom, #ff9aef, #fedac1, #d5e1cf, #b7e6d9)",
    //   backgroundColor: "#b7e6d9",
    //   backgroundRepeat: "no-repeat",
    // }}
    >
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          lg={4}
          sx={{
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          }}
        >
          <div style={{ margin: "20px" }}>
            <Link href={"/"}>
              <ArrowBackIcon />
            </Link>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Avatar>
                <LockIcon color="primary" />
              </Avatar>

              <Typography component="h1">Sign In</Typography>
            </Box>
            <TextField
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              label="Username"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              autoFocus
              name="username"
              error={isErrorUsername}
              helperText={errorUsername}
            />
            <TextField
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              label="Password"
              name="password"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              autoFocus
              type={showPassword ? "text" : "password"}
              error={isErrorPassword}
              helperText={errorPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    >
                      {showPassword === false ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              onClick={handleSubmit}
              sx={{ my: 3 }}
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Log In
            </Button>
            <Divider>Or using</Divider>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "25px",
                mt: 3,
              }}
            >
              <Avatar
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  signIn("github");
                }}
              >
                <GitHubIcon titleAccess="Login with Github" />
              </Avatar>

              <Avatar
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  signIn("google");
                }}
              >
                <GoogleIcon titleAccess="Login with Google" />
              </Avatar>
            </Box>
          </div>
        </Grid>
      </Grid>
      <Snackbar
        open={openMessage}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="error"
          sx={{ width: "100%" }}
          onClose={() => {
            setOpenMessage(false);
          }}
        >
          {resMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
export default AuthSignIn;
