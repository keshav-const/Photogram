// import { User } from "@/types";
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { REHYDRATE } from "redux-persist";
// import { Action } from "redux";

// interface AuthState {
//   user: User | null;
// }

// const initialState: AuthState = {
//   user: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setAuthUser(state, action: PayloadAction<User | null>) {
//       console.log("🟢 Updating Redux state. Payload:", action.payload);
//       state.user = action.payload;
//       console.log("🟢 New Redux state:", state.user);
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(REHYDRATE, (state, action: Action & { payload?: { auth?: AuthState } }) => {
//       console.log("🔄 Redux Persist Rehydrated! Data:", action.payload);
//       return action.payload?.auth || state;
//     });
//   },
// });

// export const { setAuthUser } = authSlice.actions;
// export default authSlice.reducer;
// import { User } from "@/types";
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { REHYDRATE } from "redux-persist";
// import { Action } from "redux";

// interface AuthState {
//   user: User | null;
// }

// const initialState: AuthState = {
//   user: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setAuthUser(state, action: PayloadAction<User | null>) {
//       console.log("🟢 Updating Redux state. Payload:", action.payload);
//       state.user = action.payload;
//       console.log("🟢 New Redux state:", state.user);
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(REHYDRATE, (state, action: Action & { payload?: { auth?: AuthState } }) => {
//       console.log("🔄 Redux Persist Rehydrated! Data:", action.payload);
      
//       // ✅ Ensure Redux Persist Restores Correctly
//       if (action.payload?.auth?.user) {
//         state.user = action.payload.auth.user;
//       }
//     });
//   },
// });

// export const { setAuthUser } = authSlice.actions;
// export default authSlice.reducer;
import { User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";
import { Action } from "redux";

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser(state, action: PayloadAction<User | null>) {
      console.log("🟢 Redux: Updating User State →", action.payload);
      state.user = action.payload;
      console.log("🟢 Redux: New State →", state.user);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action: Action & { payload?: { auth?: AuthState } }) => {
      console.log("🔄 Redux Persist Rehydrated! Data:", action.payload);
      
      if (action.payload?.auth?.user) {
        state.user = action.payload.auth.user;
      } else {
        state.user = null;
      }
    });
  },
});

export const { setAuthUser } = authSlice.actions;
export default authSlice.reducer;
