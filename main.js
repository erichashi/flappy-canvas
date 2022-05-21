const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const virtualWidth = 288;
const virtualHeight = 512;

let gImages = {};
let gSounds = {};
window.onload = () => {
  
    
    let canvas_height = Math.floor(document.body.clientHeight*0.9);
    let canvas_width = Math.floor(canvas_height/1.8);

    if(canvas_width > document.body.clientWidth){
        canvas_width = document.querySelector('div').clientWidth;
        canvas_height = Math.floor(canvas_width/.5625);
    } 
 
    canvas.width = virtualWidth;
    canvas.height = virtualHeight;

    ctx.mozImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    canvas.style.width = `${canvas_width}px`;
    canvas.style.height = `${canvas_height}px`;

    
    preload(
        {
            'birdImg': "assets/img/bird.png",
            'birdImgDown': "assets/img/birddown.png",
            'birdImgUp': "assets/img/birdup.png",
            'background': "assets/img/background.png",
            'pipeImg': "assets/img/pipe.png",
            'pipevImg': "assets/img/pipev.png",

        },
        {
            'wing': "assets/sounds/wing.wav",
            'point': "assets/sounds/point.wav",
            'die': "assets/sounds/die.wav",
        }, () => {
            create()
            update();
        }
    );
}



// let pause = true;

//Event listeners
addEventListener('keydown', e =>{
    keysPressed[e.code] = true;
    
    // if(e.keyCode === 13){
    //     pause = !pause
    //     update()
    // }             
})
addEventListener('touchstart', e =>{
    e.preventDefault();
    keysPressed['Space'] = true;
});

function wasPressed(key){
    if (keysPressed[key]) return true; else return false;
}



function preload(imgfiles, audiofiles, callback){
    let val = 0;
    let goal = Object.keys(imgfiles).length + Object.keys(audiofiles).length; 


    Object.keys(imgfiles).forEach(imgkeys => {
        let img = new Image();
        img.src = imgfiles[imgkeys];
        gImages[imgkeys] = img;
        img.onload = () => {
            val++;
            if(val >= goal) callback();
        };
    });

    Object.keys(audiofiles).forEach(audiokeys => {
        let audio = new Audio(audiofiles[audiokeys]);
        gSounds[audiokeys] = audio;
        audio.volume = .3;
        val++;
        if(val >= goal) callback();
    });

}


// Initialization
let background;
let base;

//variable que determina cenas do title, play e gameover
let gStateMachine;

//dicionario para input do teclado
let keysPressed;


function create(){

    background = new Background();
    base = new Base();    

    gStateMachine = new StateMachine({
        title: () => new TitleState(),
        play: () => new PlayState(),
        gameover: () => new GameOverState()
    })
    gStateMachine.change('title')

    if(!localStorage.getItem('record_flappy')) localStorage.setItem('record_flappy', 0);
    
    keysPressed = {};
}

function update(){
    ctx.clearRect(0,0,canvas.width, canvas.height);

    gStateMachine.update();

    keysPressed = {};

    // if(!pause){   
        requestAnimationFrame(update);
    // };

}

