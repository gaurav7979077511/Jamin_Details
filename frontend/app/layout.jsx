import './globals.css';

export const metadata = {
  title: 'Vanshawali Viewer',
  description: 'Simple family tree and land view tracker',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
