import { Scene } from 'phaser';

export class Main extends Scene {
  constructor() {
    super('mainScene');
  }

  // sprites
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private skull: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private walls: Phaser.Physics.Arcade.StaticGroup;
  private water: Phaser.Physics.Arcade.StaticGroup;

  // keys keyboards
  private arrow: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceBar: Phaser.Input.Keyboard.Key;

  preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('skull', 'assets/skull.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('grass', 'assets/grass.png');
    this.load.image('edgeGrass', 'assets/edgeGrass.png');
    this.load.image('water', 'assets/water.png');
    this.load.image('bg', 'assets/bg.png');
  }

  create() {
    this.add
      .image(this.scale.width / 2, this.scale.height / 2, 'bg')
      .setOrigin(0.5, 0.5)
      .setScale(1.5);
    this.player = this.physics.add.sprite(250, this.game.scale.height - 200, 'player');
    this.player.body.gravity.y = 1300 * 3;

    // Keys listeners
    this.arrow = this.input.keyboard.createCursorKeys();
    this.spaceBar = this.input.keyboard.addKey('space');

    // create world
    this.createWorld();
  }

  update() {
    this.physics.collide(this.player, this.walls);
    this.movePlayer();
    if (this.player.y > this.scale.height) {
      this.playerDie();
    }
  }

  private createWorld() {
    // create empty static group with physics
    this.walls = this.physics.add.staticGroup();
    this.water = this.physics.add.staticGroup();

    // create water bg
    for (let i = 0; i < this.scale.width / 64; i++) {
      this.water.create(i * 64, this.game.scale.height - 20, 'water');
    }

    // create walls
    // left
    for (let i = 0; i < this.scale.width / 64; i++) {
      this.walls.create(32, i * 64, 'ground');
    }
    // right
    for (let i = 0; i < this.scale.width / 64; i++) {
      this.walls.create(this.scale.width - 32, i * 64, 'ground');
    }
    // top
    for (let i = 0; i < this.scale.width / 64; i++) {
      this.walls.create(i * 64, 32, 'ground');
    }
    // bottom
    for (let i = 0; i < this.scale.width / 60; i++) {
      if (i >= 10 && i <= 13) {
        // nothing
      } else if (i === 9) {
        this.walls.create(i * 64, this.game.scale.height - 32, 'edgeGrass').flipX = true;
      } else if (i === 14) {
        this.walls.create(i * 64, this.game.scale.height - 32, 'edgeGrass');
      } else {
        this.walls.create(i * 64, this.game.scale.height - 32, 'grass');
      }
    }
  }

  private playerDie() {
    this.scene.start('mainScene');
  }

  private movePlayer() {
    // left and right
    if (this.arrow.left.isDown) {
      this.player.body.velocity.x = -500;
      this.player.scaleX = -1;
    } else if (this.arrow.right.isDown) {
      this.player.body.velocity.x = 500;
      this.player.scaleX = 1;
    } else {
      this.player.body.velocity.x = 0;
    }

    // up
    if ((this.arrow.up.isDown && this.player.body.onFloor()) || (this.spaceBar.isDown && this.player.body.onFloor())) {
      this.player.body.velocity.y = -1200;
    }
  }
}
