'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
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
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
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

/***************************************/
//Compute and Display balance
const computeDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, c) => acc + c, 0);
  labelBalance.textContent = `${acc.balance} €`;
  // return balance;
};
//  Compute and Display all Transactions
const displayTransactions = function (allTransactions) {
  allTransactions.forEach((trans, i) => {
    const transactionType = trans > 0 ? 'deposit' : 'withdrawal';

    const transactionHTML = `
    <div class='transaction'>
      <div>
        <span class='transaction-type ${transactionType}'>${
      i + 1
    } ${transactionType}
        </span>
        <span class='date'>12/03/2020</span>
      </div>
      <span class='transaction-amount'>${trans} €</span>
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
  labelDeposits.textContent = `${deposits} €`;

  const withdrawals = acc.movements
    .filter(trans => trans < 0)
    .reduce((acc, c) => acc + c, 0);
  labelWithdrawals.textContent = `${Math.abs(withdrawals)} €`;

  const interest = acc.movements
    .filter(trans => trans > 0)
    .map(deposit => deposit * (acc.interestRate / 100))
    .filter(interest => interest >= 1)
    .reduce((acc, c) => acc + c, 0);
  labelInterest.textContent = `${interest} €`;
};

const updateUI = function (acc) {
  computeDisplayBalance(acc);
  displayTransactions(acc.movements);
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
let currentUser;

// USER SIGN IN
btnSignin.addEventListener('click', function (e) {
  e.preventDefault();
  allTransactionsContainer.innerHTML = '';

  let username = usernameLogin.value.toLowerCase().trim();
  let pin = Number(pinLogin.value);

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

  const recipientAmt = Number(recipientAmount.value);
  if (
    recipientAmt &&
    recipientAcc !== currentUser &&
    recipientAmt <= currentUser.balance
  ) {
    recipientAcc.movements.push(recipientAmt);
    currentUser.movements.push(-recipientAmt);

    updateUI(currentUser);
  }

  // Clear form fields
  recipientUsername.value = recipientAmount.value = '';
  recipientAmount.blur();
});

// LOAN REQUEST
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmt = Number(loanAmount.value);
  console.log(currentUser);

  if (loanAmt) currentUser.movements.push(loanAmt);
  updateUI(currentUser);

  loanAmount.value = '';
  loanAmount.blur();
});

// CLOSE ACCOUNT
btnCloseAcc.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentUser.username === usernameConfirm.value.toLowerCase() &&
    currentUser.pin === Number(pinConfirm.value)
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

  const transactionsCopy = currentUser.movements.slice();
  if (!sorted) {
    displayTransactions(transactionsCopy.sort((a, z) => a - z));
    sorted = true;
  } else {
    displayTransactions(currentUser.movements);
    sorted = false;
  }
});
