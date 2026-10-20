import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // IMPORTANTE: Se você for hospedar direto pelo "GitHub Pages" (seunome.github.io/nome-do-repo), 
  // descomente a linha abaixo e coloque o nome exato do seu repositório:
  // base: '/nome-do-seu-repositorio/', 
})