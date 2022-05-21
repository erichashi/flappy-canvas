class PlayState extends BaseState {

    constructor(){
        // this.bird = new Bird();
        super();

        this.pipes = [];

        this.tts = 0;
        this.score = 0;

    }

    enter(params){
        this.bird = params.bird;
        gSounds['wing'].play()
    }

    update(){

        this.tts++;
        //se está na hora de criar um novo Pipe
        if(this.tts >= HORIGAP){
            this.tts = 0;
            this.pipes.push(new Pipe());
        }

        background.update()

        for (let i = 0, len = this.pipes.length; i < len; i++) {
            let pipe = this.pipes[i];
            
            // this.pipes.forEach((pipe, i) => {
            pipe.update();

                //se encostar no this.bird
                if(pipe.current){
                    if( this.bird.x + this.bird.img.width >= pipe.x && 
                        (this.bird.y + this.bird.img.height >= pipe.y ||
                        this.bird.y <= pipe.y - VERTGAP)) {
                            //Die
                            gSounds['die'].currentTime = .3 ;
                            gSounds['die'].play();
                            gStateMachine.change('gameover', {score: this.score})
                            break;
                        };
                };

                if(pipe.remove){
                    setTimeout(() => {
                        this.pipes.splice(i, 1);
                    }, 0);
                } 
            // });
        }

        base.update()
        this.bird.update();
        //Se encostar no chão
        if(this.bird.y + this.bird.img.height >= canvas.height - BASEHEIGHT){
            //Morrer
            gSounds['die'].currentTime = .3 ;
            gSounds['die'].play();
    
            gStateMachine.change('gameover', {score: this.score})
        }

        writeTextCanvas(gStateMachine.current.score, smalltextsize/5, smalltextsize*1.5, 'white', smalltextsize*1.5);

    }
}
