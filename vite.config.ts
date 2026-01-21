import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 關鍵修正：第三個參數傳空字串 ''，代表強制抓取所有環境變數，包含 Vercel 系統變數
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // 這次我們換一個更暴力的全域變數名稱
      'window.__APP_GEMINI_KEY__': JSON.stringify(env.GEMINI_API_KEY || ''),
    },
    resolve: {
      alias: { '@': path.resolve(__dirname, './') }
    }
  };
});
