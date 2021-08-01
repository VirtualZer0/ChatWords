module.exports = {

  publicPath: process.env.NODE_ENV === 'production' ? '/ChatWords/' : '/',

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
    manifestPath: "manifest.json?1"
  },

  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/assets/scss/_mixins.scss";
        `
      }
    }
  }
}
