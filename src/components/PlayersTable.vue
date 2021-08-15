<template>
  <div class="players-table">
    <div class="players-table-alltime">
      <div class="players-table-subtitle">{{$t('playersTableAllTime')}}</div>

      <div class="players-table-empty" v-if="allTime.length == 0">
        <span class="mdi mdi-account-outline">0</span>
        {{$t('noPlayersInTable')}}
      </div>

      <div class="players-table-item" v-for="(player, place) in allTime" :key="player.name">
        <div class="players-table-item-name">
          <span v-if="place == 0" class="mdi mdi-trophy"/>
          <span v-if="place == 1 || place == 2" class="mdi mdi-medal"/>
          {{player.name}}
        </div>
        <div class="players-table-item-points">{{player.points}}</div>
      </div>

    </div>
    <div class="players-table-lastlevel">
      <div class="players-table-subtitle">{{$t('playersTableLastLevel')}}</div>

      <div class="players-table-empty" v-if="allTime.length == 0">
        <span class="mdi mdi-account-outline">0</span>
        {{$t('noPlayersInTable')}}
      </div>

      <div class="players-table-item" v-for="(player, place) in lastLevel" :key="player.name">
        <div class="players-table-item-name">
          <span v-if="place == 0" class="mdi mdi-trophy"/>
          <span v-if="place == 1 || place == 2" class="mdi mdi-medal"/>
          {{player.name}}
        </div>
        <div class="players-table-item-points">{{player.points}}</div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import Player from '@/utils/game/Player';
import { Options, Vue } from 'vue-class-component';

@Options({

  data: () => ({
    allTime: [],
    lastLevel: []
  }),

  beforeMount() {
    this.allTime = this.$store.state.gameState.players
      .sort((p1: Player, p2: Player) => {
        return p2.allPoints - p1.allPoints
      })
      .map((p: Player) => {
        return {name: p.name, points: p.allPoints}
      });

    this.lastLevel = this.$store.state.gameState.players
      .sort((p1: Player, p2: Player) => p2.lastPoints - p1.lastPoints)
      .filter((p: Player) => p.lastPoints > 0)
      .map((p: Player) => ({name: p.name, points: p.lastPoints}));
  },
})
export default class PlayersTable extends Vue {}
</script>


<style lang="scss">

.players-table {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 50px;
  width: calc(100% - 100px);
  padding: 0 50px;

  &-alltime, &-lastlevel {

    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    border-radius: 20px;

  }

  &-subtitle {

    text-align: center;
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
    color: var(--c_orange);

  }

  &-empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 20vh;
    font-size: 28px;
    color: var(--c_purple);
    font-weight: 500;

    .mdi {
      font-size: 75px;
      color: var(--c_red);
    }
  }

  &-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    padding: 0 25px;
    border-radius: 20px;
    @include trans-neumorph-shadow(5px, 8px, 1);
    font-size: 21px;
    color: var(--c_purple);
    font-weight: 500;
  }

  &-item:nth-child(-n+4) {
    font-weight: bold;
  }

  &-item:nth-child(2) {
    color: var(--c_red);
  }

  &-item:nth-child(3), &-item:nth-child(4) {
    color: var(--c_orange);
  }
}

</style>