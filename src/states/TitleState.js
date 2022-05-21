class TitleState extends BaseState {

    constructor(){
        // BaseState.call(this);
        super();
        this.bird = new Bird();
    }

    update() {

        background.update();
        base.update();
        this.bird.render();
        
        writeTextCanvas("Flappy", smalltextsize, texty, 'white', smalltextsize*3);
        writeTextCanvas("SPACE to start", smalltextsize, texty*1.1, 'white', smalltextsize);
        writeTextCanvas(`Record: ${localStorage.getItem('record_flappy')}`, 0, smalltextsize*1.5, 'white', smalltextsize*1.5);
        
        if(wasPressed('Space')) gStateMachine.change('play', {bird: this.bird});

 
    }

    
}
