import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/fonts', '@nuxt/image'],
  vite: { plugins: [tailwindcss()] },
  image: {
    format: ['webp'],
    screens: {
      image: 512
    }
  },
  app: {
    head: {
      title: 'Smile!',
      htmlAttrs: {
        lang: 'nl'
      },
      meta: [
        {
          name: 'description',
          content: 'Doe eens even lachen!'
        }
      ]
      // link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
    }
  }
})
