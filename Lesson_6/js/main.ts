import { Scene } from 'phaser';

type PositionsType = {
  x: number;
  y: number;
};

export class Main extends Scene {
  constructor() {
    super('mainScene');
  }

  // DEMO
  private godMode: false;

  // sprites
  private bg: Phaser.GameObjects.TileSprite;
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private star: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  // enemies
  private skulls: Phaser.Physics.Arcade.Group;
  private skullsSpawnPositions: Array<PositionsType>;

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
    // bg
    this.add.tileSprite(0, 0, this.scale.width * 2, this.scale.height * 2, 'bg');

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
    this.add.tween({
      targets: this.star,
      duration: 700,
      y: this.star.y + 30,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
    });

    // player
    this.player = this.physics.add.sprite(200, this.scale.height - 200, 'player');
    this.player.body.gravity.y = 1300 * 3;
    this.add.tween({
      targets: this.player,
      scaleY: this.player.scaleX === -1 ? -1.07 : 1.07,
      ease: 'Sine.easeInOut',
      repeat: -1,
      yoyo: true,
      duration: 700,
    });

    // enemies
    this.skullsSpawnPositions = [
      { x: 100, y: 100 },
      { x: 1400, y: 200 },
      { x: this.scale.width / 2, y: 100 },
      { x: this.scale.width / 2, y: 500 },
    ];
    this.skulls = this.physics.add.group();
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.addEnemy();
      },
      loop: true,
    });

    // display the score
    this.displayScore = this.add.text(30, 25, 'SCORE: ' + this.score, {
      font: '30px Arial',
      color: '#FFF',
    });

    // Keys listeners
    this.arrow = this.input.keyboard.createCursorKeys();
    this.spaceBar = this.input.keyboard.addKey('space');

    // create world
    this.createWorld();
  }

  update() {
    this.physics.collide(this.player, this.walls);
    this.physics.collide(this.skulls, this.walls);
    this.player.setCollideWorldBounds(true);

    this.movePlayer();

    // die
    if (!this.godMode && this.physics.overlap(this.player, this.water)) {
      this.playerDie();
    }
    if (!this.godMode && this.physics.overlap(this.player, this.skulls)) {
      this.playerDie();
    }

    // star collect
    if (this.physics.overlap(this.player, this.star)) {
      this.takeStar();
    }
  }

  private addEnemy() {
    let spawnPos = Phaser.Math.RND.pick(this.skullsSpawnPositions);

    let enemy = this.skulls.create(spawnPos.x, spawnPos.y, 'skull').setScale(0.7);
    enemy.body.gravity.y = 1300 * 3;
    enemy.body.velocity.x = Phaser.Math.RND.pick([-100, 100]);
    enemy.body.bounce.x = 1;

    enemy.body.setCollideWorldBounds(true);

    this.time.addEvent({
      delay: 10000,
      callback: () => enemy.destroy(),
    });
  }

  private takeStar() {
    let randPosition = Phaser.Math.RND.pick(this.starsPosition);
    this.star.setPosition(randPosition.x, randPosition.y);
    this.score += 1;
    this.displayScore.setText('SCORE: ' + this.score);
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
      this.player.body.velocity.x = -550;
      this.player.scaleX = -1;
    } else if (this.arrow.right.isDown) {
      this.player.body.velocity.x = 550;
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
