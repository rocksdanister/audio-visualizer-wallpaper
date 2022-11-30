let canvas = document.getElementById("canvas");
let max_height, startPos, vizWidth, midY;

let glob = { bloom: false, bloomRadius: 10 };
let backgroundColor = "rgb(20,20,20)";
let linesColor = "rgb(250,250,250)";
let square = false;
let ctx = canvas.getContext("2d");
let gradient;

//If true = image else color
let bg_choice = true;

let img_background = new Image(1920, 1080);
img_background.src = 'wallpapers\black.png';

let horizontal_pos = 90;
let vertical_pos = 10;
let visualizer_length = 80;
let line_thickness = 2;

function setSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  max_height = window.innerHeight * 0.3;
  startPos = window.innerWidth * (vertical_pos / 100);
  vizWidth = window.innerWidth * (visualizer_length / 100);
  midY = canvas.height * (horizontal_pos / 100);
  gradient = ctx.createLinearGradient(0, midY, 0, max_height);
  gradient.addColorStop(0, backgroundColor);
  gradient.addColorStop(1, linesColor);

}

window.onload = () => {
  setSize();
};

window.onresize = () => {
  setSize();
};

function livelyPropertyListener(name, val) {
  switch (name) {
    case "lineColor":
      var color = hexToRgb(val);
      linesColor = `rgb(${color.r},${color.g},${color.b})`;
      gradient = ctx.createLinearGradient(0, midY, 0, max_height);
      gradient.addColorStop(0, backgroundColor);
      gradient.addColorStop(1, linesColor);
      break;
    case "backgroundColor":
      var color = hexToRgb(val);
      backgroundColor = `rgb(${color.r},${color.g},${color.b})`;
      gradient = ctx.createLinearGradient(0, midY, 0, max_height);
      gradient.addColorStop(0, backgroundColor);
      gradient.addColorStop(1, linesColor);
      break;
    case "imgSelect":
      img_background.src = val;
      break;
    case "bg_choice":
      bg_choice = val;
      break;
    case "square":
      square = val;
      break;
    case "horizontal_pos":
      horizontal_pos = val;
      midY = canvas.height * (val / 100);
      break;
    case "vertical_pos":
      vertical_pos = val;
      startPos = window.innerWidth * (vertical_pos / 100);
      break;
    case "visualizer_length":
      visualizer_length = val;
      vizWidth = window.innerWidth * (visualizer_length / 100);
      break;
    case "line_thickness":
      line_thickness = val;
      ctx.lineWidth = line_thickness;
      break;
  }
}

function livelyAudioListener(audioArray) {
  maxVal = 1;
  for (var x of audioArray) {
    if (x > maxVal) maxVal = x;
  }

  const offSet = vizWidth / audioArray.length;
  const arrMid = audioArray.length / 2;

  if (bg_choice) {
    ctx.drawImage(img_background, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

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
  ctx.lineWidth = line_thickness;
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
