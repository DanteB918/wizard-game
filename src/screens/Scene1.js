

class Scene1 extends Phaser.Scene {
    constructor(){
        super("bootGame");
    }

    preload(){
        this.load.image('bg1', 'assets/backgrounds/game_background_1.png' );
        this.load.spritesheet('wraith1', 'assets/wraith1-idle.png', {
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
        key: 'wraith1_anim',
        frames: this.anims.generateFrameNumbers('wraith1'),
        frameRate: 15,
        repeat: -1
    });
    this.wraith1.play('wraith1_anim');
    var startText = this.add.text(config.width / 2 - 100, config.height / 2 + 200, "Press Enter to start");
    
    /*
    End Beginning scene
    */
    
    //Register keybindings
    this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    }
}

function update() {
    //Move when hitting Enter
    if (Phaser.Input.Keyboard.JustDown(this.enter)){
        console.log('enterrr!');
        this.wraith1.setVelocityX(160);
    }
    if (this.cursorKeys.left.isDown){ //Left movement
        this.wraith1.setVelocityX(-160);
    }
}