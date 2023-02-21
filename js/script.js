'use strict';
// BANKIST APP

// DOM ELEMENTS
const btnSignin = document.querySelector('#btn__signin');
const mainContainer = document.querySelector('main');
const allTransactionsContainer = document.querySelector(
  '#customer-transactions-container'
);

const btnTransfer = document.querySelector('#btn_transfer');
const btnLoan = document.querySelector('#btn_loan');
const btnCloseAcc = document.querySelector('#btn_close-acc');
const btnSort = document.querySelector('#btn__sort');

const labelWelcome = document.querySelector('.welcome-message');
const labelDate = document.querySelector('.login-date');
const labelBalance = document.querySelector('.balance');
const labelDeposits = document.querySelector('.deposits');
const labelWithdrawals = document.querySelector('.withdrawals');
const labelInterest = document.querySelector('.interest');

const usernameLogin = document.querySelector('#username');
const pinLogin = document.querySelector('#pin');
const recipientUsername = document.querySelector('#recipient');
const recipientAmount = document.querySelector('#transfer-amount');
const loanAmount = document.querySelector('#loan-amount');
const usernameConfirm = document.querySelector('#username-confirm');
const pinConfirm = document.querySelector('#pin-confirm');

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
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
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2020-11-01T13:15:33.035Z',
    '2020-11-30T09:48:16.867Z',
    '2020-12-25T06:04:23.907Z',
    '2021-01-25T14:18:46.235Z',
    '2021-02-05T16:33:06.386Z',
    '2022-04-10T14:43:26.374Z',
    '2022-06-25T18:49:59.371Z',
    '2022-07-26T12:01:20.894Z',
  ],
  currency: 'GBP',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2018-11-18T21:31:17.178Z',
    '2018-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const accounts = [account1, account2, account3, account4];

/***************************************/
//Compute and Display balance
const computeDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, c) => acc + c, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} €`;

  const now = new Date();
  const day = `${now.getDate()}`.padStart(2, 0);
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const year = now.getFullYear();
  const hour = now.getHours();
  const minute = now.getMinutes();

  labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;
};
//  Compute and Display all Transactions
const displayTransactions = function (acc, sort = false) {
  const allTrans = sort
    ? acc.movements.slice().sort((a, z) => a - z)
    : acc.movements;

  const transDates = acc.movementsDates;

  allTrans.forEach((trans, i) => {
    const transactionType = trans > 0 ? 'deposit' : 'withdrawal';

    const transDate = new Date(transDates[i]);
    const day = `${transDate.getDate()}`.padStart(2, 0);
    const month = `${transDate.getMonth() + 1}`.padStart(2, 0);
    const year = transDate.getFullYear();
    const dateToDisplay = `${day}/${month}/${year}`;

    const transactionHTML = `
    <div class='transaction'>
      <div>
        <span class='transaction-type ${transactionType}'>${
      i + 1
    } ${transactionType}
        </span>
        <span class='date'>${dateToDisplay}</span>
      </div>
      <span class='transaction-amount'>${trans.toFixed(2)} €</span>
    </div>
    `;

    allTransactionsContainer.insertAdjacentHTML('afterbegin', transactionHTML);
  });
};
// Compute and Display account summary
const displaySummary = function (acc) {
  const deposits = acc.movements
    .filter(trans => trans > 0)
    .reduce((acc, c) => acc + c, 0);
  labelDeposits.textContent = `${deposits.toFixed(2)} €`;

  const withdrawals = acc.movements
    .filter(trans => trans < 0)
    .reduce((acc, c) => acc + c, 0);
  labelWithdrawals.textContent = `${Math.abs(withdrawals).toFixed(2)} €`;

  const interest = acc.movements
    .filter(trans => trans > 0)
    .map(deposit => deposit * (acc.interestRate / 100))
    .filter(interest => interest >= 1)
    .reduce((acc, c) => acc + c, 0);
  labelInterest.textContent = `${interest.toFixed(2)} €`;
};

const updateUI = function (acc) {
  allTransactionsContainer.innerHTML = '';

  computeDisplayBalance(acc);
  displayTransactions(acc);
  displaySummary(acc);
};

// Create account username
const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

/************************/
let currentUser = account1;
updateUI(currentUser);
mainContainer.classList.add('active');

// USER SIGN IN
btnSignin.addEventListener('click', function (e) {
  e.preventDefault();

  let username = usernameLogin.value.toLowerCase().trim();
  let pin = +pinLogin.value;

  currentUser = accounts.find(account => account.username === username);
  console.log(currentUser);

  if (currentUser?.pin === pin) {
    labelWelcome.textContent = `Good day, ${currentUser.owner.split(' ')[0]}!`;

    updateUI(currentUser);
    mainContainer.classList.add('active');
  } else {
    labelWelcome.textContent = `Enter correct login details`;
    mainContainer.classList.remove('active');
  }

  // Clear form fields
  usernameLogin.value = pinLogin.value = '';
  pinLogin.blur();
});

// TRANSFER FUNDS
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const recipientAcc = accounts.find(
    account => account.username === recipientUsername.value.toLowerCase()
  );

  const recipientAmt = +recipientAmount.value;
  if (
    recipientAmt &&
    recipientAcc !== currentUser &&
    recipientAmt <= currentUser.balance
  ) {
    recipientAcc.movements.push(recipientAmt);
    recipientAcc.movementsDates.push(new Date().toISOString());
    currentUser.movements.push(-recipientAmt);
    currentUser.movementsDates.push(new Date().toISOString());

    updateUI(currentUser);
  }

  // Clear form fields
  recipientUsername.value = recipientAmount.value = '';
  recipientAmount.blur();
});

// LOAN REQUEST
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmt = Math.floor(+loanAmount.value);
  console.log(currentUser);

  const userLoanStatus = currentUser.movements.some(
    amt => amt >= loanAmt * 0.1
  );
  if (loanAmt && userLoanStatus) {
    currentUser.movements.push(loanAmt);
    currentUser.movementsDates.push(new Date().toISOString());
  }
  updateUI(currentUser);

  loanAmount.value = '';
  loanAmount.blur();
});

// CLOSE ACCOUNT
btnCloseAcc.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentUser.username === usernameConfirm.value.toLowerCase() &&
    currentUser.pin === +pinConfirm.value
  ) {
    const accToClose = accounts.indexOf(currentUser);
    accounts.splice(accToClose, 1);
    labelWelcome.textContent = 'Login to get started';
    mainContainer.classList.remove('active');
  }

  // Clear form fields
  usernameConfirm.value = pinConfirm.value = '';
  pinConfirm.blur();
});

// SORT TRANSACTIONS
let sorted = false;
btnSort.addEventListener('click', function () {
  allTransactionsContainer.innerHTML = '';

  displayTransactions(currentUser, !sorted);
  sorted = !sorted;
});
