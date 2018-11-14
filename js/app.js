// Enemies our player must avoid
class Enemy{
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    constructor(x = -10, y = 70, speed = Math.random()*5+2){
        this.sprite = 'images/enemy-bug.png';
        this.x = x;
        this.y = y;
        this.speed = speed;
    }
    
    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt){
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        if (this.x < 401) {
            this.x += this.speed;
        }else{
            this.x = -10;
            this.speed = Math.random()*5+2;
        }
    }

    // Draw the enemy on the screen, required method for game
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);    
    }

}

class Player{
    constructor(x = 200, y = 300) {
        this.sprite = 'images/char-boy.png';
        this.x = x;
        this.y = y;
    }

    update(dt) {
        
    }

    handleInput(direction) {
        if (direction == 'left' && this.x > 0) {
            this.x -= 101;
        }else if(direction == 'right' && this.x < 401) {
            this.x += 101;
        }else if(direction == 'up' && this.y > -20) {
            this.y -= 80;
        }else if (direction == 'down' && this.y < 380) {
            this.y += 80;
        }
        console.log(`${this.x},${this.y}`);
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);    
    }
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [new Enemy(), new Enemy(0, 140), new Enemy(-10, 210)];
let player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
