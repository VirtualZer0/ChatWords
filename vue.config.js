module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'ru',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: true
    }
  },

  pwa: {
    name: "Chat Words",
    themeColor: "#8F7FF0",
    msTileColor: "#fff",
    manifestPath: "manifest.json?1",
    workboxOptions: {
      skipWaiting: true
    }
  },

  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @use "sass:math";
          @import "@/assets/scss/_mixins.scss";
        `
      }
    }
  }
}
