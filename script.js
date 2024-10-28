'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2024-02-01T10:17:24.185Z',
    '2024-03-08T14:11:59.604Z',
    '2024-03-15T14:43:26.374Z',
    '2024-04-17T18:49:59.371Z',
    '2024-05-24T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2024-01-01T13:15:33.035Z',
    '2024-02-30T09:48:16.867Z',
    '2024-03-25T06:04:23.907Z',
    '2024-04-25T14:18:46.235Z',
    '2024-05-05T16:33:06.386Z',
    '2024-05-15T14:43:26.374Z',
    '2024-06-17T18:49:59.371Z',
    '2024-06-21T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90, -20],
  interestRate: 1,
  pin: 3333,

  movementsDates: [
    '2023-03-04T13:15:33.035Z',
    '2023-05-11T09:48:16.867Z',
    '2023-06-23T06:04:23.907Z',
    '2023-11-26T14:18:46.235Z',
    '2023-12-07T16:33:06.386Z',
    '2024-01-23T14:43:26.374Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Steven Thomas Williams',
  movements: [2000, -200.9, 340.33, -300, -20.28, 50, 400, -460],
  interestRate: 0.7,
  pin: 4444,

  movementsDates: [
    '2022-11-21T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2022-12-29T06:04:23.907Z',
    '2023-01-23T14:18:46.235Z',
    '2024-03-05T16:33:06.386Z',
    '2024-04-15T14:43:26.374Z',
    '2024-04-17T18:49:59.371Z',
    '2024-08-21T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${month}/${day}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  // console.log(acc.movements);
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}
        </div> <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    // Decrease 1s
    time--;
  };
  // Set time to 5 minutes
  let time = 300;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${month}/${day}/${year}, ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.acc, !sorted); // DOUBLE CHECK THIS
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*


console.log(23 === 23.0);

// Base 10 - 0 to 9. 1/10 = 0.1. 3/10 = 3.33333333
// Binary base 2 - 0 to 1.

console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);

// Conversion
console.log(Number('23')); // These equal eachother
console.log(+'23');

// Parsing
console.log(Number.parseInt('30px', 10)); // This works because it begins with a number
console.log(Number.parseInt('e23', 10)); // This doesn't work because it doesn't

console.log(Number.parseInt('   2.5rem   '))
console.log(Number.parseFloat('   2.5rem   '))

// These are global variables, so they don't need to be called on Number (but they should)
console.log(parseFloat('   2.5rem   '))

// This is the worse option for checking if a value is a number
console.log(Number.isNaN(20))
console.log(Number.isNaN('20'))
console.log(Number.isNaN(+'20X'))
console.log(Number.isNaN(23/0)) // This is the problem with isNaN

// Checking if value is a number
console.log(Number.isFinite(20))
console.log(Number.isFinite('20'))
console.log(Number.isFinite(+'20X'))
console.log(Number.isFinite(23/0))

console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23 / 0));



console.log(Math.sqrt(25));
console.log(25 ** (1 / 2)); // Same as finding the roots
console.log(8 ** (1 / 3));

console.log(Math.max(5, 18, 23, 11, 2));
console.log(Math.max(5, 18, '23', 11, 2)); // Does type conversion
console.log(Math.max(5, 18, '23px', 11, 2)); // NaN -- Doesn't do parsing

console.log(Math.min(5, 18, 23, 11, 2));

console.log(Math.PI * Number.parseFloat('10px') ** 2);

console.log(Math.trunc(Math.random() * 6 + 1)); // Dice roll

const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + 1);
// 0....1 -> 0...(max - min) -> min...(max - min + min)) -> min...max
// console.log(randomInt(10, 20));

// Rounding integers

console.log(Math.round(23.3));
console.log(Math.round(23.9));

console.log(Math.ceil(23.3)); // always rounds up
console.log(Math.ceil(23.9));

console.log(Math.floor(23.3)); // always rounds down
console.log(Math.floor('23.9')); // they all do type conversion

console.log(Math.trunc(23.3)); // removes decimal but always rounds down
console.log(Math.trunc(23.9)); // similar to Math.floor but doesn't work for negatives

console.log(Math.trunc(-23.3)); // simply gets rid of decimal
console.log(Math.floor(-23.3)); // rounds negative numbers correctly

