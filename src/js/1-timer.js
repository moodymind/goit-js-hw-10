import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('[data-start]');
const datePicker = document.querySelector('#datetime-picker');
const timerFields = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
let countdownInterval = null;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate <= Date.now()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
    } else {
      startBtn.disabled = false;
    }
  },
};

startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;
  startBtn.disabled = true;
  datePicker.disabled = true;
  startCountdown();
});

function startCountdown() {
  countdownInterval = setInterval(() => {
    const timeNow = new Date();

    const timeDifference = userSelectedDate - timeNow;

    if (timeDifference <= 0) {
      clearInterval(countdownInterval);
      updateTimerFields(0, 0, 0, 0);
      datePicker.disabled = false;
      return;
    }
    const timeLeft = convertMs(timeDifference);
    updateTimerFields(
      timeLeft.days,
      timeLeft.hours,
      timeLeft.minutes,
      timeLeft.seconds
    );
  }, 1000);
}

function updateTimerFields(days, hours, minutes, seconds) {
  timerFields.days.textContent = addLeadingZero(days);
  timerFields.hours.textContent = addLeadingZero(hours);
  timerFields.minutes.textContent = addLeadingZero(minutes);
  timerFields.seconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

flatpickr(datePicker, options);
