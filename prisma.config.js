import { defineConfig } from '@prisma/config'

export default defineConfig({
  migrations: {
    // Wskazujemy Prismie nasz plik z seedami
    seed: 'node prisma/seed.js',
  }
})