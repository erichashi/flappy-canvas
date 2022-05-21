class Pipe {
    constructor(){
        //Começar no lado direito
        this.x = canvas.width + PIPEWIDTH;
        //valor aleatório do y
        this.y = randomIntFromRange(canvas.height - BASEHEIGHT - Math.floor(canvas.height/50), Math.floor(canvas.height/5));
    
        //boolean para checar se saiu
        this.remove = false;
    
        this.speed = PIPESPEED;
        
        //y do cano de cima
        this.uppipey = 0;
    
        //valores para checar colisão
        this.current = true;
        this.pass = false;
    }

    
    update(){

        //se passar do pássaro, parar de contar
        if(this.x + PIPEWIDTH < gStateMachine.current.bird.x) {
            this.current = false
        }

        //Se não é current e não passou, score++
        if(!this.current && !this.pass){

            //testing
            gStateMachine.current.score++;

            gSounds['point'].currentTime = 0;
            gSounds['point'].play();
            this.pass = true;
        }

        //Se saiu do mapa
        if(this.x + PIPEWIDTH <= 0) {
            this.remove = true;
        }

        //y do cano de cima é igual ao this.y - gap - altura
        this.uppipey = this.y - VERTGAP - PIPEHEIGHT;
        
        this.x -= this.speed;
        
        this.render();
    }

    render(){
        ctx.drawImage(gImages['pipeImg'], this.x, this.y, PIPEWIDTH, PIPEHEIGHT);
        ctx.drawImage(gImages['pipevImg'], this.x, this.uppipey, PIPEWIDTH, PIPEHEIGHT);
    }
}