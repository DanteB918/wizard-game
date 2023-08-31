import 'phaser';

/*
*   GAME CONTROLS:
*   left & right arrows to move
*   space bar to jump
*   Enter key will mute the music in game.
*   Z & X are the attack moves,  Z being light, X being heavy.
*
*/
class Scene1 extends Phaser.Scene {
    constructor(){
        super("playGame");
    }

    preload(){
        //Load in font
        function loadFont(name, url) {
            var newFont = new FontFace(name, `url(${url})`);
            newFont.load().then(function (loaded) {
                document.fonts.add(loaded);
            }).catch(function (error) {
                return error;
            });
        }
        loadFont("Press Start 2P", "assets/fonts/PressStart2P-Regular.ttf");

        //Load in Audio
        this.load.audio("theme-song", ["assets/audio/devil-tower-1.mp3"]);
        //Load in Images
        this.load.image('bg1', 'assets/backgrounds/game_background_1.png' );
        this.load.image('spike', 'assets/tile-sheet/spikes.png');

        //Load in Sprites. 

        /*
        *   Main char sprite + animations
        */
        this.load.spritesheet('wiz-idle', 'assets/Idle.png', {
            frameWidth: 250,
            frameHeight: 250
        });
        this.load.spritesheet('wiz-move', 'assets/Run.png', {
            frameWidth: 250,
            frameHeight: 250
        });
        this.load.spritesheet('wiz-jump', 'assets/Jump.png', {
            frameWidth: 250,
            frameHeight: 250
        });
        this.load.spritesheet('wiz-atk-1', 'assets/Attack1.png', {
            frameWidth: 250,
            frameHeight: 250
        });
        this.load.spritesheet('wiz-atk-2', 'assets/Attack2.png', {
            frameWidth: 250,
            frameHeight: 250
        });
        this.load.spritesheet('wiz-dmged', 'assets/damaged.png', {
            frameWidth: 250,
            frameHeight: 250
        });
        this.load.spritesheet('wiz-fall', 'assets/Fall.png', {
            frameWidth: 250,
            frameHeight: 250
        });
        this.load.spritesheet('wiz-death', 'assets/Death.png', {
            frameWidth: 250,
            frameHeight: 250
        });
        /*
        *   End main char, begin skeleton sprite
        */
        this.load.spritesheet('skeleton-idle', 'assets/sprites/skeletons/Idle.png', {
            frameWidth:  150,
            frameHeight: 100
        });
        this.load.spritesheet('skeleton-damage', 'assets/sprites/skeletons/damaged.png', {
            frameWidth:  150,
            frameHeight: 100
        });
        this.load.spritesheet('skeleton-death', 'assets/sprites/skeletons/Death.png', {
            frameWidth:  150,
            frameHeight: 100
        });
        /*
        *   End skeleton sprite
        */
        //Load in Layers.
        this.load.image('base_tiles', 'assets/tile-sheet/tile-set.png')
        this.load.tilemapTiledJSON('tilemap', 'assets/tile-sheet/the-map.json');
    }
    create(){
    
    //bg image
    this.bg1 = this.add.image(0,0, 'bg1').setOrigin(0, 0);
    this.bg1.displayWidth = this.sys.canvas.width;
    this.bg1.displayHeight = this.sys.canvas.height;
    this.themeSong = this.sound.add("theme-song", { loop: true });

    //Audio
    this.themeSong = this.sound.add("theme-song", { loop: true });
    if (!this.themeSong.isPaused || !this.themeSong.isPlaying)
    {
         this.themeSong.play();
    }

    //Initializing all the layers from Tiled.
    this.map = this.make.tilemap({ key: "tilemap" });
    const tileset = this.map.addTilesetImage('Dungeon Tile Set', 'base_tiles');

    this.wallsLayer = this.map.createLayer('walls', tileset, 0, 0);
    this.wallsLayer.setCollisionBetween(1, 1200);
    this.doorsLayer = this.map.createLayer('doors', tileset, 0, 0);

    this.spikes = this.physics.add.group({  //Add logic for spike sprite so it deals damage to player.
        allowGravity: false,
        immovable: true
      });
      this.map.getObjectLayer('spikes').objects.forEach((spike) => {
        const spikeSprite = this.spikes.create(spike.x, spike.y - spike.height, 'spike').setOrigin(0);
        spikeSprite.body.setSize(spike.width, spike.height - 20).setOffset(0, 10);
    });
    this.keyLayer = this.map.createLayer('key', tileset, 0, 0);

    //Add main char & set up his hitbox.
    this.wizard = this.physics.add.sprite(0, config.height / 2 + 445, 'wiz-idle');
    this.wizard.setSize(60,75, true);

    this.skeleton = this.physics.add.sprite(0, config.height / 2 , 'skeleton-idle');
    this.skeleton.setSize(60,100, true);

    //Set up camera
    this.bg1.setScrollFactor(0)
    this.cameras.main.startFollow(this.wizard);
    //this.cameras.main.setBounds(0, 0, this.bg1.displayWidth, this.bg1.displayHeight); <- set bounds to BG size? maybe in the future.


    /*
    *   All Main Character (wizard) animations
    */
    this.anims.create({
        key: 'wiz_idle',
        frames: this.anims.generateFrameNumbers('wiz-idle'),
        frameRate: 15,
        repeat: -1
    });
    this.anims.create({
        key: 'wiz_move',
        frames: this.anims.generateFrameNumbers('wiz-move'),
        frameRate: 15,
    });
    this.anims.create({
        key: 'wiz_attack_one',
        frames: this.anims.generateFrameNumbers('wiz-atk-1'),
        frameRate: 15,
    });
    this.anims.create({
        key: 'wiz_attack_two',
        frames: this.anims.generateFrameNumbers('wiz-atk-2'),
        frameRate: 10,
    });
    this.anims.create({
        key: 'wiz_jump',
        frames: this.anims.generateFrameNumbers('wiz-jump'),
        frameRate: 15,
    });
    this.anims.create({
        key: 'wiz_fall',
        frames: this.anims.generateFrameNumbers('wiz-fall'),
        frameRate: 15
    });
    this.anims.create({
        key: 'wiz_death',
        frames: this.anims.generateFrameNumbers('wiz-death'),
        frameRate: 15
    });
    /*
    *   End main char animations.
    *   Begin skeleton animations.
    */

    this.anims.create({
        key: 'skeleton_idle',
        frames: this.anims.generateFrameNumbers('skeleton-idle'),
        frameRate: 7,
        repeat: -1
    });
    this.anims.create({
        key: 'skeleton_dmg',
        frames: this.anims.generateFrameNumbers('skeleton-damage'),
        frameRate: 7,
    });
    this.anims.create({
        key: 'skeleton_death',
        frames: this.anims.generateFrameNumbers('skeleton-death'),
        frameRate: 7,
    });

    this.skeleton.play('skeleton_idle');
    this.skelBar = this.makeBar(this.skeleton.x, this.skeleton.y - this.skeleton.height, 0xe74c3c);
    this.skelHealth = 50;
    this.setValue(this.skelBar, this.skelHealth);
    
    //Start wiz idle and give him some gravity.
    this.wizard.play('wiz_idle');
    this.wizard.setGravityY(300);

    //  Binding Keys.
    this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.x = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    // Add Health bar
    this.healthBar = this.makeBar(config.width / 2 - 100, config.height - 75, 0xe74c3c);
    this.health = 100;
    this.setValue(this.healthBar, this.health);
    this.healthBar.setScrollFactor(0);

    this.skelDeathAnimation = true;
    this.wizDeathAnimation = true;

    }
    
