'use strict'

// simple button to play a song
const playSound = function () {
  const jean = new Audio('../../../audio/jean.mp3')
  if (jean.paused) {
    jean.currentTime = 0
    jean.play()
  } else {
    jean.pause()
  }
}

// set up audio context with oscillator, analyser, filter, distortion, and gain node
const audioContext = new AudioContext()
const filter = audioContext.createBiquadFilter()
const oscillator = audioContext.createOscillator()
const analyser = audioContext.createAnalyser()
const distortion = audioContext.createWaveShaper()
const gainNode = audioContext.createGain()

// connect the signal chain
oscillator.connect(distortion)
distortion.connect(gainNode)
distortion.connect(analyser)
// gainNode.connect(audioContext.destination)

// oscillator.frequency.value = 200

const start = function () {
  oscillator.start()
}

const stop = function () {
  oscillator.stop()
}

// const val = $('#synth-volume').slider('value')

oscillator.start()

analyser.fftSize = 2048;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);

// Get a canvas defined with ID "oscilloscope"
var canvas = document.getElementById("oscilloscope");
var canvasCtx = canvas.getContext("2d");

// draw an oscilloscope of the current audio source

function draw() {

  requestAnimationFrame(draw);

  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.fillStyle = "rgb(200, 200, 200)";
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = "rgb(0, 0, 0)";

  canvasCtx.beginPath();

  var sliceWidth = canvas.width * 1.0 / bufferLength;
  var x = 0;

  for (var i = 0; i < bufferLength; i++) {

    var v = dataArray[i] / 128.0;
    var y = v * canvas.height / 2;

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
}
draw()

$(() => {
  $('#test').on('click', playSound)
  $('#start').click(function () {
    analyser.connect(audioContext.destination)
    console.log(analyser)
  })
  $('#stop').click(function () {
    analyser.disconnect(audioContext.destination)
      console.log(analyser)
  })
  $('#synth-volume').on('input', function () {
    gainNode.gain.value = this.value
  })
  $('#synth-frequency').on('input', function () {
    oscillator.frequency.value = this.value
  })
  $('#shape-selector').on('change', function () {
    oscillator.type = this.value
  })
  $('#toggle-oscillator').on('click', function () {
    $('#oscilloscope').toggle()
  })
})
