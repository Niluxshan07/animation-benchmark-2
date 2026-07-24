import './globals.css';

export const metadata = {
  title: 'AnimBench — Level 4 — Spring Physics',
  description: 'React animation rendering performance benchmark — Level 4',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
