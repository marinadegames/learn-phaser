import { Scene } from 'phaser';

type PositionsType = {
  x: number;
  y: number;
};

export class Main extends Scene {
  constructor() {
    super('mainScene');
  }

  // sprites
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private skull: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private star: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  // display score
  private displayScore: Phaser.GameObjects.Text;
  private score = 0;

  // stars positions
  private starsPosition: Array<PositionsType>;

  // worlds
  private walls: Phaser.Physics.Arcade.StaticGroup;
  private water: Phaser.Physics.Arcade.StaticGroup;

  // keys keyboards
  private arrow: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceBar: Phaser.Input.Keyboard.Key;

  preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('star', 'assets/star.png');
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
      .setScale(1.65);

    // stars
    this.starsPosition = [
      { x: 100, y: 310 },
      { x: 500, y: 120 },
      { x: 1100, y: 120 },
      { x: 1480, y: 310 },
      { x: 500, y: 500 },
      { x: 1100, y: 500 },
      { x: 100, y: 700 },
      { x: 1480, y: 700 },
    ];
    let randPosition = Phaser.Math.RND.pick(this.starsPosition);
    this.star = this.physics.add.sprite(randPosition.x, randPosition.y, 'star').setScale(0.7, 0.7);

    // player
    this.player = this.physics.add.sprite(200, this.scale.height - 200, 'player');
    this.player.body.gravity.y = 1300 * 3;

    // display the score
    this.displayScore = this.add.text(30, 25, 'SCORE: ' + this.score, {
      font: '30px Arial',
      color: '#000',
    });

    // Keys listeners
    this.arrow = this.input.keyboard.createCursorKeys();
    this.spaceBar = this.input.keyboard.addKey('space');

    // create world
    this.createWorld();
  }

  update() {
    this.physics.collide(this.player, this.walls);
    this.movePlayer();

    // die
    if (this.player.y > this.scale.height) {
      this.playerDie();
    }

    // star collect
    if (this.physics.overlap(this.player, this.star)) {
      this.takeStar();
    }
  }

  private takeStar() {
    let randPosition = Phaser.Math.RND.pick(this.starsPosition);
    this.star.setPosition(randPosition.x, randPosition.y);
    this.score += 1;
    this.displayScore.setText('SCORE ' + this.score);
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
    for (let i = 0; i < this.game.scale.width / 500; i++) {
      this.walls.create(i * 64, 430, 'grass');
    }

    // right
    for (let i = 0; i < 10; i++) {
      this.walls.create(this.scale.width - i * 20, 430, 'grass');
    }

    // middle up
    for (let i = 7; i < this.game.scale.width / (64 * 1.35); i++) {
      this.walls.create(i * 64, 250, 'grass');
    }

    // middle down
    for (let i = 7; i < this.game.scale.width / (64 * 1.35); i++) {
      this.walls.create(i * 64, 600, 'grass');
    }

    // bottom ground
    for (let i = 0; i < this.scale.width / 60; i++) {
      if (i >= 10 && i <= 13) {
        // water
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
    this.score = 0;
    this.displayScore.setText('SCORE ' + this.score);
  }

  private movePlayer() {
    // left and right
    if (this.arrow.left.isDown) {
      this.player.body.velocity.x = -600;
      this.player.scaleX = -1;
    } else if (this.arrow.right.isDown) {
      this.player.body.velocity.x = 600;
      this.player.scaleX = 1;
    } else {
      this.player.body.velocity.x = 0;
    }

    // up
    if ((this.arrow.up.isDown && this.player.body.onFloor()) || (this.spaceBar.isDown && this.player.body.onFloor())) {
      this.player.body.velocity.y = -1500;
    }
  }
}
