    class Game{
        constructor(canvas, context){
            this.canvas = canvas;
            this.ctx = context;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.baseHeight = 720;
            this.ratio = this.height / this.baseHeight;
            this.background = new Background(this);
            this.player = new Player(this);
            this.gravity;
            this.speed;
            this.obstacles = [];
            this.numberOfObstacles = 1000;
            this.score;
            this.timer;
            this.gameOver;
            this.bottomMargin;
            this.message1;
            this.message2;
            this.smallFont;
            this.largeFont;
            this.minSpeed;
            this.maxSpeed;
            this.eventTimer = 0;
            this.eventInterval = 150;
            this.eventUpdate = false;
            this.touchStartX;
            this.swipeDistance = 50;
            this.sound = new AudioControl();

            this.resize(window.innerWidth, window.innerHeight);

            this.replayButton = document.getElementById('replayButton');
            this.replayButton.addEventListener('click', () => {
                this.resize(window.innerWidth, window.innerHeight);
                this.sound.playBgMusic();
            });

            this.resize(window.innerWidth, window.innerHeight);

            window.addEventListener('resize', e => {
                this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight);
            });

            window.addEventListener('keydown', e => {
                this.sound.playBgMusic(); 
                
                if ((e.key === 'r' || e.key === 'R') && this.gameOver) {
                    this.resize(window.innerWidth, window.innerHeight);
                    this.sound.playBgMusic();
                }
                
                if (e.key === ' ' || e.key === 'Enter' || e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
                    this.player.flap();
                }
                
                if (e.key === 'Shift' || e.key.toLowerCase() === 'f') {
                    this.player.startCharge();
                }
            });

            window.addEventListener('keyup', e => {
                if (e.key === ' ' || e.key === 'Enter' || e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
                    this.player.wingsUp();
                }
                // Stop charging when charge keys are released
                // if (e.key === 'Shift' || e.key.toLowerCase() === 'f') {
                //     this.player.stopCharge();
                //     this.player.wingsUp();
                // }
            }); 

            this.canvas.addEventListener('mousedown', e => {
                this.sound.playBgMusic(); 
                this.player.flap();
            });

            this.canvas.addEventListener('mouseup', () => {
                this.player.wingsUp();
            });

            this.canvas.addEventListener('touchstart', e => {
                this.sound.playBgMusic(); 
                this.player.flap();
                this.touchStartX = e.changedTouches[0].pageX;
            });

            this.canvas.addEventListener('touchmove', e => {
                if (e.changedTouches[0].pageX - this.touchStartX > this.swipeDistance) {
                    this.player.startCharge();
                }
            });

            this.canvas.addEventListener('touchend', () => {
                this.player.wingsUp();
            });
        }
        resize(width, height){
            this.canvas.width = width;
            this.canvas.height = height;
            this.ctx.fillStyle = 'black';
            this.ctx.textAlign = 'right';
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = 'white';
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.ratio = this.height / this.baseHeight;
            this.background.resize();
            this.gravity = 0.20 * this.ratio;

            this.sound.playBgMusic();

            this.smallFont = Math.ceil(25 * this.ratio);
            this.largeFont = Math.ceil(45 * this.ratio);
            
            this.bottomMargin = Math.floor(20 * this.ratio);
            this.speed = 5 * this.ratio;
            this.minSpeed = this.speed;
            this.maxSpeed = this.speed * 2.5;

            this.player.resize();
            this.createObstacles();
            this.obstacles.forEach(obstacle => {
                obstacle.resize();
            });
            this.score = 0;
            this.gameOver = false;
            this.timer = 0;

            if (this.replayButton) this.replayButton.style.display = 'none';
        } 
        render(deltaTime){  
            if(!this.gameOver) {
                this.timer += deltaTime;
                const speedIncrement = 0.0001 * this.ratio * deltaTime;
                if (this.minSpeed < 12 * this.ratio) { 
                    this.minSpeed += speedIncrement;
                }
                this.maxSpeed = this.minSpeed * 3;
                if(!this.player.charging){
                    this.speed = this.minSpeed;
                } else {
                    this.speed = this.maxSpeed;
                }
            }
            this.handlePeriodicEvents(deltaTime);
            this.background.update();
            this.background.draw();
            this.drawStatusText(); 
            this.player.update();
            this.player.draw();
            this.obstacles.forEach(obstacle => {
                obstacle.update();
                obstacle.draw();
            });
        }
        createObstacles(){
            this.obstacles = [];
            const firstX = this.baseHeight * this.ratio;
            const obstacleSpacing = 600 * this.ratio;
            for(let i = 0 ; i < this.numberOfObstacles ; i++){
                this.obstacles.push(new Obstacle(this, firstX + (i * obstacleSpacing)));
            }
        }
        checkCollision(a, b){
            const dx = a.collisionX - b.collisionX;
            const dy = a.collisionY - b.collisionY;
            const distance = Math.sqrt(dx*dx + dy*dy);
            const sumOfRadii = a.collisionRadius + b.collisionRadius;
            return distance <= sumOfRadii;  
        }

        formatTimer(){
            return (this.timer * 0.001).toFixed(1);
        }
        handlePeriodicEvents(deltaTime){
            if(this.eventTimer < this.eventInterval){
                this.eventTimer += deltaTime;
                this.eventUpdate = false;
            }
            else{
                this.eventTimer = 0;
                this.eventUpdate = true;
            }
        }
        triggerGameOver(){
            if(!this.gameOver){
                this.gameOver = true;
                this.sound.fadeOutBgMusic();

                this.replayButton.style.display = 'block';

                if(this.obstacles.length <= 0){
                    this.sound.play(this.sound.win);
                    this.message1 = "Nailed it!";
                    this.message2 = "Can you get more than  " + this.score + ' points?';
                }else{
                    this.sound.play(this.sound.lose);
                    this.message1 = "Getting rusty?";
                    this.message2 = "Can you get more than " + this.score + ' points?'; 
                }
            }
        }   
        drawStatusText(){
            this.ctx.save();
            this.ctx.font = this.largeFont + 'px Bungee';
            this.ctx.fillText('Score: ' + this.score , this.width - this.smallFont, this.largeFont);
            this.ctx.textAlign = 'left';
            this.ctx.fillText('Timer: ' + this.formatTimer(), this.smallFont, this.largeFont);
            
            if(this.gameOver){
                this.ctx.textAlign = 'center';
                
                this.ctx.font = this.largeFont + 'px Bungee';
                this.ctx.fillText(this.message1, this.width * 0.5, this.height * 0.5 - this.largeFont, this.width);
                this.ctx.font = this.smallFont + 'px Bungee';
                this.ctx.fillText(this.message2, this.width * 0.5, this.height * 0.5 - (this.smallFont * 0.5), this.width);
                

                this.ctx.fillText("Press 'R' to try again", this.width * 0.5, this.height * 0.5 + this.smallFont);
            }
            

            this.ctx.fillStyle = '#7c8300';
            if(this.player.energy <= this.player.minEnergy){
                this.ctx.fillStyle = '#8a0700';
            }else if(this.player.energy >= this.player.maxEnergy){
                this.ctx.fillStyle = '#027800';
            }
            
            const startX = 10 * this.ratio;
            const startY = 70 * this.ratio; 
            const barWidth = this.player.barSize;
            const barHeight = this.player.barSize; 
            const gap = 1 * this.ratio; 

            for(let i = 0; i < this.player.energy; i++ ){
                this.ctx.fillRect(
                    startX + (i * (barWidth + gap)), 
                    startY,                          
                    barWidth,                        
                    barHeight
                );
            }
            
            this.ctx.restore();
        }
    }

    window.addEventListener('load', function(){
        const canvas = document.getElementById('canvas1');
        const ctx = canvas.getContext('2d');
        canvas.width = 720;
        canvas.height =720;

        const game = new Game(canvas, ctx);

        let lastTime = 0;
        function animate(timeStamp){
            const deltaTime = timeStamp - lastTime;
            lastTime = timeStamp;
            // ctx.clearRect(0,0,canvas.width,canvas.height);
            game.render(deltaTime);
            //if(!game.gameOver) 
                requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    });
