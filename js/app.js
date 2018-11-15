/*
* Class for Score tracking and updating
*/
class Score{
    constructor(points = 0){
        this.points = points;
    }

    reachedTheWater() {
        this.increasePoints(100 * level.value);
    }

    touchedByBug() {
        // TODO: define another game mode for handling points
        // this.decreasePoints(50);
    }

    increasePoints(points) {
        this.points += points;
        this.update();
    }

    decreasePoints(points) {
        if (this.points >= points) {
            this.points -= points;
        }
        this.update();
    }

    getPoints() {
        return this.points;
    }

    update() {
        points.innerHTML = this.points;
    }
}

/*
* Base Class for Characters which can be drawn in the canvas
*/
class Character{
    constructor(sprite, x, y, width, height){
        this.sprite = sprite;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    getVerticalRange() {
        return [this.y, this.y + this.height];
    }

    getHorizontalRange() {
        return [this.x, this.x + this.width];
    }

    setSprite(sprite) {
        this.sprite = sprite;
    }
}

// Enemies our player must avoid
class Enemy extends Character{
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    constructor(x = -10, y = 70, speed = Math.random() * 3 * level.value + 1){
        super('images/enemy-bug.png', x, y, 100, 70);
        this.speed = speed;
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt){
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        if (!player.isAlive()){
            return;
        }

        let bug = this;
        setTimeout(function(){
            bug.checkIfRunIntoHuman();
            if (bug.x < 505) {
                bug.x += bug.speed;
            }else{
                bug.reset();
            }
        }, 500*dt);
    }

    checkIfRunIntoHuman(){
        let [xi,xf] = player.getHorizontalRange();
        let [yi,yf] = player.getVerticalRange();
        if (this.isInHorizontalReach(xi,xf) && this.isInVerticalReach(yi, yf)) {
            console.log("colision!")
            player.touchedByBug();
            score.touchedByBug();
            this.reset();
        }
    }

    isInHorizontalReach(xi, xf) {
        return this.x >= xi && this.x < xf ||
                this.x >= xi - 10 && this.x < xf - 10;
    }

    isInVerticalReach(yi, yf) {
        return this.y >= yi && this.y < yf ||
               this.y >= yi - 20 && this.y < yf - 20;
    }

    reset() {
        this.x = -10;
        this.speed = Math.random() * 3 * level.value + 1;
    }

}

class Player extends Character{
    constructor(sprite = 'images/char-boy.png', x = 200, y = 300, lives = 3) {
        super(sprite, x, y, 70, 80);
        this.lives = lives;
    }

    update(dt) {
        let player = this;
        setTimeout(function(){
            if (player.hasReachedTheWater()) {
                score.reachedTheWater();
                player.reset();
            }
            lives.innerHTML = player.lives;
        }, 500*dt);
    }

    handleInput(direction) {
        if (!this.isAlive()) {
            return;
        }
        if (direction == 'left' && this.x > 0) {
            this.x -= 101;
        }else if(direction == 'right' && this.x < 401) {
            this.x += 101;
        }else if(direction == 'up' && this.y > -20) {
            this.y -= 80;
        }else if (direction == 'down' && this.y < 380) {
            this.y += 80;
        }
    }

    hasReachedTheWater() {
        return this.y <= -20;
    }

    loseALife() {
        if (this.lives > 0) {
            this.lives -= 1;
            if (this.lives == 0) {
                gameOver();
            }
        }
    }

    isAlive() {
        return this.lives > 0;
    }

    touchedByBug() {
        this.loseALife();
        this.reset();
    }

    reset() {
        this.x = 200;
        this.y = 300;
    }
}

// TODO: Add Gem random position
// TODO: Add timed Gem
class Gem{
    constructor(x = 200, y = 140, type = 'blue'){
        this.x = x;
        this.y = y;
        this.class = type;
        this.sprite = this.getImage();
        this.val = this.gemValue();
    }

