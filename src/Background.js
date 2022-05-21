class Background{

    constructor(){
        this.width = canvas.width;
        this.x = this.width;
        this.y = 0;
    
        this.speed = -0.5;
    }
    
    update(){
        this.render();
        this.x += this.speed;
        //se passou 3/4 da imagem, voltar para 0
        if(this.x <= 0) this.x = canvas.width;

    }

    render(){
        ctx.drawImage(gImages['background'], this.x, this.y, canvas.width, canvas.height);
        ctx.drawImage(gImages['background'], this.x-this.width, this.y, canvas.width, canvas.height);
    }
} 