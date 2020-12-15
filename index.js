const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const body = document.body;

const background_img = document.getElementById('background');
const pipe_img = document.getElementById('pipe');
const pipev_img = document.getElementById('pipev');
const bird_img = document.getElementById('bird');
const base_img = document.getElementById('base');

//Ground height
const BASEHEIGHT = 100;


// const BIRDSIZE = 20;

const GRAVITY = 0.3;

//Pipe gaps
const HORIGAP = 100;
const VERTGAP = 100;
const PIPESPEED = 2;

// Set width and heights
canvas.height = 512;
canvas.width = 288;



let pause = true;
let running = false;
let gameover = false;

//Audios
let wing = new Audio("sounds/wing.wav");
let point = new Audio("sounds/point.wav");
let die = new Audio("sounds/die.wav");

//event listeners
document.addEventListener('keydown', e =>{
    //COMANDOS PARA PAUSE
    // if(e.keyCode === 13){
    //     pause = !pause
    //     update()
    // } else 
    
    if(e.keyCode === 32){

        if(!running) running = true;

        if(gameover) restart();
        
        bird.vely = -5;
        
        if(running) wing.play()
    };
} )

document.addEventListener('touchstart', e =>{

    if(!running) running = true;

    if(gameover) restart();
    
    bird.vely = -5;
    
    if(running) wing.play()

} )


// Helpers
function randomIntFromRange(min,max){
    return Math.floor(Math.random()*(max-min+1) + min);
}

// Objects
function Bird(x, y){
    this.x = x;
    this.y = y;
    this.img = bird_img; 
    
    //Velocidade vertical
    this.vely = 1;

    this.update = function(){

        //Se durante jogo
        if(running){
            //Cair
            this.y += this.vely;
            this.vely += GRAVITY;
        }

        //Se encostar no chão
        if(this.y + this.img.height >= canvas.height - BASEHEIGHT){
            //Morrer
            die.play();
            gameover = true;
        }

        this.draw();
    }

    this.draw = function(){
        ctx.beginPath();
        ctx.drawImage(this.img, this.x, this.y);
        ctx.closePath();
    }
}

function Pipe(){
    this.img = pipe_img;
    this.width = this.img.width;
    
    //Começar no lado direito
    this.x = canvas.width + this.width;
    //valor aleatório do y
    this.y = randomIntFromRange(canvas.height - BASEHEIGHT - 10, 100);

    //boolean para checar se saiu
    this.remove = false;

    this.speed = PIPESPEED;

    //imagem furo para cima
    this.img = pipe_img;
    //imagem furo para baixo
    this.imgv = pipev_img;

    //y do cano de cima
    this.uppipey = 0;

    //valores para checar colisão
    this.current = true;
    this.pass = false;
    
    this.update = () => {

        //se passar do pássaro, parar de contar
        if(this.x + this.width < bird.x) {
            this.current = false
        }

        //Se não é current e não passou, score++
        if(!this.current && !this.pass){
            score++;
            point.play();
            this.pass = true;
        }

        //Se saiu do mapa
        if(this.x + this.width <= 0) {
            this.remove = true;
        }

        //y do cano de cima é igual ao this.y - gap - altura
        this.uppipey = this.y - HORIGAP - this.imgv.height;
        
        this.x -= this.speed;
        
        
        if(this.current){
            //se encostar no bird
            if( bird.x + bird.img.width >= this.x && 
                (bird.y + bird.img.height >= this.y ||
                bird.y <= this.y - HORIGAP)
                ) {
                    //Die
                    die.play();
                    gameover = true;
                }
        }

        this.draw();
    }

    this.draw = () => {
        ctx.beginPath();
        ctx.drawImage(this.img, this.x, this.y);
        ctx.drawImage(this.imgv, this.x, this.uppipey);
        ctx.closePath();
    }
}

function Background(){
    this.x = 0;
    this.y = 0;
    this.img = background_img;
    this.width = canvas.width;

    this.speed = -0.5;

    this.update = () => {
        this.draw();
        this.x += this.speed;
        //se passou 3/4 da imagem, voltar para 0
        if(this.x <= -(3*this.img.width/4)) this.x = 0;

    }

    this.draw = () => {
        ctx.beginPath();
        ctx.drawImage(this.img, this.x, this.y);
        ctx.closePath();
    }
} 

function Base(){
    this.x = 0;
    this.y = canvas.height - BASEHEIGHT;
    this.img = base_img;
    this.width = canvas.width;

    this.speed = -PIPESPEED;

    this.update = () => {
        this.draw();
        this.x += this.speed;
        if(this.x <= -(3*this.img.width/4)) this.x = 0;

    }

    this.draw = () => {
        ctx.beginPath();
        ctx.drawImage(this.img, this.x, this.y);
        ctx.closePath();
    }

}



function writeTextCanvas(text, x, y, color, size){
    ctx.font = `${size}px Verdana`;
    ctx.fillStyle = color;
    ctx.fillText(`${text}`, x, y); 
}


// Initialization
let bird;
let background;
let base;
let pipes;
function init(){
    pipes = [];

    background = new Background();
    base = new Base();
    bird = new Bird(canvas.width/2 - bird_img.width, canvas.height/2);
}

//time to surge (pipe)
let tts = 0; 
let score = 0;
let record = 0;

function restart(){
    score = 0;   
    score = 0;
    gameover = false;
    running = false;
    init();
}

function update(){
    ctx.clearRect(0,0,canvas.width, canvas.height);

    if(running){
        tts++;
        //se está na hora de criar um novo Pipe
        if(tts >= VERTGAP){
            tts = 0;
            pipes.push(new Pipe());
        }

    }

    if(gameover){

        //Parar chão e background
        background.draw()
        base.draw();

        //para jogo
        running = false;

        //update do record
        if(score > record) record = score

        //escrever texto
        writeTextCanvas(`You lose!`, 10, 160, 'white', 30);
        writeTextCanvas(`Score: ${score}`, 10, 190, 'white', 15);
        writeTextCanvas("Clique SPACE", 10, 220, 'white', 10);

    } else {
        //Só fazer update se não for gameover

        background.update()
        pipes.forEach((pipe, i) => {
            pipe.update();
            if(pipe.remove){
                setTimeout(() => {
                    pipes.splice(i, 1);
                }, 0);
            } 
        });

        base.update()
        bird.update();

        if(running) writeTextCanvas(score, 2, 15, 'white', 15);
    }

    //Tela de start
    if(!running && !gameover){
        writeTextCanvas("Flappy Canvas", 10, 200, 'white', 30);
        writeTextCanvas("Clique SPACE para começar", 10, 220, 'white', 10);
        writeTextCanvas(`Record: ${record}`, 0, 15, 'white', 15);
    } 

    
    // if(!pause){   
        requestAnimationFrame(update);
    // };

}

init()
update();