class Base{
    constructor(){
        this.img = new Image(); this.img.src = "assets/img/base.png";
    
        this.width = canvas.width;
        this.height=BASEHEIGHT;
        this.x = this.width;
        this.y = canvas.height - BASEHEIGHT;
    
        this.speed = -PIPESPEED;
    }

    update() {
        this.render();
        this.x += this.speed;
        if(this.x <= 0) this.x = this.width;

    }

    render() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.img, this.x-this.width, this.y, this.width, this.height);
    }

}