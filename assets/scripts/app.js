'use strict'

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')

const playSound = function () {
  const jean = new Audio('../../../audio/jean.mp3')
  if (jean.paused) {
    jean.currentTime = 0
    jean.play()
  } else {
    jean.pause()
  }
}

$(() => {
  $('#test').on('click', playSound)
})
