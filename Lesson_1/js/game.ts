import { Scene } from 'phaser';

// EXAMPLE CLASS
class ExampleMain {
  // Game has three methods: preload, create and update
  // these methods will be called in this order:
  // preload() => create() => update() => update() => update() => etc.

  preload() {
    // this method is called once at the beginning
    // It will load all the assets, like sprites and sounds
  }

  create() {
    // this method is called once, just after "preload()"
    // it will initialize our scene, like the positions of the sprites
  }

  update() {
    // this method is called 60 times per second after "create()"
    // it will handle all the game's logic, like movements
  }
}

export class Main extends Scene {
  player: any;

  preload() {
    // load asset
    this.load.image('player', 'assets/skull.png');
  }
  create() {
    // added the player to the center of the screen
    this.player = this.physics.add.sprite(250, 170, 'player').setScale(0.2, 0.2);
  }
  update() {
    // increment the player angle 60 times per second
    this.player.angle++;
  }
}
