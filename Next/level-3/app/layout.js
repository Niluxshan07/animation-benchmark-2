import './globals.css';

export const metadata = {
  title: 'AnimBench — Level 3 — Advanced Transitions',
  description: 'React animation rendering performance benchmark — Level 3',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
