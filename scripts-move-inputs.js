const allAudio = document.querySelectorAll('audio');
const inputTitle = document.querySelector('.move-buttons__title');
const moveInputButtons = document.querySelectorAll('.input-button');

const pressed = [];
const ryu = {
  'hadouken': {
    'keys': 'ArrowDownArrowDownArrowRightArrowRightp',
    'keysAlt': 'ArrowDownArrowRightArrowDownArrowRightp',
    'buttons': 'ArrowDownArrowDownDiagRightArrowRightp',
    'pressed': []
   },
  'tatsu': {
    'keys': 'ArrowDownArrowDownArrowLeftArrowLeftk',
    'keysAlt': 'ArrowDownArrowLeftArrowDownArrowLeftk',
    'buttons': 'ArrowDownArrowDownDiagLeftArrowLeftk',
    'pressed': []
  },
  'shoryuken': {
    'keys': 'ArrowRightArrowDownArrowRightArrowDownp',
    'keysAlt': 'ArrowRightArrowDownArrowDownArrowRightp',
    'buttons': 'ArrowRightArrowDownArrowDownDiagRightp',
    'pressed': []
  }
};

function checkButtonPress() {
  checkMove(this.dataset.input);
}

function checkMove(input) {
  const movesList = Object.keys(ryu);

  movesList.forEach(move => {
    ryu[move].pressed.push(input);
    ryu[move].pressed.splice(-ryu[move].keys.length - 1, ryu[move].length - ryu[move].keys.length);

    const keyCheck = (ryu[move].pressed.join('').includes(ryu[move].keys) || 
      ryu[move].pressed.join('').includes(ryu[move].keysAlt));

    const buttonCheck = ryu[move].pressed.join('').includes(ryu[move].buttons);

    if (keyCheck || buttonCheck) {
      inputTitle.textContent = 'Success!!!';
      setTimeout(() => inputTitle.textContent = 'Inputs', 1000);
      playSound(move);
    }
  });
}

function handleMoveInput(e) {
  checkMove(e.key);
}

function clearMoveKeyPresses() {
  const movesList = Object.keys(ryu);
  movesList.forEach(move => {
    ryu[move].pressed.length = 0;
  });
}

function debounce(func, wait = 5, immediate = true) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function playSound (move) {
  const audio = document.querySelector(`audio[data-move="${move}"]`);
  const key = document.querySelector(`.sound-key[data-move="${move}"]`);
  if (!audio) return;

  audio.currentTime = 0;
  audio.play();
  key.classList.add('playing');
  updateCheckbox(move);
  clearMoveKeyPresses();
}

window.addEventListener('keyup', debounce(handleMoveInput));

keys.forEach(key => {
  key.addEventListener('transitionend', removeTransition);
});

moveInputButtons.forEach(moveInput => {
  moveInput.addEventListener('pointerdown', checkButtonPress);
});
