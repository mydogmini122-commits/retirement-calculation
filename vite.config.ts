import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 關鍵：這行就是定義 env 的地方，沒有它後面就會報錯
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // 將 Vercel 的變數強制封裝進全域物件 globalThis
      'globalThis.__GEMINI_API_KEY__': JSON.stringify(env.GEMINI_API_KEY || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      }
    }
  };
});
