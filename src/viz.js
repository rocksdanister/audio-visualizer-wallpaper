let canvas = document.getElementById("canvas");
let max_height, startPos, vizWidth, midY;

let glob = { bloom: false, bloomRadius: 10 };
let backgroundColor = "rgb(0,0,0)";
let linesColor = "rgb(255,0,0)";
let square = true;

let ctx = canvas.getContext("2d");
let gradient;

function setSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  max_height = window.innerHeight * 0.5;
  startPos = window.innerWidth * 0.1;
  vizWidth = window.innerWidth * 0.8;
  midY = canvas.height - canvas.height / 4;

  gradient = ctx.createLinearGradient(0,midY, 0, max_height);
  gradient.addColorStop(0, backgroundColor);
  gradient.addColorStop(1, linesColor);

}

window.onload = () => {
  setSize();
};

window.onresize = () => {
  setSize();
};

function livelyPropertyListener(name, val)
{
  switch(name) {
    case "lineColor":
      var color = hexToRgb(val);
      linesColor=`rgb(${color.r},${color.g},${color.b})`;
      gradient = ctx.createLinearGradient(0,midY, 0, max_height);
      gradient.addColorStop(0, backgroundColor);
      gradient.addColorStop(1, linesColor);
      break;
  case "backgroundColor":
      var color = hexToRgb(val);
      backgroundColor = `rgb(${color.r},${color.g},${color.b})`;
      gradient = ctx.createLinearGradient(0,midY, 0, max_height);
      gradient.addColorStop(0, backgroundColor);
      gradient.addColorStop(1, linesColor);
      break;   
    case "square":
      square = val;
      break;     
  }
}

function livelyAudioListener(audioArray) 
{
  maxVal = 1;
  for (var x of audioArray) {
    if (x > maxVal) maxVal = x;
  }

  const offSet = vizWidth / audioArray.length;
  const arrMid = audioArray.length / 2;
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.lineJoin = "round";
  ctx.moveTo(startPos - offSet * 3, midY);
  ctx.lineTo(startPos, midY);
  let posInLine = -1;
  for (var x = 0; x < audioArray.length; x++) {
    posInLine++;
    ctx.lineTo(
      startPos + offSet * posInLine,
      midY - (audioArray[x] / maxVal) * max_height
    );
    if (square)
      ctx.lineTo(
        startPos + offSet * (posInLine + 1),
        midY - (audioArray[x] / maxVal) * max_height
      );
  }
  ctx.lineTo(startPos + offSet * (posInLine + (square ? 1 : 0)), midY);
  ctx.lineTo(startPos + offSet * (posInLine + (square ? 4 : 3)), midY);

  ctx.fillStyle = gradient;
  ctx.fill();
  renderLine(linesColor);
}

function renderLine(color) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  if (glob.bloom) {
    ctx.shadowBlur = glob.bloomRadius;
    ctx.shadowColor = color;
  }
  ctx.stroke();
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}