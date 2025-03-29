// import { configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // ✅ LocalStorage ke liye
// import authReducer from "./authSlice"; // ✅ Your auth reducer

// const persistConfig = {
//   key: "root",
//   storage,
// };

// const persistedReducer = persistReducer(persistConfig, authReducer);

// export const store = configureStore({
//   reducer: {
//     auth: persistedReducer, // ✅ Persisted Auth Reducer
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });

// export const persistor = persistStore(store);
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "./storage";
import authReducer from "./authSlice";
import authSlice from "./authSlice";
import postSlice from "./postSlice";

// const persistConfig = {
//   key: "auth", // 🔥 Changed from 'root' to 'auth' to avoid conflicts
//   storage,
// };

// const rootReducer=combineReducers({
//   auth:authSlice,
//   posts:postSlice
// })

// const persistedAuthReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: {
//     auth: persistedAuthReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });

// export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
const persistAuthConfig = {
  key: "auth",
  storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(persistAuthConfig, authSlice), // ✅ Persist only auth
  posts: postSlice, // ❌ No need to persist posts
});

export const store = configureStore({
  reducer: rootReducer, // ✅ Use the corrected rootReducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;