'use strict'

// simple button to play a song
const playSound = function () {
  const jean = new Audio('../../../audio/nsync.mp3')
  if (jean.paused) {
    jean.currentTime = 0
    jean.play()
  } else {
    jean.pause()
  }
}

// set up audio context
const audioContext = new AudioContext()
// create oscillator node that will actually create the sound
const oscillator = audioContext.createOscillator()
// create analyser node to read audio information
const analyser = audioContext.createAnalyser()
// create distortion node that manipulates waveforms to change the sound
const distortion = audioContext.createWaveShaper()
// create gain node to control audio volume
const gainNode = audioContext.createGain()

// connect the signal chain oscillator -> gain -> analyser -> (destination)
oscillator.connect(distortion)
distortion.connect(gainNode)
gainNode.connect(analyser)

// set default gain value (volume)
gainNode.gain.value = 0.12
// start the oscillator
oscillator.start()

$(() => {
  // play the song when you click the button
  $('#test').on('click', playSound)
  // connect synthesizer to speakers/headphones
  $('#start').click(function () {
    analyser.connect(audioContext.destination)
  })
  // disconnect synthesizer from speakers/headphones
  $('#stop').click(function () {
    analyser.disconnect(audioContext.destination)
  })
  // change synth volume with user input
  $('#synth-volume').on('input', function () {
    gainNode.gain.value = this.value
  })
  // change synth frequency with user input
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

analyser.fftSize = 2048
const bufferLength = analyser.frequencyBinCount
const dataArray = new Uint8Array(bufferLength)
analyser.getByteTimeDomainData(dataArray)

// Get a canvas defined with ID "oscilloscope"
const canvas = document.getElementById("oscilloscope")
const canvasCtx = canvas.getContext("2d")

// draw an oscilloscope of the current audio source

function draw () {

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
