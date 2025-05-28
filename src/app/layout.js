import "./globals.css";

export const metadata = {
  title: "Werner Herzog Chatbot",
  description: "Chat with an AI version of Werner Herzog",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
