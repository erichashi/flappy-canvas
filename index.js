const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const body = document.body;

const background_img = document.getElementById('background');
const base_img = document.getElementById('base');
const pipe_img = document.getElementById('pipe');
const pipev_img = document.getElementById('pipev');
const bird_img = document.getElementById('bird');
const birddown_img = document.getElementById('birddown');
const birdup_img = document.getElementById('birdup');

// Set width and heights

canvas.height = Math.floor(body.clientHeight*0.9);
canvas.width = Math.floor(canvas.height/1.8);

if(canvas.width > body.clientWidth){
    canvas.width = Math.floor(body.clientWidth);
    canvas.height = canvas.width * 1.8;
} 


//Ground height
const BASEHEIGHT = Math.floor(canvas.height/5);

const BIRDHEIGHT = Math.floor(canvas.height/21);
const BIRDWIDTH = Math.floor(canvas.width/8.5);


//Pipe gaps
const HORIGAP = 120//Math.floor(canvas.width/5.12); 
const VERTGAP = Math.floor(BIRDHEIGHT*4);
const PIPESPEED = Math.floor(BIRDWIDTH/17);

const JUMP = Math.floor(BIRDHEIGHT/5);
const GRAVITY = JUMP/16.6;

const PIPEWIDTH = Math.floor(BIRDWIDTH*1.5);
const PIPEHEIGHT = Math.floor(PIPEWIDTH * 6.15);

const smalltextsize = Math.floor(canvas.width/40)
const texty = Math.floor(canvas.height/3.7)


// let pause = true;
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
        
        bird.vely = -JUMP;
        
        if(running){ 
            wing.currentTime = 0;
            wing.play()
        }
    };
} )

document.addEventListener('touchstart', () =>{

    if(!running) running = true;

    if(gameover) restart();
    
    bird.vely = -JUMP;

    if(running){ 
        wing.currentTime = 0;
        wing.play()
    }

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

        if(this.vely < 0){
            this.img = birddown_img;
        } else {
            this.img = birdup_img;
        }

        //Se encostar no chão
        if(this.y + this.img.height >= canvas.height - BASEHEIGHT){
            //Morrer
            gameover = true;
            die.currentTime = .3 ;
            die.play();
        }

        this.draw();
    }

    this.draw = function(){
        ctx.beginPath();
        ctx.drawImage(this.img, this.x, this.y, BIRDWIDTH, BIRDHEIGHT);
        ctx.closePath();
    }
}

function Pipe(){
    this.img = pipe_img;

    //Começar no lado direito
    this.x = canvas.width + PIPEWIDTH;
    //valor aleatório do y
    this.y = randomIntFromRange(canvas.height - BASEHEIGHT - Math.floor(canvas.height/50), Math.floor(canvas.height/5));

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
        if(this.x + PIPEWIDTH < bird.x) {
            this.current = false
        }

        //Se não é current e não passou, score++
        if(!this.current && !this.pass){
            score++;
            point.currentTime = 0;
            point.play();
            this.pass = true;
        }

        //Se saiu do mapa
        if(this.x + PIPEWIDTH <= 0) {
            this.remove = true;
        }

        //y do cano de cima é igual ao this.y - gap - altura
        this.uppipey = this.y - VERTGAP - PIPEHEIGHT;
        
        this.x -= this.speed;
        
        
        if(this.current){
            //se encostar no bird
            if( bird.x + bird.img.width >= this.x && 
                (bird.y + bird.img.height >= this.y ||
                bird.y <= this.y - VERTGAP)
                ) {
                    //Die
                    die.currentTime = .3 ;
                    die.play();
                    gameover = true;
                }
        }

        this.draw();
    }

    this.draw = () => {
        ctx.beginPath();
        ctx.drawImage(this.img, this.x, this.y, PIPEWIDTH, PIPEHEIGHT);
        ctx.drawImage(this.imgv, this.x, this.uppipey, PIPEWIDTH, PIPEHEIGHT);
        ctx.closePath();
    }
}

function Background(){
    this.img = background_img;
    this.width = canvas.width;
    this.x = this.width;
    this.y = 0;

    this.speed = -0.5;

    this.update = () => {
        this.draw();
        this.x += this.speed;
        //se passou 3/4 da imagem, voltar para 0
        if(this.x <= 0) this.x = canvas.width;

    }

    this.draw = () => {
        ctx.beginPath();
        ctx.drawImage(this.img, this.x, this.y, canvas.width, canvas.height);
        ctx.drawImage(this.img, this.x-this.width, this.y, canvas.width, canvas.height);
        ctx.closePath();
    }
} 

function Base(){
    this.img = base_img;
    this.width = canvas.width;
    this.height=BASEHEIGHT;
    this.x = this.width;
    this.y = canvas.height - BASEHEIGHT;

    this.speed = -PIPESPEED;

    this.update = () => {
        this.draw();
        this.x += this.speed;
        if(this.x <= 0) this.x = this.width;

    }

    this.draw = () => {
        ctx.beginPath();
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.img, this.x-this.width, this.y, this.width, this.height);
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
        if(tts >= HORIGAP){
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
        writeTextCanvas(`You lose!`, smalltextsize, texty*0.9, 'white', smalltextsize*3);
        writeTextCanvas(`Score: ${score}`, smalltextsize, texty, 'white', smalltextsize*1.5);
        writeTextCanvas("Clique SPACE", smalltextsize, texty*1.1, 'white', smalltextsize);

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

        if(running) writeTextCanvas(score, smalltextsize/5, smalltextsize*1.5, 'white', smalltextsize*1.5);
    }

    //Tela de start
    if(!running && !gameover){
        writeTextCanvas("Flappy Canvas", smalltextsize, texty, 'white', smalltextsize*3);
        writeTextCanvas("Clique SPACE para começar", smalltextsize, texty*1.1, 'white', smalltextsize);
        writeTextCanvas(`Record: ${record}`, 0, smalltextsize*1.5, 'white', smalltextsize*1.5);
    } 

    
    // if(!pause){   
        requestAnimationFrame(update);
    // };

}

init()
update();