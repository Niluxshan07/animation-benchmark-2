import './globals.css';

export const metadata = {
  title: 'AnimBench — Level 1 — Basic CSS Transitions',
  description: 'React animation rendering performance benchmark — Level 1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
