class GameOverState extends BaseState{
    constructor(){
        super();
    }
    enter(params){
        this.score = params.score;
        if(this.score > localStorage.getItem('record_flappy')*1) localStorage.setItem('record_flappy', this.score);
    }

    update(){

        //Parar chão e background
        background.render()
        base.render();


        //escrever texto
        writeTextCanvas(`You lost!!`, smalltextsize, texty*0.9, 'white', smalltextsize*3);
        writeTextCanvas(`Score: ${this.score}`, smalltextsize, texty, 'white', smalltextsize*1.5);
        writeTextCanvas("SPACE to restart", smalltextsize, texty*1.1, 'white', smalltextsize);

        if(wasPressed('Space')) gStateMachine.change('title');

    }
}
