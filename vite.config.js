import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: '/index.html',
        leads: '/leads-qualifies.html',
        formations: '/formations-ads.html',
        gestion: '/gestion-campagnes.html'
      }
    }
  }
});