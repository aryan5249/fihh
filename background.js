class Background{
    constructor(game){
        this.game = game;
        this.image = document.querySelector("#background");
        this.width = 2400;
        this.height = this.game.baseHeight;
        this.x;
        this.scaleWidth;
        this.scaleHeight;
    }
    update(){
        this.x -= this.game.speed;
        if(this.x <= -this.scaleWidth){
            this.x += this.scaleWidth;
        }
    }
    draw(){
        this.game.ctx.drawImage(this.image, this.x, 0, this.scaleWidth, this.scaleHeight);   
        this.game.ctx.drawImage(this.image, this.x + this.scaleWidth - 2, 0, this.scaleWidth, this.scaleHeight);
        if(this.game.canvas.width >= this.scaleWidth){
            this.game.ctx.drawImage(this.image, this.x + (this.scaleWidth*2) - 4, 0, this.scaleWidth, this.scaleHeight);
        }
    }
    resize(){
        this.scaleWidth = this.width * this.game.ratio;
        this.scaleHeight = this.height * this.game.ratio;
        this.x = 0; 
    }
}