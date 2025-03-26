// import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// const createNoopStorage = () => {
//   return {
//     getItem() {
//       return Promise.resolve(null);
//     },
//     setItem() {
//       return Promise.resolve();
//     },
//     removeItem() {
//       return Promise.resolve();
//     },
//   };
// };

// const storage = typeof window !== "undefined" 
//   ? createWebStorage("local")  // ✅ Use localStorage on the client
//   : createNoopStorage();       // ✅ Fallback in SSR

// export default storage;
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
  };
};

// ✅ Use LocalStorage only on the client-side
const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

export default storage;
