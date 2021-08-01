<template>
  <router-view/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  mounted() {

    if (!localStorage['theme']) {
      localStorage['theme'] = 'light';
    }

    if (localStorage['theme'] == 'dark') {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
    else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    }

  }
})
export default class Main extends Vue {}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
.test {
  border-radius: 25px;
  width: 300px;
  height: 300px;
  @include trans-neumorph-shadow(18px, 20px, 0);
  transition: box-shadow 1s linear;
  background: #ecf0f3;
}

.test:hover {
  @include trans-neumorph-shadow(18px, 20px, 1);
  transition: box-shadow 1s linear;
}

</style>
