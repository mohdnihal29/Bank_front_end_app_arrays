'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Nihal Mohammed',
  movements: [2500.2, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-02-25T17:01:17.194Z',
    '2021-03-01T23:36:17.929Z',
    '2021-03-06T10:51:36.790Z',
  ],
  currency: 'AUD',
  locale: 'en-AU', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-05-08T14:11:59.604Z',
    '2021-02-25T14:43:26.374Z',
    '2021-03-05T18:49:59.371Z',
    '2021-03-06T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
// const labelTimer = ;

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

// functions

//date function
const formatDates = function (date, acc) {
  const calcDaysPassed = function (date1, date2) {
    return Math.abs(date2 - date1) / (24 * 60 * 60 * 1000);
  };
  const daysPassed = Math.round(calcDaysPassed(new Date(), date));
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'yesterday';
  if (daysPassed < 7) return 'this week';
  if (daysPassed < 30) return `${daysPassed} days ago`;

  // const year = date.getFullYear();
  // const month = `${date.getMonth() + 1}`.padStart(2, '0');
  // const day = `${date.getDate()}`.padStart(2, '0');
  // return `${day}/${month}/${year}`;

  return new Intl.DateTimeFormat(acc.locale).format(date);
};

const intlCurrency = function (value, locale, currency) {
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const mov = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  mov.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    console.log(acc.movementsDates[i]);

    const arrayDates = new Date(acc.movementsDates[i]);
    const finalDates = formatDates(arrayDates, currentAccount);

    const movIntl = intlCurrency(Math.abs(mov), acc.locale, acc.currency);

    const html = `
  <div class="movements__row">
    <div class="movements__type movements__type--${type}"> ${
      i + 1
    } ${type}</div>
    <div class="movements__date">${finalDates}</div>
    <div class="movements__value">${movIntl}</div>
  </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov);
  labelBalance.textContent = `${intlCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  )} `;
};

const calcDisplaySummary = function (account) {
  const income = account.movements
    .filter(el => el > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${intlCurrency(
    income,
    account.locale,
    account.currency
  )} `;
  const out = account.movements
    .filter(el => el < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${intlCurrency(
    Math.abs(out),
    account.locale,
    account.currency
  )} `;
  const interest = account.movements
    .filter(el => el > 0)
    .map(el => (el * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int);
  labelSumInterest.textContent = `${intlCurrency(
    interest,
    account.locale,
    account.currency
  )} `;
};

const createUsername = function (accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsername(accounts);
console.log(accounts);

const updateUI = function (acc) {
  // display movements
  displayMovements(acc);

  // display balance
  calcDisplayBalance(acc);

  // display summary
  calcDisplaySummary(acc);
};

// Event Handlers
let currentAccount;

// fake login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  // show UI and display balance
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();

    //Show Date
    const now = new Date();
    // const year = now.getFullYear();
    // const month = `${now.getMonth() + 1}`.padStart(2, '0');
    // const day = `${now.getDate()}`.padStart(2, '0');
    // const hour = `${now.getHours()}`.padStart(2, '0');
    // const minutes = `${now.getMinutes()}`.padStart(2, '0');
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    //update UI

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const account = accounts.find(acc => acc.username === inputTransferTo.value);
  console.log(amount, account, currentAccount);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    account.username &&
    currentAccount.balance >= amount &&
    currentAccount.username !== inputTransferTo.value
  ) {
    account.movements.push(amount);
    currentAccount.movements.push(-amount);

    // add to the Dates array
    currentAccount.movementsDates.push(new Date().toISOString());
    account.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('loan');
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    // Add to date array
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const index = accounts.findIndex(
    acc => acc.username === currentAccount.username
  );
  console.log(index);
  console.log(currentAccount.username, currentAccount.pin);
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;

    labelWelcome.textContent = `Log in to get started`;
    console.log('account closed');
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(currentAccount);
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
