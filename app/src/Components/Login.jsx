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
  const [passwordToggle, setPasswordToggle] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    cPassword: "",
  });
  const [errorState, setErrorState] = useState({
    emailError: "",
    passwordError: "",
    emailState: false,
    passwordState: false,
    cPasswordState: false,
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
        setErrorState((prevState) => ({
          ...prevState,
          emailError: "",
          passwordError: "",
          emailState: false,
          passwordState: false,
          cPasswordState: false,
        }));
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
              setErrorState((prevState) => ({
                ...prevState,
                emailError: "",
                passwordError: "",
                emailState: false,
                passwordState: false,
                cPasswordState: false,
              }));
              setFormState((prevState) => ({
                ...prevState,
                name: "",
                email: "",
                password: "",
                cPassword: "",
              }));
              setToggle(true);
            } else {
              toast.error(response.data.message);
            }
          })
          .catch((err) => {
            if (err.response.status === 409) {
              setErrorState((prevState) => ({
                ...prevState,
                emailError: err.response.data.message,
                emailState: true,
              }));
            } else {
              toast.error(err.response.data.message);
            }
          });
      } else {
        setErrorState((prevState) => ({
          ...prevState,
          passwordError: "Password donot match",
          passwordState: true,
          emailState: false,
          emailError: "",
          cPasswordState: true,
        }));
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
            setErrorState((prevState) => ({
              ...prevState,
              emailError: "",
              passwordError: "",
              emailState: false,
              passwordState: false,
              cPasswordState: false,
            }));
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
          if (err.response.status === 404) {
            setErrorState((prevState) => ({
              ...prevState,
              emailError: err.response.data.message,
              passwordError: "",
              passwordState: false,
              emailState: true,
            }));
          } else if (err.response.status === 403) {
            setErrorState((prevState) => ({
              ...prevState,
              passwordError: err.response.data.message,
              passwordState: true,
              emailState: false,
              emailError: "",
            }));
          } else {
            toast.error(err.response.data.message);
          }
        });
    }
  };

  const forgotPassword = () => {
    setPasswordToggle(!passwordToggle);
    setErrorState((prevState) => ({
      ...prevState,
      emailError: "",
      passwordError: "",
      emailState: false,
      passwordState: false,
      cPasswordState: false,
    }));
    setFormState((prevState) => ({
      ...prevState,
      name: "",
      email: "",
      password: "",
      cPassword: "",
    }));
  };

  const toggleHandler = () => {
    setToggle(true)
    setErrorState((prevState) => ({
      ...prevState,
      emailError: "",
      passwordError: "",
      emailState: false,
      passwordState: false,
      cPasswordState: false,
    }));
    setFormState((prevState) => ({
      ...prevState,
      name: "",
      email: "",
      password: "",
      cPassword: "",
    }));
  }

  const passwordReset = (e) => {
    e.preventDefault()
    if(formState.password === formState.cPassword){
      setFormState((prevState) => ({
        ...prevState,
        name: "",
        email: "",
        password: "",
        cPassword: "",
      }));
      axios.post(`${auth.forgotPassword}`,{
        email:formState.email,
        password:formState.password
      }).then((response) => {
        if(response.status === 201){
          toast.success(response.data.message)
          setPasswordToggle(!passwordToggle);
          setFormState((prevState) => ({
            ...prevState,
            name: "",
            email: "",
            password: "",
            cPassword: "",
          }));
          setErrorState((prevState) => ({
            ...prevState,
            emailError: "",
            passwordError: "",
            emailState: false,
            passwordState: false,
            cPasswordState: false,
          }));
        }else {
          toast.error(response.data.message);
        }
      }).catch((err)=>{
        if(err.response.status === 404){
          setErrorState((prevState) => ({
            ...prevState,
            emailError : err.response.data.message,
            emailState:true
          }))
        }else{
          toast.error(err.response.data.message);
        }
      })
    }else{
      setErrorState((prevState) => ({
        ...prevState,
        passwordError: "Password donot match",
        passwordState: true,
        emailState: false,
        emailError: "",
        cPasswordState: true,
      }));
    }
  }
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
            height: "88%",
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
            {!passwordToggle && (
              <form
                style={{ width: "70%", height: "100%"}}
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
                      value={formState.name}
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
                  helperText={errorState.emailError}
                  error={errorState.emailState}
                  id="outlined-error-helper-text"
                  label="Email"
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                  value={formState.email}
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
                  error={errorState.passwordState}
                  id="outlined-error-helper-text"
                  helperText={errorState.passwordError}
                  label="Password"
                  variant="outlined"
                  size="small"
                  type="password"
                  fullWidth
                  required
                  value={formState.password}
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
                    error={errorState.cPasswordState}
                      id="outlined-error"
                      label="Confirm-Password"
                      variant="outlined"
                      size="small"
                      type="password"
                      fullWidth
                      required
                      value={formState.cPassword}
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
                      <Typography
                        style={{ cursor: "pointer" }}
                        onClick={forgotPassword}
                      >
                        Forgot Password
                      </Typography>
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
                        style={{ color: "black", cursor: "pointer", marginBottom:'2rem' }}
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
                        onClick={toggleHandler}
                      >
                        Login
                      </span>
                    </>
                  )}
                </div>
              </form>
            )}
            {passwordToggle && (
              <form style={{ width: "70%", height: "100%", padding: "5rem" }} onSubmit={passwordReset}>
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
                <Typography mb={1}>Email</Typography>
                <TextField
                  error={errorState.emailState}
                  id="outlined-error-helper-text"
                  label="Email"
                  variant="outlined"
                  size="small"
                  helperText={errorState.emailError}
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
                  New-Password
                </Typography>
                <TextField
                  error={errorState.passwordState}
                  id="outlined-error-helper-text"
                  helperText={errorState.passwordError}
                  label="New-Password"
                  variant="outlined"
                  size="small"
                  type="password"
                  value={formState.password}
                  fullWidth
                  required
                  onChange={(e) =>
                    setFormState((prevState) => ({
                      ...prevState,
                      password: e.target.value,
                    }))
                  }
                />
                <Typography mt={2} mb={1}>
                  Confirm-Password
                </Typography>
                <TextField
                  error={errorState.cPasswordState}
                  id="outlined-error"
                  label="Confirm-Password"
                  variant="outlined"
                  size="small"
                  type="password"
                  value={formState.cPassword}
                  fullWidth
                  required
                  onChange={(e) =>
                    setFormState((prevState) => ({
                      ...prevState,
                      cPassword: e.target.value,
                    }))
                  }
                />
                <Button
                  variant="contained"
                  sx={{ width: "100%", backgroundColor: "black", marginTop: 2 }}
                  type="submit"
                >
                  Submit
                </Button>
                <Box textAlign="center" mt={2}>
                  <Typography
                    style={{ cursor: "pointer" }}
                    onClick={forgotPassword}
                  >
                    Back To Login
                  </Typography>
                </Box>
              </form>
            )}
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
