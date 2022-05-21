class Bird {

    constructor(){
        this.img = gImages['birdImg']
        
        this.x = canvas.width/2 - this.img.width;
        this.y = canvas.height/2;

        //Velocidade vertical
        this.vely = -JUMP;
    }

    update() {
   
        //Cair
        this.y += this.vely;
        this.vely += GRAVITY;
    
        //checar input
        if(wasPressed('Space')) {
            this.vely = -JUMP

            gSounds['wing'].currentTime = 0;
            gSounds['wing'].play()
        };

        //bater de asas
        if(this.vely < 0){
            this.img = gImages ['birdImgDown'];
        } else {
            this.img = gImages['birdImgUp'];
        }

        this.render();
    }

    render(){
        ctx.drawImage(this.img, this.x, this.y, BIRDWIDTH, BIRDHEIGHT);
    }

}
