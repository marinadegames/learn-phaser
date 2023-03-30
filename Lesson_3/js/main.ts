import { Scene } from 'phaser';

export class Main extends Scene {
  // sprites
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private skull: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  // keys keyboards
  // private up: Phaser.Input.Keyboard.Key;
  // private left: Phaser.Input.Keyboard.Key;
  // private right: Phaser.Input.Keyboard.Key;
  private arrow: Phaser.Types.Input.Keyboard.CursorKeys;

  preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('skull', 'assets/skull.png');
  }

  create() {
    this.player = this.physics.add.sprite(250, this.game.scale.height - 200, 'player');
    // this.player.body.gravity.y = 500; // added gravity for player

    // Keys listeners
    // this.up = this.input.keyboard.addKey('up');
    // this.left = this.input.keyboard.addKey('left');
    // this.right = this.input.keyboard.addKey('right');
    this.arrow = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.movePlayer();
  }

  private movePlayer() {
    if (this.arrow.left.isDown) {
      this.player.body.velocity.x = -200;
      this.player.scaleX = -1;
    } else if (this.arrow.right.isDown) {
      this.player.body.velocity.x = 200;
      this.player.scaleX = 1;
    } else {
      this.player.body.velocity.x = 0;
    }

    if (this.arrow.up.isDown && this.player.body.onFloor()) {
      this.player.body.velocity.y = -320;
    }
  }
}
