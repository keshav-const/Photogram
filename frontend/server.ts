// if (!process.env.BACKEND_API) {
//     throw new Error("BACKEND_API is not defined in .env.local");
//   }
//   export const BASE_API_URL = process.env.BACKEND_API;
export const BASE_API_URL = process.env.NEXT_PUBLIC_BACKEND_API;
if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_API is not defined in .env.local");
}
