// src/app/layout.jsx
import StoryblokProvider from '@/components/StoryblokProvider';
import './globals.css'; // 存在する場合

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <StoryblokProvider>
          {children}
        </StoryblokProvider>
      </body>
    </html>
  );
}
