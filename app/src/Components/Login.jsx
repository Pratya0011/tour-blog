import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { auth } from "./request";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Button, Checkbox, TextField, Typography } from "@mui/material";
import "../Style/Login.css";

function Login() {
  const [toggle, setToggle] = useState(true);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    cPassword: "",
  });
  const onSuccessHandler = (response) => {
    const clientId = response.clientId;
    const cred = jwtDecode(response.credential);
    axios
      .post(`${auth.google}/${clientId}`, {
        name: cred.name,
        email: cred.email,
        picture: cred.picture,
        role: "user",
      })
      .then((res) => {
        toast.success(res.data.message);
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("userId", res.data.userId);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  };

  const onErrorHandler = () => {
    console.log("error");
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (!toggle) {
      if (formState.password === formState.cPassword) {
        axios
          .post(`${auth.signup}`, {
            name: formState.name,
            email: formState.email,
            password: formState.password,
            role: "user",
          })
          .then((response) => {
            if (response.status === 201) {
              toast.success(response.data.message);
              setToggle(true);
            } else {
              toast.error(response.data.message);
            }
          })
          .catch((err) => {
            toast.error(err.response.data.message);
          });
      } else {
        toast.error("Password Donot Match");
      }
    } else {
      axios
        .post(`${auth.login}`, {
          email: formState.email,
          password: formState.password,
        })
        .then((res) => {
          if (res.status === 201) {
            toast.success(res.data.message);
            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            localStorage.setItem("userId", res.data.id);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <Box
          sx={{
            height: "85%",
            width: "40%",
            backgroundColor: "white",
            boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px",
            borderRadius: "10px 0 0px 100px",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "70%",
            }}
          >
            <form
              style={{ width: "70%", height: "100%", padding: "5rem" }}
              onSubmit={onSubmitHandler}
            >
              <Typography sx={{ textAlign: "center" }} variant="h5" mb={2}>
                Welcome Back
              </Typography>
              <Typography
                variant="subtitle1"
                mb={2}
                sx={{ textAlign: "center", color: "grey" }}
              >
                The Faster You Fill up The Faster You Enjoy!
              </Typography>
              {!toggle && (
                <>
                  <Typography mb={1}>Name</Typography>
                  <TextField
                    id="outlined-error"
                    label="Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                    onChange={(e) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        name: e.target.value,
                      }))
                    }
                  />
                </>
              )}
              <Typography mb={1}>Email</Typography>
              <TextField
                id="outlined-error"
                label="Email"
                variant="outlined"
                size="small"
                fullWidth
                required
                onChange={(e) =>
                  setFormState((prevState) => ({
                    ...prevState,
                    email: e.target.value,
                  }))
                }
              />
              <Typography mt={2} mb={1}>
                Password
              </Typography>
              <TextField
                id="outlined-error"
                label="Password"
                variant="outlined"
                size="small"
                type="password"
                fullWidth
                required
                onChange={(e) =>
                  setFormState((prevState) => ({
                    ...prevState,
                    password: e.target.value,
                  }))
                }
              />
              {!toggle && (
                <>
                  <Typography mt={2} mb={1}>
                    Confirm-Password
                  </Typography>
                  <TextField
                    id="outlined-error"
                    label="Confirm-Password"
                    variant="outlined"
                    size="small"
                    type="password"
                    fullWidth
                    required
                    onChange={(e) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        cPassword: e.target.value,
                      }))
                    }
                  />
                </>
              )}
              {toggle && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  mt={1}
                >
                  <Box textAlign="center">
                    <span>
                      <Checkbox />
                    </span>
                    <span>Remember me</span>
                  </Box>
                  <Box>
                    <Typography>Forgot Password</Typography>
                  </Box>
                </Box>
              )}
              <Box mt={1} ml={2}>
                <GoogleLogin
                  onSuccess={onSuccessHandler}
                  onError={onErrorHandler}
                  width={window.innerWidth <= 430 ? "300px" : "1000px"}
                  shape="rectangle"
                  size="medium"
                  theme="outline"
                  logo_alignment="center"
                />
              </Box>
              <Button
                variant="contained"
                sx={{ width: "100%", backgroundColor: "black", marginTop: 2 }}
                type="submit"
              >
                {!toggle ? "Sign up" : "Login"}
              </Button>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "15px",
                  fontWeight: "600",
                  marginTop: "1rem",
                  color: "grey",
                }}
              >
                {toggle ? (
                  <>
                    New Explorer!{" "}
                    <span
                      style={{ color: "black", cursor: "pointer" }}
                      onClick={() => setToggle(false)}
                    >
                      Signup
                    </span>
                  </>
                ) : (
                  <>
                    Back to{" "}
                    <span
                      style={{ color: "black", cursor: "pointer" }}
                      onClick={() => setToggle(true)}
                    >
                      Login
                    </span>
                  </>
                )}
              </div>
            </form>
          </Box>
        </Box>
        <Box className="img">
          <Typography variant="h4" sx={{ color: "white" }}>
            DISCOVER
          </Typography>
          <Typography variant="h3" sx={{ color: "white" }}>
            BY JUST JOINING!
          </Typography>
        </Box>
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        theme="light"
      />
    </>
  );
}

export default Login;
