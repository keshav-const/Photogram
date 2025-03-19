import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem() {
      return Promise.resolve();
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== "undefined" 
  ? createWebStorage("local")  // ✅ Use localStorage on the client
  : createNoopStorage();       // ✅ Fallback in SSR

export default storage;
