import "./globals.css";

export const metadata = {
  title: "Wealth Management System",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
