class AudioControl {
    constructor(){
        this.charge = document.getElementById('charge');
        this.flap1 = document.getElementById('flap1');
        this.flap2 = document.getElementById('flap2');
        this.flap3 = document.getElementById('flap3');
        this.flap4 = document.getElementById('flap4');
        this.flap5 = document.getElementById('flap5');
        this.win = document.getElementById('win');
        this.lose = document.getElementById('lose');
        this.flapSounds = [this.flap1, this.flap2, this.flap3, this.flap4, this.flap5];
        this.bgMusic = document.getElementById('bgMusic');
        this.bgMusic.volume = 0.2;
    }
    play(sound){
        sound.currentTime = 0;
        sound.play();
    }
    playBgMusic(){
        if (this.bgMusic.paused) {
            this.bgMusic.volume = 0.5;
            this.bgMusic.play().catch(err => console.log("Autoplay blocked:", err));
        }
    }

    fadeOutBgMusic() {
        const fadeInterval = setInterval(() => {
            if (this.bgMusic.volume > 0.05) {
                this.bgMusic.volume -= 0.05; 
            } else {
                this.bgMusic.volume = 0;
                this.bgMusic.pause();
                clearInterval(fadeInterval);
            }
        }, 100);
    }
}