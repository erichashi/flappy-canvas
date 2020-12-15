const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const pipe_img = document.getElementById('pipe');

let x = canvas.width/2
let y = canvas.height/2


ctx.beginPath()
ctx.scale(1, -1);
ctx.drawImage(pipe_img, x, y)
ctx.closePath()