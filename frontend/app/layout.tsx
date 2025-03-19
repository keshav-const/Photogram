// import type { Metadata } from "next";
// import { Roboto } from "next/font/google";
// import "./globals.css";
// import { Toaster } from "@/components/ui/sonner";
// import ClientProvider from "@/HOC/ClientProvider";

// const font=Roboto({
//   weight:['100','200','300','500','700','900'],
//   subsets:['latin']
// })

// export const metadata: Metadata = {
//   title: "PhotoGram",
//   description: "PhotoGram a Social Media Platfrom",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${font.className} antialiased`}
//       >
//         <ClientProvider>
//         {children}
//         <Toaster/>
//         </ClientProvider>
        
        
//       </body>
//     </html>
//   );
// }
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/store/provider"; // ✅ Import Redux Providers

const font = Roboto({
  weight: ["100", "200", "300", "500", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PhotoGram",
  description: "PhotoGram a Social Media Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <Providers> {/* ✅ Wrap your app inside Redux Providers */}
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
