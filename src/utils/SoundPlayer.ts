export class SoundPlayer {

  private sfxList: string[] = [
    'correct_word.wav',
    'countdown_over.wav',
    'countdown.wav',
    'game_over.wav',
    'level_complete.wav',
    'time_almost_over.wav',
    'goal_reached.wav'
  ];

  private ctx: AudioContext = new window.AudioContext();
  private gainNode: GainNode;
  private sfxCache: {[key: string]: AudioBuffer} = {}
  private loaded = false;

  constructor() {
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = .5;
    this.gainNode.connect(this.ctx.destination);
  }

  loadSfx(): void {

    let loadCount = 0;

    for(let i = 0; i < this.sfxList.length; i++) {

      fetch(`/sfx/${this.sfxList[i]}`)
      .then(res => res.arrayBuffer())
      .then(buffer => this.ctx.decodeAudioData(buffer))
      .then(audio => {
        this.sfxCache[this.sfxList[i].replace('.wav', '')] = audio;
        loadCount ++;

        console.log(`[SFX]\tLoaded ${loadCount}/${this.sfxList.length} sounds`);

        if (loadCount == this.sfxList.length) {
          this.loaded = true;
        }
      });

    }

  }

  playSfx(name: string): void {

    const source = this.ctx.createBufferSource();
    source.buffer = this.sfxCache[name];
    source.connect(this.gainNode);
    source.start();

  }
}

const soundPlayer: SoundPlayer = new SoundPlayer();
export default soundPlayer;