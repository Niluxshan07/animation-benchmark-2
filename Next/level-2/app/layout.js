import './globals.css';

export const metadata = {
  title: 'AnimBench — Level 2 — Staggered + Cubic-bezier',
  description: 'React animation rendering performance benchmark — Level 2',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
