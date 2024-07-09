// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ["usebootstrap"],
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '@/assets/css/styles.scss'
  ]
})