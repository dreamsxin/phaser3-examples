var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#026bc6',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        extend: {
            releaseItem
        }
    }
};

var flowers;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('knight', 'assets/animations/knight.png', 'assets/animations/knight.json');
    this.load.image('bg', 'assets/skies/clouds.png');
    this.load.spritesheet('tiles', 'assets/tilemaps/tiles/fantasy-tiles.png', { frameWidth: 64, frameHeight: 64 });
}

function create ()
{
    //  The background and floor
    this.add.image(400, 16, 'bg').setOrigin(0.5, 0);

    for (var i = 0; i < 13; i++)
    {
        this.add.image(64 * i, 536, 'tiles', 1).setOrigin(0);
    }

    //  Our flowers
    flowers = [];

    for (var i = 0; i < 8; i++)
    {
        var flower = this.add.image(500, 472 - (i * 52), 'tiles', 31).setOrigin(0);

        flowers.push(flower);
    }

    this.add.text(400, 8, 'Click to play. Update Event on frame0004', { color: '#ffffff' }).setOrigin(0.5, 0);

    //  Our attack animation
    var attackConfig = {
        key: 'attack',
        frames: this.anims.generateFrameNames('knight', { prefix: 'attack_B/frame', start: 0, end: 12, zeroPad: 4 }),
        frameRate: 16
    };

    this.anims.create(attackConfig);

    //  Our coin animation
    var coinConfig = {
        key: 'coin',
        frames: this.anims.generateFrameNumbers('tiles', { start: 42, end: 47 }),
        frameRate: 12,
        repeat: -1
    };

    this.anims.create(coinConfig);

    var lancelot = this.add.sprite(300, 536, 'knight', 'attack_C/frame0000')

    lancelot.setOrigin(0.5, 1);
    lancelot.setScale(8);

    //  Event handler for when the animation updates on our sprite
    lancelot.on(Phaser.Animations.Events.SPRITE_ANIMATION_UPDATE, function (anim, frame, sprite) {

        //  We can run our effect when we get frame0004:

        if (frame.textureFrame === 'attack_B/frame0004')
        {
            this.releaseItem();
        }

    }, this);

    //  And a click handler to start the animation playing
    this.input.on('pointerdown', function () {

        lancelot.play('attack', true);

    });
}

function releaseItem ()
{
    if (flowers.length === 0)
    {
        return;
    }

    var flower = flowers.pop();

    this.tweens.add({
        targets: flower,
        x: 864,
        ease: 'Quad.out',
        duration: 500
    });
}
