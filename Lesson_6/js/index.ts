import 'phaser';
import { Main } from './main';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  width: 1600,
  height: 900,
  render: {
    pixelArt: true,
    antialias: false,
    antialiasGL: false,
  },
  physics: {
    default: 'arcade',
  },
  scene: [Main],
};

window.addEventListener('load', () => {
  new Phaser.Game(config);
});
