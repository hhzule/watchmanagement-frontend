import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AUTH_TOKEN, AUTH_ROLE } from "constants/AuthConstant";
import FirebaseService from "services/FirebaseService";
import { Amplify, Auth } from "aws-amplify";
import { AwsConfigAuth } from "../../configs/Auth";

Amplify.configure({ Auth: AwsConfigAuth });

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
    const { email, password, name, phone } = data;
    console.log("from sihn up", data);
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      };
      const response = await fetch(
        `${process.env.REACT_APP_BASE_PATH}/customersignup`,
        requestOptions
      );

      let data = await response.json();
      // console.log("data", data);
      if (!data) {
        return rejectWithValue(data.message);
      } else {
        const token = data._id;
        localStorage.setItem(AUTH_TOKEN, token);
        localStorage.setItem(AUTH_ROLE, "customer");
        localStorage.setItem("WALLAT_ADDRRESS", data.walletAddress);
        return { data, token };
      }
    } catch (err) {
      return rejectWithValue(err.message || "Error");
    }
  }
);

export const signOut = createAsyncThunk("auth/signOut", async () => {
  const response = await FirebaseService.signOutRequest();
  localStorage.removeItem(AUTH_TOKEN);
  localStorage.removeItem(AUTH_ROLE);
  localStorage.removeItem("WALLAT_ADDRRESS");
  return response.data;
});

// export const signInWithGoogle = createAsyncThunk('auth/signInWithGoogle', async (_, { rejectWithValue }) => {
//     const response = await FirebaseService.signInGoogleRequest()
// 	if (response.user) {
// 		const token = response.user.refreshToken;
// 		localStorage.setItem(AUTH_TOKEN, response.user.refreshToken);
// 		return token;
// 	} else {
// 		return rejectWithValue(response.message?.replace('Firebase: ', ''));
// 	}
// })

// export const signInWithFacebook = createAsyncThunk('auth/signInWithFacebook', async (_, { rejectWithValue }) => {
//     const response = await FirebaseService.signInFacebookRequest()
// 	if (response.user) {
// 		const token = response.user.refreshToken;
// 		localStorage.setItem(AUTH_TOKEN, response.user.refreshToken);
// 		return token;
// 	} else {
// 		return rejectWithValue(response.message?.replace('Firebase: ', ''));
// 	}
// })

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
        state.loading = false;
        state.redirect = "/";
        state.token = action.payload.token;
        state.userData = action.payload.data;
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

// {
//   "email": "dealer1@gmail.com",
//   "name": "1dealerTest",
//   "businessName": "string",
//   "businessRegCertificate": "string",
//   "phoneNumber": "string",
//   "emergencyNumber": "string",
//   "businessAddress": "string",
//   "brandName": "string",
//   "serialNumber": "string",
//   "model": "string",
//   "offers": "string",
//   "walletAddress": "0x3bE264DCdf57F04dA5c3250df1Fe69b88104ac3D",
//   "encryptedPrivateKey": "$2b$10$62HjaYfAkD..TYebVNZACO0NIgebdjN/WnBzQGMgN5m0KfjcmUxFK",
//   "_id": "6471b507a3a1d0585cf697e3",
//   "createdAt": "2023-05-27T07:45:11.264Z",
//   "updatedAt": "2023-05-27T07:45:11.264Z",
//   "__v": 0
// }
