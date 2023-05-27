import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AUTH_TOKEN } from "constants/AuthConstant";
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
    // admin
    const { email, password, name } = fndata;
    try {
      let adminData = [];
      //   await fetch(`${process.env.REACT_APP_BASE_PATH}/admin`)
      await fetch(`${process.env.REACT_APP_BASE_PATH}/admin`)
        .then((response) => response.json())
        .then((data) => {
          console.log("data", data);
          return adminData.push(data[0]);
        });
      localStorage.setItem(AUTH_TOKEN, adminData[0]._id);
      localStorage.setItem("WALLAT_ADDRRESS", adminData[0].walletAddress);
      return adminData[0]._id;
      // const filteredId = adminData.filter(function (item) {
      //   if (
      //     item["email"] !== fndata["email"] ||
      //     item["password"] !== fndata["password"]
      //   ) {
      //     return false;
      //   } else {
      //     return true;
      //   }
      // });
      // if (filteredId.length > 0) {
      //   const token = filteredId[0]._id;
      //   localStorage.setItem(AUTH_TOKEN, token);
      //   return token;
      // } else {
      //   return rejectWithValue("Unauthenticated User");
      // }

      // dealer

      // try {
      //   console.log("fndata 1");
      //   const response = await fetch(
      //     `${process.env.REACT_APP_BASE_PATH}/signin/${fndata["email"]}`
      //   );
      //   let data = await response.json();
      //   console.log("data", data);
      //   if (!data["password"]) {
      //     return rejectWithValue(data.message);
      //   } else if (data && data["password"] !== fndata["password"]) {
      //     return rejectWithValue("wrong password");
      //   } else {
      //     const token = data._id;
      //     localStorage.setItem(AUTH_TOKEN, token);
      //     return { token, data };
      //   }
      //   // const auth = useAuth();
      //   // const result = await auth.signIn(name, password);
      //   // if (result.success) {
      //   //   // navigate({ pathname: "/success" });
      //   //   console.log("cognito success");
      //   // } else {
      //   //   console.log("cognito failure");
      //   // }
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
    // try {
    //   const response = await FirebaseService.signUpEmailRequest(
    //     email,
    //     password
    //   );
    //   if (response.user) {
    //     const token = response.user.refreshToken;
    //     localStorage.setItem(AUTH_TOKEN, response.user.refreshToken);
    //     return token;
    //   } else {userData
    //     return rejectWithValue(response.message?.replace("Firebase: ", ""));
    //   }
    // } catch (err) {
    //   return rejectWithValue(err.message || "Error");
    // }
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
        `${process.env.REACT_APP_BASE_PATH}/dealer`,
        requestOptions
      );

      let data = await response.json();
      console.log("data", data);
      if (!data) {
        return rejectWithValue(data.message);
      } else {
        const token = data._id;
        localStorage.setItem(AUTH_TOKEN, token);
        return { data, token };
      }
      // try {
      //   const result = await Auth.signUp({
      //     username: email,
      //     password,
      //     attributes: {
      //       email,
      //       name,
      //       phone_number: phone,
      //     },
      //   });
      //   return { success: true, message: "" };
      // } catch (error) {
      //   return {
      //     success: false,
      //     message: "SIGNUP FAIL",
      //   };
      // }
    } catch (err) {
      return rejectWithValue(err.message || "Error");
    }
  }
);

export const signOut = createAsyncThunk("auth/signOut", async () => {
  const response = await FirebaseService.signOutRequest();
  localStorage.removeItem(AUTH_TOKEN);
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
    // .addCase(signInWithGoogle.pending, (state) => {
    // 	state.loading = true
    // })
    // .addCase(signInWithGoogle.fulfilled, (state, action) => {
    // 	state.loading = false
    // 	state.redirect = '/'
    // 	state.token = action.payload
    // })
    // .addCase(signInWithGoogle.rejected, (state, action) => {
    // 	state.message = action.payload
    // 	state.showMessage = true
    // 	state.loading = false
    // })
    // .addCase(signInWithFacebook.pending, (state) => {
    // 	state.loading = true
    // })
    // .addCase(signInWithFacebook.fulfilled, (state, action) => {
    // 	state.loading = false
    // 	state.redirect = '/'
    // 	state.token = action.payload
    // })
    // .addCase(signInWithFacebook.rejected, (state, action) => {
    // 	state.message = action.payload
    // 	state.showMessage = true
    // 	state.loading = false
    // })
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
