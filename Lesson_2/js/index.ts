import 'phaser';
import { Main } from './game';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 500,
  height: 340,
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
