<template>
  <div class="logo">
    <div class="logo-first-line">
      <div class="logo-letter outline">C</div>
      <div class="logo-letter">H</div>
      <div class="logo-letter inverted">A</div>
      <div class="logo-letter">T</div>
    </div>
    <div class="logo-second-line">WORDS</div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
export default class Logo extends Vue {}
</script>


<style lang="scss">

.logo {
  max-width: 210px;
  font-size: 42px;
  font-weight: bolder;
  display: flex;
  align-items: center;
  flex-direction: column;
  user-select: none;

  &-first-line {
    display: flex;
    width: 100%;
    color: var(--c_purple);
  }

  &-letter {
    width: 46px;
    height: 46px;
    margin-left: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
  }

  &-letter.outline {
    border: 1px solid var(--c_purple);
  }

  &-letter.inverted {
    color: var(--c_bg);
    background: var(--c_purple);
    transition: color .2s ease-out;
  }

  &-second-line {
    color: var(--c_orange);
  }

}

</style>