    makeBar(x, y,color) { // Use this for our healthbar.
        //draw the bar
        let bar = this.add.graphics();

        //color the bar
        bar.fillStyle(color, 1);
        //fill the bar with a rectangle
        bar.fillRect(0, 0, 200, 30);

        
        //position the bar
        bar.x = x;
        bar.y = y;

        //return the bar
        return bar;
    }
    setValue(bar,percentage) {
        //scale the bar
        bar.scaleX = percentage/100;
    }

    update() {
        this.physics.add.collider(this.skeleton, this.wallsLayer);

        this.physics.add.overlap(this.skeleton, this.wizard, (skeleton, wizard) => //Overlapping skeleton and wiz
        {
            if (this.skelHealth > 0){
                if (wizard.anims.currentAnim.key != 'wiz_attack_one' && wizard.anims.currentAnim.key != 'wiz_attack_two'){ //take damage
                    this.health -= 0.0001; this.setValue(this.healthBar, this.health);
                }else{ //Deal damage
                    this.skelHealth -= 0.0001; this.setValue(this.skelBar, this.skelHealth);
                    skeleton.play('skeleton_dmg', true).anims.chain('skeleton_idle');
                }
            }

        });

        //Make skel bar follow the skeleton
        this.skelBar.setPosition(this.skeleton.x - this.skeleton.width / 2 + 25, this.skeleton.y - this.skeleton.height / 2).setVisible(true);

        //make sprite able to walk on the platform
        this.physics.add.collider(this.wizard, this.wallsLayer); 
        // sprite takes damage when touching the spikes
        this.physics.add.collider(this.wizard, this.spikes, function(){this.health -= 0.1; this.setValue(this.healthBar, this.health); }, null, this);

        //Pause Audio
        if (Phaser.Input.Keyboard.JustDown(this.enter)){
            if (this.themeSong.isPaused)
            {
                //this.scene.pause();
                this.themeSong.resume();
            }
            else
            {
                //this.scene.resume();
                this.themeSong.pause();
            }
        }
        // Check if sprite is dead, if so, let's give them the good ol game-over.
        if (this.health <= 0){
            this.healthBar.destroy();
            this.themeSong.destroy();
            if (this.wizard.anims.currentAnim.key === 'wiz_fall') {
                this.scene.start('gameOver');
            }
            if (this.wizDeathAnimation === true){
                this.wizDeathAnimation = false;
                this.wizard.play('wiz_death', true);
            }
            this.wizard.on('animationcomplete', () =>{
                this.scene.start('gameOver');
            });
        }
        //Check if skeleton is dead, if so let's see that animation
        if (this.skelHealth <= 0)
        {
            if (this.skelDeathAnimation === true){
                this.skeleton.play('skeleton_death', true);
            }
            this.skeleton.on('animationcomplete', () =>{
                this.skelDeathAnimation = false;
                this.skeleton.destroy();
                this.skelBar.destroy();
            })
        }
        //Show falling animation if sprite really is falling and apply fall damage.
        if (this.wizard.body.velocity.y > 400) {
            this.wizard.play('wiz_fall', true);
            this.health -= 0.5;
            this.setValue(this.healthBar, this.health);
        }

        
       //Jump with space
       if (this.wizard.body.velocity.y === 0) { // Remove ability to jump more than once.
            if (Phaser.Input.Keyboard.JustDown(this.space)){
                this.wizard.setVelocityY(-300);
                if (this.wizard.body.velocity.y < 0){
                    this.wizard.play('wiz_jump', true);
                }
            }
       }
        //Attacks
        if (Phaser.Input.Keyboard.JustDown(this.z)){
            if (this.wizard.body.velocity.x === 0){ // player can only attack standing still.
                if (this.wizard.flipX){ //If the sprite is facing left. (adding hitbox)
                    this.wizard.setSize(100,75, true);
                    this.wizard.setOffset(30, this.wizard.body.offset.y);
                }else{ //sprite is facing right. (adding hitbox)
                    this.wizard.setSize(100,75, true);
                    this.wizard.setOffset(120, this.wizard.body.offset.y);
                }
                this.wizard.play('wiz_attack_one', true).anims.chain('wiz_idle');
                setTimeout(() => {
                    this.wizard.setOffset(this.wizard.body.offset);
                    this.wizard.setSize(60,75, true);
                }, "500");
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.x)){
            if (this.wizard.body.velocity.x === 0){ // player can only attack standing still.
                if (this.wizard.flipX){ //If the sprite is facing left. (adding hitbox)
                    this.wizard.setSize(100,75, true);
                    this.wizard.setOffset(30, this.wizard.body.offset.y);
                }else{ //sprite is facing right. (adding hitbox)
                    this.wizard.setSize(100,75, true);
                    this.wizard.setOffset(120, this.wizard.body.offset.y);
                }
                this.wizard.play('wiz_attack_two', true).anims.chain('wiz_idle');
                setTimeout(() => {
                    this.wizard.setOffset(this.wizard.body.offset);
                    this.wizard.setSize(60,75, true);
                }, "600");
            }
        }
        //Left movement & Right movement
        if (this.cursorKeys.left.isDown){ 
            this.wizard.play('wiz_move', true).anims.chain('wiz_idle');
            this.wizard.flipX = true;
            this.wizard.setVelocityX(-160);
            //add fall animation even while moving
            if (this.wizard.body.velocity.y > 500) {
                this.wizard.play('wiz_fall', true);
                this.health -= 1;
                this.setValue(this.healthBar, this.health);
            }
        }else if(this.cursorKeys.right.isDown){
            this.wizard.flipX = false;
            this.wizard.play('wiz_move', true).anims.chain('wiz_idle');
            this.wizard.setVelocityX(160);
            //add fall animation even while moving
            if (this.wizard.body.velocity.y > 500) {
                this.wizard.play('wiz_fall', true);
                this.health -= 1;
                this.setValue(this.healthBar, this.health);
            }
        } else{ // Let's stop the main char sprite if he isn't going anywhere. otherwise we'll get some unwanted movements
            this.wizard.setVelocityX(0);
        }
    }
}

class Scene2 extends Phaser.Scene {
    constructor(){
        super("gameOver");
    }

    preload(){
    }
    create(){
        this.gameOverText = this.add.text(config.width / 2 - 300, config.height / 2 - 64, "GAME OVER", { fontSize: '64px', fontFamily: '"Press Start 2P"'});
        this.gameOverSubText = this.add.text(config.width / 2 - 500, config.height / 2 + 64, "Press Enter to try again.", { fontSize: '40px', fontFamily: '"Press Start 2P"' });
        this.gameOverText.font = '"Press Start 2P"';
        this.gameOverSubText.font = '"Press Start 2P"';
        //Register Enter binding
        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }
    update(){
        //Restart after hitting Enter
        if (Phaser.Input.Keyboard.JustDown(this.enter)){
            this.scene.start("playGame"); //Start game
        }
    }
}


var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1200,
    height: 650,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 100 },
            debug: false
        }
    },
    scene: [Scene1, Scene2],
    
};

var game = new Phaser.Game(config);