    getImage() {
        switch(this.class) {
            case 'orange': return 'images/Gem Orange.png';
            case 'green': return 'images/Gem Green.png';
            default: return 'images/Gem Blue.png';
        }
    }

    gemValue() {
        switch(this.class) {
            case 'orange': return 100;
            case 'green': return 200;
            default: return 300;
        }
    }

    checkIfPickedUpByHuman(){
        let [xi,xf] = player.getHorizontalRange();
        let [yi,yf] = player.getVerticalRange();
        if (this.isInHorizontalReach(xi,xf) && this.isInVerticalReach(yi, yf)) {
            console.log("picked Gem");
            score.increasePoints(this.gemValue());
            this.reset();
        }
    }

    isInHorizontalReach(xi, xf) {
        return this.x >= xi && this.x < xf ||
                this.x >= xi - 10 && this.x < xf - 10;
    }

    isInVerticalReach(yi, yf) {
        return this.y >= yi && this.y < yf ||
               this.y >= yi - 20 && this.y < yf - 20;
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    update(dt) {
        let gem = this;
        setTimeout(function(){
            gem.checkIfPickedUpByHuman();
        }, 500*dt);
    }

    reset() {
        this.x = -1000;
        this.y = -1000;
    }
}


// Game Settings
const points = document.getElementById('points');
const lives = document.getElementById('lives');
const modalMsg = document.getElementsByClassName('modal-body')[0];

let level = document.getElementById('level-select');
let character = document.getElementById('character-select');

let touchX = [];
let touchY = [];

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let allEnemies = [new Enemy(), new Enemy(0, 140), new Enemy(-10, 210)];
let gems = []; // TODO: Add Gems to the Game
let player = new Player(getCharacterSprite(character.value));
let score = new Score();
let highestScore = 0;


function resetGame() {
    allEnemies = [new Enemy(-10, 70), new Enemy(-10, 140), new Enemy(-10, 210)];
    if (level.value > 2) {
        allEnemies.push(new Enemy(-10, 70), new Enemy(-10, 140), new Enemy(-10, 210));
    }
    gems = [];
    player = new Player(getCharacterSprite(character.value));
    score = new Score();
    score.update();
    touchX = [];
    touchY = [];
    $('.modal').modal('hide')
}

function gameOver() {
    if (score.getPoints() > highestScore) {
        highestScore = score.getPoints();
        modalMsg.innerHTML = `<h3 class="text-center">Congratulations! <br>New High Score: ${highestScore}</h3>`;
    }else {
        modalMsg.innerHTML = `<h3 class="text-center">Nice try! <br>Current High Score: ${highestScore}</h3>`;
    }

    $('.modal').modal('show');
}

function changeCharacter(index) {
    player.setSprite(getCharacterSprite(index));
}

function getCharacterSprite(index) {
    const spriteList = {
        1: 'images/char-boy.png',
        2: 'images/char-cat-girl.png',
        3: 'images/char-horn-girl.png',
        4: 'images/char-pink-girl.png',
        5: 'images/char-princess-girl.png'
    };

    return spriteList[index];
}
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.

window.onload = function() {
    const canvas = document.getElementsByTagName('canvas')[0];

    document.addEventListener('keyup', function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        player.handleInput(allowedKeys[e.keyCode]);
    });

    document.addEventListener('touchend', function(e) {
        if (e.target == canvas) {
            let dx = touchX[touchX.length - 1] - touchX[0];
            let dy = touchY[touchY.length - 1] - touchY[0];
            touchX = [];
            touchY = [];
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx >= 0) {
                    player.handleInput('right');
                }else {
                    player.handleInput('left');
                }
            }else {
                if (dy >= 0) {
                    player.handleInput('down');
                }else {
                    player.handleInput('up');
                }
            }
        }
    });

    document.addEventListener('touchmove', function(e) {
        if (e.target == canvas) {
            touchX.push(e.changedTouches[0].clientX);
            touchY.push(e.changedTouches[0].clientY);
        }
    });
};