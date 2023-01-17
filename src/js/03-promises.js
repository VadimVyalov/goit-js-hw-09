import { Notify } from 'notiflix/build/notiflix-notify-aio';

const promiseForm = document.querySelector('.form');

const createPromise = (position, delay) => {
  const shouldResolve = Math.random() > 0.3;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
};

const onResolve = ({ position, delay }) => {
  Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
};

const onRejected = ({ position, delay }) => {
  Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
};

const callPromice = evt => {
  evt.preventDefault();
  let { delay, step, amount } = Object.fromEntries(
    new FormData(evt.currentTarget)
  );

  if (!amount || !step || !delay) {
    Notify.failure(`❌ Заповніть поля`);
    return;
  }
  amount = Number(amount);
  step = Number(step);
  delay = Number(delay);

  for (let i = 0; i < amount; i++) {
    createPromise(i + 1, delay + step * i)
      .then(onResolve)
      .catch(onRejected);
  }
};

promiseForm.addEventListener('submit', callPromice);
