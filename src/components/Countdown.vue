<template>
  <div class="countdown">

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  data: () =>({
    theme: 'light'
  }),

  methods: {
    switchTheme(theme = 'light'): void {
      if (theme == 'dark') {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
      }
      else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
      }

      localStorage['theme'] = theme;
      this.theme = theme;
    }
  },

  mounted () {
    this.theme = localStorage['theme'] ?? 'light';
  }
})
export default class ThemeSwitcher extends Vue {}
</script>


<style lang="scss">

.theme-switcher {

  color: var(--c_purple-basic);
  font-size: 21px;
  font-weight: bold;


  &-title {
    margin-bottom: 21px;
  }

  &-buttons {
    font-size: 41px;
    display: flex;
  }

  &-button {
    height: 67px;
    width: 67px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    transition: box-shadow .1s ease-out;
  }

  &-button.enabled {
    @include trans-neumorph-shadow(6px, 10px, 1);
  }

  &-button.disabled {
    @include trans-neumorph-shadow(6px, 10px, 0);
  }

  &-button.light {
    color: var(--c_orange);
    margin-right: 20px;
  }

}

</style>