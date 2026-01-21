import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 手動載入 Vercel 環境變數
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // 這次我們直接寫入全域物件，不透過 process.env
      '__GEMINI_API_KEY__': JSON.stringify(env.GEMINI_API_KEY || ''),
      // 保留原本的注入作為備援
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      }
    }
  };
});
