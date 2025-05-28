import "./globals.css";

export const metadata = {
  title: "HerzogBot - Welcome to the Abyss",
  description: "Experience the profound musings of Werner Herzog",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville&family=Special+Elite&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
