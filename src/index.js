import 'phaser';




class Scene1 extends Phaser.Scene {
    constructor(){
        super("bootGame");
    }

    preload(){
        this.load.image('bg1', 'assets/backgrounds/game_background_1.png' );
        this.load.spritesheet('wraith1-idle', 'assets/wraith1-idle.png', {
            frameWidth: 520,
            frameHeight: 420
        });
    }
    create(){
    this.bg1 = this.add.image(0,0, 'bg1').setOrigin(0, 0);
    this.bg1.displayWidth = this.sys.canvas.width;
    this.bg1.displayHeight = this.sys.canvas.height;


    this.wraith1 = this.physics.add.sprite(config.width / 2, config.height / 2, 'sprite')
    this.anims.create({
        key: 'wraith1_idle',
        frames: this.anims.generateFrameNumbers('wraith1-idle'),
        frameRate: 15,
        repeat: -1
    });
    this.wraith1.play('wraith1_idle');
    var startText = this.add.text(config.width / 2 - 150, config.height / 2 + 200, "Press Enter to start", { fontSize: '25px' });
    
    //Register Enter binding
    this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }
    update() {
        //Move when hitting Enter
        if (Phaser.Input.Keyboard.JustDown(this.enter)){
            this.wraith1.setVelocityX(160); //Make Sprite walk before starting game.
            setTimeout(() => {
                this.scene.start("playGame"); //Start game
            }, 3000);
        }
    }
}

class Scene2 extends Phaser.Scene {
    constructor(){
        super("playGame");
    }

    preload(){
        this.load.spritesheet('wraith1-attack', 'assets/wraith1-attack.png', {
            frameWidth: 520,
            frameHeight: 420
        });
        this.load.spritesheet('wraith1-moving', 'assets/wraith1-moving.png', {
            frameWidth: 520,
            frameHeight: 420
        });
        //Fireball
        this.load.spritesheet('fireball', 'assets/fireball_blue.png', {
            frameWidth: 500,
            frameHeight: 380
        });
    }
    create(){

        this.bg1 = this.add.image(0,0, 'bg1').setOrigin(0, 0);
        this.bg1.displayWidth = this.sys.canvas.width;
        this.bg1.displayHeight = this.sys.canvas.height;
    
    
        this.wraith1 = this.physics.add.sprite(config.width / 2, config.height / 2, 'sprite')
        
        this.anims.create({
            key: 'wraith1_attack',
            frames: this.anims.generateFrameNumbers('wraith1-attack'),
            frameRate: 15,
        });
        this.anims.create({
            key: 'wraith1_moving',
            frames: this.anims.generateFrameNumbers('wraith1-moving'),
            frameRate: 15,
        });
        this.anims.create({
            key: 'shoot_fireball',
            frames: this.anims.generateFrameNumbers('fireball'),
            frameRate: 30
        });
        this.wraith1.play('wraith1_idle');

        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.cursorKeys = this.input.keyboard.createCursorKeys();
    }
    update(){
        //Attack when hitting space
        if (Phaser.Input.Keyboard.JustDown(this.space)){
            this.wraith1.play('wraith1_attack').anims.chain('wraith1_idle');
            this.fireball = this.physics.add.sprite(this.wraith1.x, this.wraith1.y, 'fireball')
            this.fireball.setVelocityX(500);
            this.fireball.play('shoot_fireball');
        }
        if (this.cursorKeys.left.isDown){ //Left movement & Right movement
            this.wraith1.setVelocityX(-160);
        }else if(this.cursorKeys.right.isDown){
            this.wraith1.play('wraith1_moving').anims.chain('wraith1_idle');
            this.wraith1.setVelocityX(160);
        } else{
            this.wraith1.setVelocityX(0);
        }

        if (this.cursorKeys.down.isDown){ //Up & Down movement
            this.wraith1.setVelocityY(160);
        } else if (this.cursorKeys.up.isDown){
            this.wraith1.setVelocityY(-160);
        } else{
            this.wraith1.setVelocityY(0);
        }
    }
}


var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [Scene1, Scene2],
    
};

var game = new Phaser.Game(config);
