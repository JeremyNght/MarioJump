window.addEventListener('load', () => {
    const canvas = document.querySelector('#canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 532;
    canvas.height = 850;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.vy = 0;
            this.gameOver = false;
            this.gameStart = false;
            this.platforms = [];
            this.enemies = [];
            this.bonuses = [];
            this.level = 0;
            this.score = 0;
            this.enemyChance = 0;
            this.enemyMaxChance = 50;
            this.bonusChance = 0;
            this.bonusMaxChance = 50;
            this.object_vx = 3;
            this.object_max_vx = 6;
            this.platform_gap = 85;
            this.platform_max_gap = 175;
            this.special_platform_chance = 0;
            this.special_platform_max_chance = 85;
            this.add_platforms(0, this.height - 15);
            this.add_broken_platforms(0, this.height -15);
            this.add_platforms(-this.height, -15);
            this.add_broken_platforms(-this.height, -15);
            this.background = new Background(this);
            this.player = new Player(this);
            this.inputHandler = new InputHandler(this);
            this.mainMusic = new Audio('sounds/main.wav');
            this.mainMusic.loop = true;
        }

        update() {
            this.background.update();

            this.platforms.forEach(platform => {
                platform.update();
            })

            this.player.update(this.inputHandler);

            this.enemies.forEach(enemy => {
                enemy.update();
            });

            this.bonuses.forEach(bonus => {
                bonus.update();
            });

            if (!game.gameOver && game.gameStart) {
                document.body.style.cursor = "none";
            } else {
                document.body.style.cursor = "default";
            }

            this.platforms = this.platforms.filter(platform => !platform.markedForDeletion);
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            this.bonuses = this.bonuses.filter(bonus => !bonus.markedForDeletion);
        }

        draw(context) {
            this.background.draw(context);
            const champ = document.querySelector('#champ_bonus');
            const invisibility = document.querySelector('#invisibility_bonus');
            const flower = document.querySelector('#flower_bonus');
            const star = document.querySelector('#star_bonus');

            const brown_platform = document.querySelector('#brown_platform');
            const blue_platform = document.querySelector('#blue_platform');
            const white_platform = document.querySelector('#white_platform');
            const champ_platform = document.querySelector('#champ_platform');

            if (!this.gameStart) {
                // Text to start game
                context.font = '45px MarioFont';
                context.fillStyle = 'white';
                context.textAlign = 'center';
                context.fillText('PRESS ENTER TO START', this.width * 0.5, this.height * 0.5);

                // Text to show help
                context.font = '20px MarioFont';
                context.fillStyle = 'white';
                context.textAlign = 'center';
                context.fillText(' -> FLY FOR 2 SECONDS', 320, 75);
                context.fillText(' -> FLY FOR 4 SECONDS', 320, 140);
                context.fillText(' -> FLY FOR 6 SECONDS', 320, 205);
                context.fillText(' -> INVISIBILITY FOR 15 SECONDS', 360, 270);

                context.fillText(' -> THIS PLATFORM BREAK', 200, 530);
                context.fillText(' -> THIS PLATFORM MOVE', 200, 595);
                context.fillText(' -> THIS PLATFORM JUMP 2x HIGHER', 245, 660);
                context.fillText(' -> THIS PLATFORM JUMP 4x HIGHER', 245, 725);

                // Images to show help
                context.drawImage(champ, 0, 0, 16, 16, 170, 35, 16 * 3, 16 * 3)
                context.drawImage(flower, 0, 0, 16, 16, 170, 100, 16 * 3, 16 * 3)
                context.drawImage(star, 0, 0, 16, 16, 170, 165, 16 * 3, 16 * 3)
                context.drawImage(invisibility, 0, 0, 16, 16, 170, 230, 16 * 3, 16 * 3)

                context.drawImage(brown_platform, 0, 0, 16, 16, 30, 512.5, 16 * 3.75, 16)
                context.drawImage(blue_platform, 0, 0, 16, 16, 30, 577.5, 16 * 3.75, 16)
                context.drawImage(white_platform, 0, 0, 16, 16, 30, 643.5, 16 * 3.75, 16)
                context.drawImage(champ_platform, 0, 0, 16, 16, 30, 707.5, 16 * 3.75, 16)

            } else {
                this.platforms.forEach(platform => {
                    platform.draw(context);
                })

                this.player.draw(context);

                this.enemies.forEach(enemy => {
                    enemy.draw(context);
                });

                this.bonuses.forEach(bonus => {
                    bonus.draw(context);
                });

                if (!this.gameOver){
                    context.fillStyle = 'white';
                    context.font = '45px MarioFont';
                    context.textAlign = 'start';
                    context.fillText(`Score: ${this.score}`, 20, 70);
                }

                if (this.gameOver) {
                    const bg = document.querySelector('#bg');
                    this.mainMusic.pause();
                    context.drawImage(bg, 0, 0, 16, 16, 0, 0, 16 * 50, 16 * 55)
                    context.font = '50px MarioFont';
                    context.fillStyle = 'red';
                    context.textAlign = 'center';
                    context.fillText('GAME OVER', this.width * 0.5, this.height * 0.4);
                    context.fillStyle = 'white';
                    context.fillText(`Score: ${this.score}`, this.width * 0.5, this.height * 0.4 + 100);
                    context.fillText('PRESS ENTER TO RESTART', this.width * 0.5, this.height * 0.4 + 200);
                }
            }
        }

        add_enemy() {
            const isMoving = Math.random() < 0.5;
            const enemy = new Enemy(this, isMoving);
            this.enemies.push(enemy);
        }

        add_bonus() {
            const rand = Math.random();

            if (rand < 0.3) {
                const bonus = new Bonus(this, 'champ');
                this.bonuses.push(bonus);
            } else if (rand < 0.5) {
                const bonus = new Bonus(this, 'flower');
                this.bonuses.push(bonus);
            } else if (rand < 0.6) {
                const bonus = new Bonus(this, 'star');
                this.bonuses.push(bonus);
            } else if (rand < 0.7) {
                const bonus = new Bonus(this, 'invisibility');
                this.bonuses.push(bonus);
            }
        }

        add_platforms(lowerY, upperY) {
            do {
                let type = 'green';
                if(Math.random() < (this.special_platform_chance/100)) {
                    const rand = Math.random();
                    if (rand < 0.3) {
                        type = 'blue';
                    } else if (rand < 0.6) {
                        type = 'white';
                    } else {
                        type = 'champ';
                    }
                }

                this.platforms.unshift(new Platform(this, lowerY, upperY, type));
            }
            while (this.platforms[0].y >= lowerY);
        }

        add_broken_platforms(lowerY, upperY) {
            const num = Math.floor(Math.random() * (5 + 1))

            for (let i = 0; i < num; i++) {
                this.platforms.push(new Platform(this, lowerY, upperY, 'brown'))
            }
        }

        change_difficulty() {
            this.level++;
            if (this.platform_max_gap > this.platform_gap){
                this.platform_gap += 5;
            }
            if (this.special_platform_max_chance > this.special_platform_chance) {
                this.special_platform_chance += 1;
            }
            if (this.level%8 === 0 && this.object_max_vx > this.object_vx) {
                this.object_vx ++;
            }
            if (this.level%1 === 0 && this.enemyMaxChance > this.enemyChance) {
                this.enemyChance += 13;
            }
            if (this.level%1 === 0 && this.bonusMaxChance > this.bonusChance) {
                this.bonusChance += 13;
            }
        }

        restart() {
            location.replace(location.href);
        }
    }

    class Player {
        constructor(game) {
            this.game = game;
            this.sizeModifier = 3;
            this.width = 16 * this.sizeModifier;
            this.height = 16 * this.sizeModifier;
            this.x = this.game.platforms.filter(platform => platform.type === 'green').slice(-1)[0].x + 6;
            this.y = this.game.platforms.filter(platform => platform.type === 'green').slice(-1)[0].y - this.height;
            this.min_y = (this.game.height/2) - 30;
            this.min_vy = -18;
            this.max_vy = this.game.platforms[0].height;
            this.vy = this.min_vy;
            this.weight = 0.5;
            this.image = document.querySelector('#player');
            this.vx = 0;
            this.max_vx = 8;
            this.bullets = [];
            this.invincibility = false;
            this.intervalIds = [];
            this.isVisible = true;
        }

        update(inputHandler) {
            // horizontal movement
            this.x += this.vx;
            if (inputHandler.keys.includes('ArrowLeft')) {
                this.vx = -this.max_vx;
            } else if (inputHandler.keys.includes('ArrowRight')) {
                this.vx = this.max_vx;
            } else this.vx = 0;

            // horizontal collision
            if (this.x < -this.width/2) this.x = this.game.width - (this.width/2);
            if (this.x + (this.width/2) > this.game.width) this.x = - this.width/2;

            // vertical movement
            if (this.vy > this.weight) {
                const platformType = this.onPlatform();
                if (platformType === 'white' || platformType === 'blue' || platformType === 'green' || platformType === 'champ')
                    this.vy = this.min_vy;

                if (platformType === 'white') {
                    this.vy = + 1.35 * this.min_vy;
                    new Audio('sounds/big_jump.wav').play().then(r => r).catch(e => e);
                } else if (platformType === 'champ') {
                    this.vy = + 2 * this.min_vy;
                    new Audio('sounds/big_jump.wav').play().then(r => r).catch(e => e);
                }
                else if (platformType === 'blue' || platformType === 'green')
                    if (this.game.gameStart){
                        new Audio('sounds/jump.wav').play().then(r => r).catch(e => e);
                    }
                else if (platformType === 'brown') new Audio('sounds/break.wav').play().then(r => r).catch(e => e);
            }

            if (this.vy < this.max_vy) this.vy += this.weight;
            if (this.y > this.min_y || this.vy > this.weight) this.y += this.vy;

            if (this.y <= this.min_y && this.vy < this.weight) this.game.vy = - this.vy;
            else this.game.vy = 0;

            // game over
            if (this.collision() === 'enemy' && !this.invincibility) {
                this.game.gameOver = true;
                new Audio('sounds/crash.wav').play().then(r => r).catch(e => e);
            }

            if (this.collision() === 'bonus' && !this.invincibility) {
                if (this.game.bonuses[0].type === 'champ') {
                    this.vy = +2 * this.min_vy;
                    this.setInvincibility(true);
                    setTimeout(() => {
                        this.setInvincibility(false);
                    }, 2000);
                } else if (this.game.bonuses[0].type === 'flower') {
                    this.vy = +5.2 * this.min_vy;
                    this.setInvincibility(true);
                    setTimeout(() => {
                        this.setInvincibility(false);
                    }, 4000);
                } else if (this.game.bonuses[0].type === 'star') {
                    this.vy = +6.5 * this.min_vy;
                    this.setInvincibility(true);
                    setTimeout(() => {
                        this.setInvincibility(false);
                    }, 6000);
                } else if (this.game.bonuses[0].type === 'invisibility') {
                    this.setInvincibility(true);
                    setTimeout(() => {
                        this.setInvincibility(false);
                    }, 15000);

                }
                this.game.bonuses[0].markedForDeletion = true;
            }

            if (this.y > this.game.height && !this.game.gameOver) {
                this.game.gameOver = true;
                new Audio('sounds/fall.wav').play().then(r => r).catch(e => e);
            }

            if (this.invincibility) {
                this.isVisible = !this.isVisible;
            } else {
                this.isVisible = true;
            }

            // bullet
            if (inputHandler.bulletKeyCount > 0) {
                inputHandler.bulletKeyCount--;
                this.bullets.push(new Bullet(this));
            }

            this.bullets.forEach(bullet => bullet.update());
            this.bullets = this.bullets.filter(bullet => !bullet.markedForDeletion);
        }

        draw(context) {
            if (this.isVisible) {
                this.bullets.forEach((bullet) => bullet.draw(context));
                context.drawImage(this.image, this.x, this.y, this.width, this.height);
            }
        }

        collision() {
            let result = '';
            const playerHitBox = { x: this.x + 15, y: this.y, width: this.width - 30, height: this.height};
            this.game.enemies.forEach((enemy) => {
               if (playerHitBox.x < enemy.x + enemy.width && playerHitBox.x + playerHitBox.width > enemy.x &&
                   playerHitBox.y < enemy.y + enemy.height && playerHitBox.height + playerHitBox.y > enemy.y)
                   result = 'enemy';
            });
            this.game.bonuses.forEach((bonus) => {
                if (playerHitBox.x < bonus.x + bonus.width && playerHitBox.x + playerHitBox.width > bonus.x &&
                    playerHitBox.y < bonus.y + bonus.height && playerHitBox.height + playerHitBox.y > bonus.y)
                    result = 'bonus';
            });
            return result;
        }

        setInvincibility(isInvincible) {
            this.invincibility = isInvincible;
            if (isInvincible) {
                const player = this.image;
                let visibility = this.isVisible;
                const intervalId = setInterval(function() {
                    if (visibility) {
                        player.style.visibility = 'hidden';
                        visibility = false;
                    } else {
                        player.style.visibility = 'visible';
                        visibility = true;
                    }
                }, 750);
                this.intervalIds.push(intervalId);
            } else {
                this.intervalIds.forEach(function(intervalId) {
                    clearInterval(intervalId);
                });
                this.intervalIds = [];
                this.image.style.visibility = 'visible';
            }
        }


        onPlatform() {
            let type = null;
            const playerHitBox = { x: this.x + 15, y: this.y, width: this.width - 30, height: this.height };

            this.game.platforms.forEach((platform) => {
                const X_test = (playerHitBox.x > platform.x && playerHitBox.x < platform.x + platform.width)
                    || (playerHitBox.x + playerHitBox.width > platform.x &&
                        playerHitBox.x + playerHitBox.width < platform.x + platform.width);

                const Y_test = (platform.y - (playerHitBox.y + playerHitBox.height) <=0) &&
                    (platform.y - (playerHitBox.y + playerHitBox.height) >= -platform.height);

                if (X_test && Y_test) {
                    type = platform.type;
                    platform.markedForDeletion = (type === 'brown' || type === 'white' || type === 'champ' );
                }
            });
            return type;
        }
    }

    class Enemy {
        constructor(game, isMoving = true) {
            this.game = game;
            this.sizeModifier = 2.90;
            this.width = 16 * this.sizeModifier;
            this.height = 24 * this.sizeModifier;
            this.y = Math.floor(Math.random() * ((-this.height) - (-this.game.height) + 1)) + (-this.game.height);
            this.x = Math.floor(Math.random() * ((this.game.width - this.width) + 1));
            this.image = document.querySelector('#enemy');
            this.vx = this.game.object_vx;
            this.isMoving = isMoving;
            this.markedForDeletion = false;
        }

        update() {
            if (this.isMoving) {
                if (this.x < 0 || this.x > this.game.width - this.width) this.vx *= -1;
                this.y += this.game.vy;
                this.x += this.vx;
            }else {
                this.y += this.game.vy;
            }
            if (this.y >= this.game.height) {
                this.markedForDeletion = true;
            }

            const bullets = this.game.player.bullets;
            bullets.forEach(bullet => {
                if (bullet.x < this.x + this.width && bullet.x + bullet.width > this.x &&
                    bullet.y < this.y + this.height && bullet.height + bullet.y > this.y) {
                    this.markedForDeletion = true;
                }
            });
        }

        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    class Bonus {
        constructor(game, type) {
            this.game = game;
            this.sizeModifier = 2.90;
            this.width = 16 * this.sizeModifier;
            this.height = 16 * this.sizeModifier;
            this.x = Math.floor(Math.random() * ((this.game.width - this.width) + 1));
            this.y = Math.floor(Math.random() * ((-this.height) - (-this.game.height) + 1)) + (-this.game.height);
            this.type = type;
            this.image = document.getElementById(`${this.type}_bonus`);
            this.markedForDeletion = false;
        }

        update() {
            this.y += this.game.vy;

            if (this.y >= this.game.height) {
                this.markedForDeletion = true;
            }
        }

        draw(context) {
            if (this.image instanceof HTMLImageElement) {
                context.drawImage(this.image, this.x, this.y, this.width, this.height);
            } else {
                console.error(`Invalid image type: ${typeof this.image}`);
            }
        }
    }

    class Platform {
        constructor(game, lowerY, upperY, type) {
            this.game = game;
            this.width = 90;
            this.height = 15;
            this.type = type;
            this.x = Math.floor(Math.random() * ((this.game.width - this.width) + 1));
            this.y = this.calc_Y(upperY, lowerY);
            this.vx = (this.type === 'blue') ? this.game.object_vx : 0;
            this.image = document.getElementById(`${this.type}_platform`);
            this.markedForDeletion = false;
        }

        update() {
            if (this.type === 'blue') {
                if (this.x < 0 || this.x > this.game.width - this.width) this.vx *= -1;
            }

            this.x += this.vx;
            this.y += this.game.vy;

            if (this.y >= this.game.height) {
                this.markedForDeletion = true;
            }
        }

        draw(context) {
            if (this.image instanceof HTMLImageElement) {
                context.drawImage(this.image, this.x, this.y, this.width, this.height);
            } else {
                console.error(`Invalid image type: ${typeof this.image}`);
            }
        }

        calc_Y(upperY, lowerY) {
            if (this.type !== 'brown') {
                if (!this.game.platforms.length) {
                    return Math.floor(Math.random() * (upperY - (upperY - 100) + 1)) + (upperY - 100);
                } else {
                    return this.game.platforms[0].y - (Math.floor(Math.random() * (this.game.platform_gap - (this.game.platform_gap - 30) + 1)) + (this.game.platform_gap - 30));
                }
            } else {
                let y;

                do {
                    y = Math.floor(Math.random() * (upperY - lowerY + 1)) + lowerY;
                }
                while (this.close_To_Other_Platforms(y))

                return y;
            }
        }

        close_To_Other_Platforms(y1) {
            for (let i = 0; i < this.game.platforms.length; i++) {
                const iPlatform = this.game.platforms[i];
                const margin = 10;
                if ((y1 + this.height >=  iPlatform.y-margin && y1 + this.height <= iPlatform.y + this.height + margin)
                   || (y1 >= iPlatform.y-margin && y1 <= iPlatform.y + this.height + margin)) {
                    return true;
                }
            }
        }
    }

    class Background {
        constructor(game) {
            this.game = game;
            this.width = game.width;
            this.height = game.height;
            this.image = document.querySelector('#bg');
            this.x = 0;
            this.y = 0;
        }

        update() {
            if (this.y > this.height) {
                this.y = 0;
                this.game.add_platforms(-this.height, -15);
                this.game.add_broken_platforms(-this.height, -15);
                this.game.change_difficulty();

                if (Math.random() < this.game.enemyChance/100){
                    this.game.add_enemy();
                }

                if (Math.random() < this.game.bonusChance/100){
                    this.game.add_bonus();
                }

            } else {
                this.y += this.game.vy;
                this.game.score += Math.trunc(this.game.vy * 0.1);
            }
        }

        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x, this.y - this.height, this.width, this.height);
        }
    }

    class Bullet {
        constructor(player) {
            this.player = player;
            this.sizeModifier = 0.1;
            this.width = 256 * this.sizeModifier;
            this.height = 256 * this.sizeModifier;
            this.x = this.player.x + (this.player.width / 2) - (this.width / 2);
            this.y = this.player.y + (this.player.height / 2) - (this.height / 2);
            this.image = document.querySelector('#bullet');
            this.vy = -15;
            this.markedForDeletion = false;
            this.audio = new Audio('sounds/bullet.wav');
            this.audio.play().then(r => r).catch(e => e);
        }

        update() {
            this.y += this.vy;
            if (this.y < -this.height) {
                this.markedForDeletion = true;
            }
        }

        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    class InputHandler {
        constructor(game) {
            this.keys = [];
            this.bulletKeyCount = 0;
            this.game = game;

            document.addEventListener('keydown', (e) => {
                if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !this.keys.includes(e.key)) {
                    this.keys.push(e.key);
                }
                if (e.key === 'Enter' && !this.game.gameOver) {
                    this.game.gameStart = true;
                    this.game.mainMusic.play().then(r => r).catch(e => e);
                } else if (e.key === 'Enter' && this.game.gameOver) {
                    this.game.restart();
                }
            });

            window.addEventListener('keyup', (e) => {
                if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && this.keys.includes(e.key)) {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
                if (e.key === ' ' || e.key === 'ArrowUp' && this.game.player.bullets.length < 3) {
                    this.bulletKeyCount++;
                }
            });
        }
    }

    const game = new Game(canvas.width, canvas.height);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update();
        game.draw(ctx);
        if(!game.gameOver) requestAnimationFrame(animate);
    }

    animate();
})