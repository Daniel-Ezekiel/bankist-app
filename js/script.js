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

const labelWelcome = document.querySelector('.welcome-message');
const labelBalance = document.querySelector('.balance');
const labelDeposits = document.querySelector('.deposits');
const labelWithdrawals = document.querySelector('.withdrawals');
const labelInterest = document.querySelector('.interest');

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
const computeDisplayBalance = function (allTransactions) {
  const balance = allTransactions.reduce((acc, c) => acc + c, 0);
  labelBalance.textContent = `${balance} €`;
  return balance;
};
// computeDisplayBalance(account1.movements);

function displayTransactions(allTransactions) {
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
}
// displayTransactions(account1.movements);

const displaySummary = function (allTransactions) {
  const deposits = allTransactions
    .filter(trans => trans > 0)
    .reduce((acc, c) => acc + c, 0);
  labelDeposits.textContent = `${deposits} €`;

  const withdrawals = allTransactions
    .filter(trans => trans < 0)
    .reduce((acc, c) => acc + c, 0);
  labelWithdrawals.textContent = `${Math.abs(withdrawals)} €`;

  const interest = allTransactions
    .filter(trans => trans > 0)
    .map(deposit => deposit * 0.012)
    .filter(interest => interest >= 1)
    .reduce((acc, c) => acc + c, 0);
  labelInterest.textContent = `${interest} €`;

  console.log(deposits, withdrawals, interest);
};
// displaySummary(account1.movements);

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

/**********


***********************/
let loggedInUser;

// USER SIGN IN
btnSignin.addEventListener('click', function () {
  allTransactionsContainer.innerHTML = '';

  let username = document.querySelector('#username').value.trim().toLowerCase();
  let pin = Number(document.querySelector('#pin').value);

  let currentUser = accounts.find(
    account => account.username === username && account.pin === pin
  );
  loggedInUser = currentUser;

  if (currentUser) {
    labelWelcome.textContent = `Good day, ${currentUser.owner.split(' ')[0]}!`;
    computeDisplayBalance(currentUser.movements);
    displayTransactions(currentUser.movements);
    displaySummary(currentUser.movements);
    mainContainer.classList.add('active');
  } else {
    labelWelcome.textContent = `Enter correct login details`;
    mainContainer.classList.remove('active');
  }
});

// TRANSFER FUNDS
const btnTransfer = document.querySelector('#btn_transfer');
btnTransfer.addEventListener('click', function () {
  const recipientUsername = document
    .querySelector('#recipient')
    .value.toLowerCase();
  const recipientAmount = Number(
    document.querySelector('#transfer-amount').value
  );

  const recipientAcc = accounts.find(
    account => account.username === recipientUsername
  );

  const currentUserBalance = computeDisplayBalance(loggedInUser.movements);

  if (recipientAcc !== loggedInUser && recipientAmount < currentUserBalance) {
    recipientAcc.movements.push(recipientAmount);
    loggedInUser.movements.push(-recipientAmount);

    computeDisplayBalance(loggedInUser.movements);
    displayTransactions(loggedInUser.movements);
    displaySummary(loggedInUser.movements);
  }
});

// LOAN REQUEST
const btnLoan = document.querySelector('#btn_loan');
btnLoan.addEventListener('click', function () {
  const loanAmount = Number(document.querySelector('#loan-amount').value);
  console.log(loggedInUser);

  if (loanAmount) loggedInUser.movements.push(loanAmount);
  computeDisplayBalance(loggedInUser.movements);
  displayTransactions(loggedInUser.movements);
  displaySummary(loggedInUser.movements);
  console.log(loggedInUser);
});

// CLOSE ACCOUNT
const btnCloseAcc = document.querySelector('#btn_close-acc');
btnCloseAcc.addEventListener('click', function () {
  const usernameConfirm = document
    .querySelector('#username-confirm')
    .value.toLowerCase();
  const pinConfirm = Number(document.querySelector('#pin-confirm').value);

  const accToClose = accounts.findIndex(
    account =>
      account.username === usernameConfirm && account.pin === pinConfirm
  );

  accounts.splice(accToClose, 1);
  labelWelcome.textContent = 'Login to get started';
  mainContainer.classList.remove('active');
});
