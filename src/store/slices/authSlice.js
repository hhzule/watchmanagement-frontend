import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AUTH_TOKEN, AUTH_ROLE, EMILUS_USER } from "constants/AuthConstant";
import { act } from "react-dom/test-utils";
import FirebaseService from "services/FirebaseService";

export const initialState = {
  loading: false,
  message: "",
  showMessage: false,
  redirect: "",
  token: localStorage.getItem(AUTH_TOKEN) || null,
  userData: {},
};

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (fndata, { rejectWithValue }) => {
    let adminRole = window.location.pathname.includes("admin");
    let dealerRole = window.location.pathname.includes("dealer");
    console.log("path", adminRole);
    if (adminRole === true) {
      try {
        console.log("ran admin");
        let adminData = [];
        //   await fetch(`${process.env.REACT_APP_BASE_PATH}/admin`)
        await fetch(`${process.env.REACT_APP_BASE_PATH}/admin`)
          .then((response) => response.json())
          .then((data) => {
            console.log("data", data);
            return adminData.push(data[0]);
          });
        const filteredId = adminData.filter(function (item) {
          if (
            item["email"] !== fndata["email"] ||
            item["password"] !== fndata["password"]
          ) {
            return false;
          } else {
            return true;
          }
        });
        if (filteredId.length > 0) {
          const token = filteredId[0]._id;
          localStorage.setItem(AUTH_TOKEN, token);
          localStorage.setItem(AUTH_ROLE, "admin");
          localStorage.setItem("WALLAT_ADDRRESS", filteredId[0].walletAddress);
          localStorage.setItem(EMILUS_USER, filteredId[0].name);
          return token;
        } else {
          return rejectWithValue("Unauthenticated User");
        }
      } catch (err) {
        return rejectWithValue(err.message || "Error");
      }
    } else if (dealerRole === true) {
      try {
        console.log("dealer ran");
        const response = await fetch(
          `${process.env.REACT_APP_BASE_PATH}/signin/${fndata["email"]}`
        );
        let data = await response.json();
        console.log("data", data);
        if (!data["password"]) {
          return rejectWithValue(data.message);
        } else if (data && data["password"] !== fndata["password"]) {
          return rejectWithValue("wrong password");
        } else {
          const token = data._id;
          localStorage.setItem(AUTH_TOKEN, token);
          localStorage.setItem(AUTH_ROLE, "dealer");
          localStorage.setItem("WALLAT_ADDRRESS", data.walletAddress);
          localStorage.setItem(EMILUS_USER, data.name);
          return { token, data };
        }
      } catch (err) {
        return rejectWithValue(err.message || "Error");
      }
    }
    try {
      console.log("customer ran");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_PATH}/customer/${fndata["email"]}`
      );
      let data = await response.json();
      console.log("data", data);
      if (!data["password"]) {
        return rejectWithValue(data.message);
      } else if (data && data["password"] !== fndata["password"]) {
        return rejectWithValue("wrong password");
      } else {
        const token = data._id;
        localStorage.setItem(AUTH_TOKEN, token);
        localStorage.setItem(AUTH_ROLE, "customer");
        localStorage.setItem(EMILUS_USER, data.name);
        localStorage.setItem("WALLAT_ADDRRESS", data.walletAddress);
        return { token, data };
      }
    } catch (err) {
      return rejectWithValue(err.message || "Error");
    }
  }
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (data, { rejectWithValue }) => {
    const { email, password, name, phone, otp, resend } = data;
    console.log("from sign up", data);
    let verify = window.location.pathname.includes("verify");
    if (verify === true) {
      if (resend && resend === true) {
        console.log("from otp");
        try {
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              phone,
            }),
          };
          const response = await fetch(
            `${process.env.REACT_APP_BASE_PATH}/otp`,
            requestOptions
          );
          console.log("response", response);
          if (response.status === 409) {
            return rejectWithValue("Error generating otp");
          }
          let user = JSON.parse(localStorage.getItem("Euser"));
          let token = user.email;
          console.log(" user otp", user);

          return;
          // return "Token sent successfully";
        } catch (err) {
          console.log("error", err);
          return rejectWithValue(err.message || "Error");
        }
      } else {
        console.log("from verify");
        try {
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              email,
              password,
              phone,
              otp,
            }),
          };
          let data;
          await fetch(
            `${process.env.REACT_APP_BASE_PATH}/verify`,
            requestOptions
          )
            .then((response) => response.json())
            .then((rdata) => {
              data = rdata;
            });
          if (!data._id) {
            return rejectWithValue(data.message);
          } else {
            console.log("auth data", data);
            const token = data._id;
            localStorage.setItem(AUTH_TOKEN, token);
            localStorage.setItem(AUTH_ROLE, "customer");
            localStorage.setItem(EMILUS_USER, data.name);
            localStorage.setItem("WALLAT_ADDRRESS", data.walletAddress);
            localStorage.removeItem("Euser");
            return { data, token };
          }
        } catch (err) {
          return rejectWithValue(err.message || "Error");
        }
      }
    } else {
      console.log("from otp");
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            phone,
          }),
        };
        const response = await fetch(
          `${process.env.REACT_APP_BASE_PATH}/otp`,
          requestOptions
        );
        console.log("response", response);
        if (response.status === 409) {
          return rejectWithValue("Error generating otp");
        }
        let user = JSON.parse(localStorage.getItem("Euser"));
        let name = "done";
        return name;
      } catch (err) {
        console.log("error", err);
        return rejectWithValue(err.message || "Error");
      }
    }
  }
);

export const signOut = createAsyncThunk("auth/signOut", async () => {
  const response = await FirebaseService.signOutRequest();
  localStorage.removeItem(AUTH_TOKEN);
  localStorage.removeItem(AUTH_ROLE);
  localStorage.removeItem(EMILUS_USER);
  localStorage.removeItem("WALLAT_ADDRRESS");
  return response.data;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticated: (state, action) => {
      state.loading = false;
      state.redirect = "/";
      state.token = action.payload;
    },
    showAuthMessage: (state, action) => {
      state.message = action.payload;
      state.showMessage = true;
      state.loading = false;
    },
    hideAuthMessage: (state) => {
      state.message = "";
      state.showMessage = false;
    },
    signOutSuccess: (state) => {
      state.loading = false;
      state.token = null;
      state.redirect = "/";
    },
    showLoading: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.loading = false;
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        // console.log("action", action);
        state.loading = false;
        state.redirect = "/";
        // state.token = action.payload.token;
        state.token = action.payload;
        state.userData = action.payload.data;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.redirect = "/";
      })
      .addCase(signOut.rejected, (state) => {
        state.loading = false;
        state.token = null;
        state.redirect = "/";
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        console.log("payload", action);
        state.showMessage = action.payload === "done" ? false : true;
        state.message = action.payload;
        state.loading = false;
        state.redirect = "/";
        state.token = action.payload?.token;
        state.userData = action.payload?.data;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      });
  },
});

export const {
  authenticated,
  showAuthMessage,
  hideAuthMessage,
  signOutSuccess,
  showLoading,
  signInSuccess,
} = authSlice.actions;

export default authSlice.reducer;
