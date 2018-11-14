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

$(() => {
  $('#test').on('click', playSound)
  $('#start').click(function () {
    gainNode.connect(audioContext.destination)
  })
  $('#stop').click(function () {
    gainNode.disconnect(audioContext.destination)
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
})
