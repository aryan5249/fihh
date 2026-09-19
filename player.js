class Player {
    constructor(game){
        this.game = game;
        this.x = 50;
        this.y;
        this.spriteWidth = 200;
        this.spriteHeight = 200;
        this.width = 200;
        this.height = 200; 
        this.speedY;
        this.flapSpeed;
        this.collisionX;
        this.collisionY;
        this.collisionRadius;  
        this.collided;
        this.energy = 30;
        this.maxEnergy = this.energy * 2;
        this.minEnergy = 25;
        this.charging;
        this.barSize;
        this.image = document.getElementById('player_fish');
        this.frameY;    
    }
    draw(){
        this.game.ctx.drawImage(this.image, 0 , this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        // this.game.ctx.beginPath();
        // this.game.ctx.arc(this.collisionX + this.collisionRadius * 0.8, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
        // this.game.ctx.stroke();
    }
    update(){
        //this.x++;
        this.handleEnergy();
        if(this.speedY >= 0){
            this.wingsUp();
        }
        this.collisionY = this.y + this.height * 0.5;
        this.y += this.speedY;
        if(!this.isTouchingBottom() && !this.charging){
            this.speedY += this.game.gravity;
        }
        else{
            this.speedY = 0;
        }
        //stawp from escaping bottom of screen
        if(this.isTouchingBottom()){
            this.y = this.game.height - this.height - this.game.bottomMargin;
            this.wingsIdle();
            this.game.triggerGameOver()
        }
        //gonna hard stop at the top so big boi bird wont escape the screen
        if(this.isTouchingTop()){
            this.y = -30;
            if(this.speedY < 0) this.speedY = 0
        }
    }
    resize(){
        this.width = this.spriteWidth * this.game.ratio;
        this.height = this.spriteHeight * this.game.ratio;
        this.y = this.game.height * 0.5 - this.height * 0.5;
        this.speedY = -5 * this.game.ratio;

        this.flapSpeed = 5 * this.game.ratio;
        this.collisionRadius = 40 * this.game.ratio;
        this.collisionX = this.x + this.width * 0.5;
        this.collided = false;
        this.barSize = Math.ceil(5 * this.game.ratio);
        this.energy = 30;
        this.frameY = 0;
        this.charging = false;

    }
    startCharge(){
        if (this.game.gameOver) return;
        if(this.energy >= this.minEnergy && !this.charging){
            this.charging = true;
            this.game.speed = this.game.maxSpeed;
            this.wingsCharge();
            this.game.sound.play(this.game.sound.charge);
            
        }else{
            this.stopCharge();
        }
    }
    stopCharge(){
        this.charging = false;
        this.game.speed = this.game.minSpeed;
    }
    wingsIdle(){
        if(!this.charging) this.frameY = 0;
    }
    wingsDown(){
        if(!this.charging) this.frameY = 1;
    }
    wingsUp(){
        if(!this.charging) this.frameY = 2;
    }
    wingsCharge(){  
        this.frameY = 3;
    }
    isTouchingTop(){
        return this.y <= -30 ;
    }
    isTouchingBottom(){
        return this.y >= this.game.height - this.height - this.game.bottomMargin;
    }
    handleEnergy(){
        if(this.game.eventUpdate){
            if(this.energy < this.maxEnergy){
                this.energy += 2;
            }
            if(this.charging){
                this.energy -= 10;
                if(this.energy <= 0){
                    this.energy = 0;
                    this.stopCharge();
                }
            }
        }
        
        
    }
    flap(){
        if (this.game.gameOver) return;
        this.stopCharge();
        if(!this.isTouchingTop()){
            this.game.sound.play(this.game.sound.flapSounds[Math.floor(Math.random() * 5)]);
            this.speedY = -this.flapSpeed;
            this.wingsDown();
        }
    }
}