// Rounding decimals
console.log((2.7).toFixed(0)); // .toFixed always returns a string
console.log((2.7).toFixed(3)); // 3 decimal points
console.log((2.345).toFixed(2)); // 2 decimal points
console.log(+(2.345).toFixed(2)); // 2 decimal points, converted to a number



console.log(5 % 2); // remainder, = 1
console.log(5 / 2);

console.log(8 % 3);
console.log(8 / 3);

console.log(6 % 2);

// const isEven = x => {
//   if ((x % 2) == 0) {
//     return console.log('It is even');
//   } else return console.log("it's not even");
// };

// isEven(1)

const isEven = n => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(23));
console.log(isEven(514));

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});


// Numeric Separators

// 287,460,000,000
const diameter = 287_460_000_000 // We can use the underscore as numeric separator
console.log(diameter)


const price = 345_99
console.log(price)

const transferFee1 = 15_00;
const transferFee2 = 1_500;
console.log(transferFee1, transferFee2)

// const PI = 3._1415 // You can't use underscore next to non-numbers. Must be between
// console.log(PI)

console.log(Number('230_000')) // does not work. Has to be a number



console.log(2 ** 53 - 1)
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 1)
console.log(2 ** 53 + 2)
console.log(2 ** 53 + 3)
console.log(2 ** 53 + 4)

console.log(48384838483828482838483828483848284n) // transforms into a "big int" number
console.log(BigInt(48384838483828482838483828483848284)) // not as accurate

// Operations
console.log(10000n + 10000n)
console.log(234590750392487532047823904n * 10000000n)
// console.log(Math.sqrt(16n)); // This does not work with BigInts

const huge = 229345023857903274903248n;
const num = 23;
// console.log(huge * num) // can't mix bigInt number and regular numbers
console.log(huge * BigInt(num)) // this works though

console.log(20n > 15); // This works
console.log(20n === 20); // false
console.log(typeof 20n); // returns "bigint"
console.log(20n == '20'); // uses type conversion, so this works

console.log(huge + ' is REALLY big!!!') // converts number to string

// Divisions
console.log(11n / 3n); // cuts off the decimal
console.log(11 / 3);



// Create a date
const now = new Date();
console.log(now)

console.log(new Date('Jan 20 2024 17:09:47'));
console.log(new Date('December 24, 2015'));
console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2037, 10, 19, 15, 23, 5))
console.log(new Date(2037, 10, 31))

console.log(new Date(0)) // unix initial time
console.log(new Date(3 * 24 * 60 * 60 * 1000)) // 3 days after initial unix time



// Working with dates
const future = new Date(2037, 10, 19, 15, 23)
console.log(future);
console.log(future.getFullYear())
console.log(future.getMonth())
console.log(future.getDate()) // day of the month
console.log(future.getDay()) // day of the week
console.log(future.getHours()) 
console.log(future.getMinutes()) 
console.log(future.getSeconds()) 
console.log(future.toISOString()) 

console.log(new Date(21422569800000))

console.log(Date.now());
console.log(future)



// Calculating days between two dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(+future);
const calcDaysPassed = (date1, date2) =>
  Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24)); // abs value so we don't have negative numbers

const days1 = calcDaysPassed(
  new Date(2037, 3, 4),
  new Date(2037, 3, 14, 10, 8)
);
console.log(days1);

// Internationalizing Numbers

const num = 3884764.23;

const options = {
  style: 'currency',
  unit: 'celsius',
  currency: 'EUR',
  // useGrouping: false,
};

console.log('US: ', new Intl.NumberFormat('en-us', options).format(num));
console.log('Germany: ', new Intl.NumberFormat('de-DE', options).format(num));
console.log('Syria: ', new Intl.NumberFormat('ar-SY', options).format(num));
console.log(
  'Browser: ',
  new Intl.NumberFormat(navigator.language, options).format(num)
);



// setTimeout
const ingredients = ['olives', 'spinach']
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`),
  3000,
  ...ingredients
);
console.log('Waiting...');

if(ingredients.includes('spinach')) clearTimeout(pizzaTimer)

// setInterval
setInterval(function () {
  const now = new Date();
  console.log(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`)
}, 1000);

*/
