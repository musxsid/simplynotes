import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // This tells Vite to ignore the uploads folder so it doesn't refresh constantly!
      ignored: ['**/uploads/**'] 
    }
  }
})
