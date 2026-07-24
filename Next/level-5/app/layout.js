import './globals.css';

export const metadata = {
  title: 'AnimBench — Level 5 — Cinematic',
  description: 'React animation rendering performance benchmark — Level 5',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
