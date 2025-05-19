/** Get Elements */
const player = document.querySelector('.player');
const video = player.querySelector('.player__video');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.player__button');
const skipButtons = player.querySelectorAll('[data-skip]');
const fullscreenButton = player.querySelector('.fullscreen');
const ranges = player.querySelectorAll('.player__slider');
const showVideoBtn = document.querySelector('.show-video');
const videoModal = document.querySelector('.video-modal');
const videoPlayerBackground = document.querySelector('.video-player-background');

let canPlayVideo = false;
let mouseDownOnRange = false;
let mouseDownOnProgress = false;

/** Build Functions */

function handleProgress() {
  const percentagePlayed = (video.currentTime / video.duration) * 100;

  progressBar.style.flexBasis = `${percentagePlayed}%`;
}

function handleRangeUpdate() {
  video[this.name] = this.value;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;

  video.currentTime = scrubTime;
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function toggleButtonText() {
  toggle.textContent = this.paused ? '►' : '❚ ❚';
}

function toggleFullscreen() {
  if (!video.fullscreenEnabled) {
    video.requestFullscreen();
  } else {
    video.exitFullscreen();
  }
}

function togglePlay() {
  if (!canPlayVideo) return;

  const method = video.paused ? 'play' : 'pause';

  if (method === 'play') {
    updateCheckbox('video');
  }

  video[method]();
}

function closeVideoModal() {
  videoModal.classList.add('content-hidden');

  if (!video.paused) {
    video.currentTime = 0;
    togglePlay();
  }
}

function toggleVideoModal() {
  videoModal.classList.toggle('content-hidden');

  if (!video.paused) {
    video.currentTime = 0;
    togglePlay();
  }
}

/** Hook Up Event Listenrs */
video.addEventListener('canplay', (e) => {
  canPlayVideo = true;
});
video.addEventListener('play', toggleButtonText);
video.addEventListener('pause', toggleButtonText);
video.addEventListener('click', togglePlay);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);

fullscreenButton.addEventListener('click', toggleFullscreen);

skipButtons.forEach(skipBtn => {
  skipBtn.addEventListener('click', skip);
});

ranges.forEach(range => {
  range.addEventListener('change', handleRangeUpdate);
  range.addEventListener('mousemove', (e) => mouseDownOnProgress && handleRangeUpdate(e));
  range.addEventListener('mousedown', () => mouseDownOnRange = true);
  range.addEventListener('mouseup', () => mouseDownOnRange = false);
});

progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mouseDownOnProgress && scrub(e));
progress.addEventListener('mousedown', () => mouseDownOnProgress = true);
progress.addEventListener('mouseup', () => mouseDownOnProgress = false);

showVideoBtn.addEventListener('click', toggleVideoModal);

videoPlayerBackground.addEventListener('click', toggleVideoModal);
videoClose.addEventListener('click', toggleVideoModal);
document.addEventListener('keydown', closeVideoModal);
