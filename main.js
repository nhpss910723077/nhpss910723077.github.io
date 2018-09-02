
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

var scoreText = document.querySelector(".score");
var timeText = document.querySelector(".time");
var lifeText = document.querySelector(".fortLife");
var second = 0;
var scoreCount = 0;
var fortLife = 30;
var enemyCreate = false;

var playerkey = {
    w: false,
    a: false,
    space: false,
}

function random(min, max) {
    var num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

function Shape(x, y, velX, velY, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.size = size;
}

function Enemy(x, y, velX, velY, size, color, hp, exists) {
    Shape.call(this, x, y, velX, velY, size);
    this.color = color;
    this.hp = hp;
    this.exists = exists;
}

Enemy.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

Enemy.prototype.move = function () {
    this.x -= this.velX;
}

Enemy.prototype.checkBounds = function () {
    if (this.x - this.size <= 9 * width / 40 && this.exists) {
        fortLife--;
        this.exists = false;
    }
}

function Fort(x, y, velX, velY, size, gunW, gunH, color) {
    Shape.call(this, x, y, velX, velY, size);
    this.gunW = gunW;
    this.gunH = gunH;
    this.color = color;
}

Fort.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y - this.gunH / 2, this.gunW, this.gunH);
    ctx.fill();
}

Fort.prototype.checkBounds = function () {
    if ((this.y + this.size) >= height) {
        this.y += -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
        this.y += (this.velY);
    }
}

Fort.prototype.controls = function () {

    var timer1 = setTimeout(function f(e) {
        if (playerkey.w) {
            fort.y -= fort.velY;
        } else if (playerkey.s) {
            fort.y += fort.velY;
        }
        timer = setTimeout(f, 25)
    }, 25)

    var timer2 = setTimeout(function f(e) {
        if (playerkey.space) {
            for (var i = 0; i < 30; i++) {
                if (!bullets[i].exists) {
                    bullets[i].x = fort.x + fort.gunW;
                    bullets[i].y = fort.y;
                    bullets[i].exists = true;
                    break;
                }
            }
        }
        timer = setTimeout(f, 200)
    }, 200)


    document.onkeydown = function (e) {
        switch (e.keyCode) {
            case 87: playerkey.w = true; break;
            case 83: playerkey.s = true; break;
            case 32: playerkey.space = true; break;
        }
    }

    document.onkeyup = function (e) {
        switch (e.keyCode) {
            case 87: playerkey.w = false; break;
            case 83: playerkey.s = false; break;
            case 32: playerkey.space = false; break;
        }
    }
}

function Bullet(x, y, velX, velY, size, color, exists) {
    Shape.call(this, x, y, velX, velY, size);
    this.color = color;
    this.exists = exists;
}

Bullet.prototype.move = function () {
    this.x += this.velX;
}

Bullet.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

Bullet.prototype.checkBounds = function () {
    if (this.x + this.size >= width && this.exists) {
        this.exists = false;
    }
}

Bullet.prototype.collisionDetect = function () {
    for (var j = 0; j < enemys.length; j++) {
        var dx = this.x - enemys[j].x;
        var dy = this.y - enemys[j].y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + enemys[j].size && enemys[j].exists && this.exists) {
            if (enemys[j].hp <= 1) {
                this.exists = false;
                enemys[j].exists = false;
                scoreCount++;
            } else {
                this.exists = false;
                enemys[j].hp--;
            }
        }
    }
}

var timer3 = setTimeout(function f(e) {
    second++;

    timer = setTimeout(f, 1000)
}, 1000)

var timer4 = setTimeout(function f(e) {
    enemyCreate = true;

    timer = setTimeout(f, 400)
}, 400)

function createItem() {
    var maxBullets = 30;
    var maxEnemys = 50;

    while (bullets.length < maxBullets) {
        var bullet = new Bullet(fort.x + fort.gunW, fort.y, 10, 0, 15, "yellow", false);
        bullets.push(bullet);
    }

    while (enemys.length < maxEnemys) {
        var enemy = new Enemy(
            width,
            random(fort.size, height - fort.size),
            3,
            0,
            30,
            "rgb(" + random(0, 255) + "," + random(0, 255) + "," + random(0, 255) + ")",
            random(1,3),
            false);
        enemys.push(enemy);
    }
}

function loop() {

    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(width / 5, 0, (4 * width) / 5, height);
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect(0, 0, width / 5, height);
    ctx.fillStyle = "rgba(255, 0, 0, 1)";
    ctx.fillRect((7 * width) / 40, 0, width / 20, height);

    if (enemyCreate) {
        for (var i = 0; i < 50; i++) {
            if (!enemys[i].exists) {
                enemys[i].x = width;
                enemys[i].y = random(fort.size, height - fort.size);
                enemys[i].hp = random(1, 3)
                enemys[i].exists = true;
                enemyCreate = false;
                break;
            }
        }
    }

    for (var i = 0; i < bullets.length; i++) {
        bullets[i].checkBounds();
        if (bullets[i].exists) {
            bullets[i].move();
            bullets[i].draw();
            bullets[i].collisionDetect();
        }
    }

    for (var j = 0; j < enemys.length; j++) {
        enemys[j].checkBounds();
        if (enemys[j].exists) {
            enemys[j].move();
            enemys[j].draw();
        }
    }

    fort.checkBounds();
    fort.draw();

    scoreText.textContent = "Kill enemy:" + scoreCount;
    timeText.textContent = Math.floor(second / 60) + ":" + second % 60;
    lifeText.textContent = "Life:" + fortLife;

    if (fortLife > 0) {
        requestAnimationFrame(loop);
    } else {
        alert("GameOver");
    }
}

var bullets = [];
var enemys = [];
var fort = new Fort((3 * width) / 40, height / 2, 0, 15, 80, 175, 40, "black")
fort.controls();
createItem();
loop();
