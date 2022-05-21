// Helpers
function randomIntFromRange(min,max){
    return Math.floor(Math.random()*(max-min+1) + min);
}

function writeTextCanvas(text, x, y, color, size){
    ctx.font = `${size}px Verdana`;
    ctx.fillStyle = color;
    ctx.fillText(`${text}`, x, y); 
}