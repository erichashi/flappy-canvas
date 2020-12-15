const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const background_img = document.getElementById('background');
const base_img = document.getElementById('base');


const BASEHEIGHT = 100;

// Set width and heights
// canvas.height = innerHeight;
// canvas.width = innerWidth;


var pause = true;

// Event Listeners
// canvas.addEventListener('mousemove', e => {
//     mouse.x = e.x;
//     mouse.y = e.y;
// })

// window.addEventListener('resize',function(){
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     init();
// } )


document.addEventListener('keydown', e =>{
    if(e.keyCode === 32){
        pause = !pause
        update()
    };
} )




function Background(){
    this.x = 0;
    this.y = 0;
    this.img = background_img;
    this.width = canvas.width;

    this.speed = 0.5;

    this.update = () => {
        this.draw();
        this.x -= this.speed;
        if(this.x <= canvas.width) this.x = canvas.width;

    }

    this.draw = () => {
        ctx.beginPath();
        ctx.drawImage(this.img, this.x, this.y);
        ctx.drawImage(this.img, this.x + this.width, this.y);
        ctx.closePath();
    }

}


function Base(){
    this.x = 0;
    this.y = canvas.height - BASEHEIGHT;
    this.img = base_img;
    this.width = canvas.width;

    this.speed = 1;

    this.update = () => {
        this.draw();
        this.x -= this.speed;
        if(this.x <= 0) this.x = canvas.width;

    }

    this.draw = () => {
        ctx.beginPath();
        ctx.drawImage(this.img, this.x, this.y);
        ctx.drawImage(this.img, this.x + this.width, this.y);
        ctx.closePath();
    }

}



// Initialization

let background;
let base;
function init(){
    background = new Background();
    base = new Base();
}


function update(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    background.update()
    base.update();

    if(!pause){   
        requestAnimationFrame(update);
    };
}

init()
update();