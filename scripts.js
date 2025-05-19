const keys = document.querySelectorAll('.sound-key');
const checkboxes = document.querySelectorAll('input[type=checkbox]');
const secondHand = document.querySelector('.second-hand');
const minuteHand = document.querySelector('.minute-hand');
const hourHand = document.querySelector('.hour-hand');
const hands = document.querySelectorAll('.hand');
const inputs = document.querySelectorAll('.controls input');
const panelModal = document.querySelector('.gallery-modal');
const panels = document.querySelectorAll('.panel');
const panelClose = document.querySelector('.panel-close');
const videoClose = document.querySelector('.video-close');
const checklist = document.querySelector('.checklist');
const showGalleryBtn = document.querySelector('.show-gallery');
const showChecklistBtn = document.querySelector('.show-checklist');
const openControlsButton = document.querySelector('.open-controls');
const closeControlsButton = document.querySelector('.close-controls');
const controlsBox = document.querySelector('.controls');

let mouseIsDown = false;
let lastCheckboxTouched;

function handleCheck(e) {
  let inBetween = false;
  if (e.shiftKey && this.checked && lastCheckboxTouched !== undefined) {
    checkboxes.forEach(checkbox => {
      if (checkbox === this || checkbox === lastCheckboxTouched) {
        inBetween = !inBetween;
      }

      if (inBetween) {
        checkbox.checked = true;
      }
    });
  }

  lastCheckboxTouched = this;
}

function handlerColorPickerUpdate() {
  const type = this.dataset.value;
  if (type === 'color') {
    handleInputUpdate(this, type);
  }
}

function handleSliderUpdate(e) {
  if (mouseIsDown || e.type === 'click') {
    const type = this.dataset.value;
    handleInputUpdate(this, type);
  }
}

function handleInputUpdate(that, type) {
  const suffix = that.dataset.sizing || '';
  document.documentElement.style.setProperty(`--${that.name}`, that.value + suffix);

  updateCheckbox(type);
}

function handleInputMousePressed() {
  mouseIsDown = true;
}

function handleInputMouseReleased() {
  mouseIsDown = false;
}

function removeTransition (e) {
  if (e.propertyName !== 'transform') return;

  this.classList.remove('playing');
};

function setDate() {
  const now = new Date();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();
  const secondsDegrees = ((seconds / 60) * 360) + 90;
  const minutesDegrees = ((minutes / 60) * 360) + 90;
  const hoursDegrees = ((hours / 12) * 360) + 90;

  if (secondsDegrees > 440) {
    hands.forEach(hand => {
      hand.style.transition = 'none';
    });
  } else if (secondsDegrees === 90) {
    hands.forEach(hand => {
      hand.style.transition = `all 0.06s;`;
    });
  }

  secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
  minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;
  hourHand.style.transform = `rotate(${hoursDegrees}deg)`;
}

function toggleChecklist() {
  this.textContent = this.textContent === 'Show Checklist' ?
    'Hide Checklist' : 'Show Checklist';
  checklist.classList.toggle('content-hidden');
}

function toggleOpenPanel() {
  this.classList.toggle('open');
}

function toggleOpenActivePanel (e) {
  if (e.propertyName.includes('flex') ) {
    this.classList.toggle('open-active');
  }
}

function togglePanels() {
  panelModal.classList.toggle('content-hidden');

  updateCheckbox('gallery');
}

function closePanels() {
  panelModal.classList.add('content-hidden');

  updateCheckbox('gallery');
}

function updateCheckbox(type) {
  const checkbox = document.querySelector(`.item input[data-value="${type}"]`);
  if (!checkbox) return;
  checkbox.checked = true;
}

showChecklistBtn.addEventListener('click', toggleChecklist);
showGalleryBtn.addEventListener('click', togglePanels);
panelClose.addEventListener('click', togglePanels);

inputs.forEach(input => {
  input.addEventListener('change', handlerColorPickerUpdate);
  
  input.addEventListener('click', handleSliderUpdate);
  input.addEventListener('pointerover', handleSliderUpdate);
  input.addEventListener('input', handleSliderUpdate);
  input.addEventListener('pointerdown', handleInputMousePressed);
  input.addEventListener('pointerup', handleInputMouseReleased);
});

panels.forEach(panel => {
  panel.addEventListener('click', toggleOpenPanel);
  panel.addEventListener('transitionend', toggleOpenActivePanel);
});

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('click', handleCheck);
});

openControlsButton.addEventListener('pointerdown', () => {
  controlsBox.classList.remove('hidden');
  controlsBox.classList.add('flex');
  openControlsButton.classList.add('hidden');
});

closeControlsButton.addEventListener('pointerdown', () => {
  controlsBox.classList.remove('flex');
  controlsBox.classList.add('hidden');
  openControlsButton.classList.remove('hidden');
});

document.addEventListener('keydown', closePanels);

setInterval(setDate, 1000);
