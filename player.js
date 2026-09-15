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
    }
    draw(){
        this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update(){
        //this.x++;
        this.y += this.speedY;
        if(!this.isTouchingBottom()){
            this.speedY += this.game.gravity;
        }
        //stawp from escaping bottom of screen
        if(this.isTouchingBottom()){
            this.y = this.game.height - this.height;
        }
    }
    resize(){
        this.width = this.spriteWidth * this.game.ratio;
        this.height = this.spriteHeight * this.game.ratio;
        this.y = this.game.height * 0.5 - this.height * 0.5;
        this.speedY = -5 * this.game.ratio;

        this.flapSpeed = 5 * this.game.ratio;
    }
    isTouchingTop(){
        return this.y <=0;
    }
    isTouchingBottom(){
        return this.y >= this.game.height - this.height;
    }
    flap(){
        if(!this.isTouchingTop()){
            this.speedY = -this.flapSpeed;
        }
    }
}
