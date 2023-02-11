'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

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
const allTransactionsContainer = document.querySelector(
  '#customer-transactions-container'
);

const mainContainer = document.querySelector('main');
const btnSignin = document.querySelector('#btn__signin');

// USER SIGN IN
btnSignin.addEventListener('click', function () {
  allTransactionsContainer.innerHTML = '';

  const usernameInput = document.querySelector('#username');
  const userPinInput = document.querySelector('#pin');

  let username = usernameInput.value;
  let pin = userPinInput.value;

  username.toLowerCase() === 'js' &&
    Number(pin) === 1111 &&
    mainContainer.classList.add('active');

  displayTransactions(account1.movements);
});

function displayTransactions(allTransactions) {
  allTransactions.forEach((trans, i) => {
    const transactionType = trans > 0 ? 'deposit' : 'withdrawal';

    const transactionHTML = `
      <div class='transaction'>
        <div>
          <span class='transaction-type ${transactionType}'>${
      i + 1
    } ${transactionType}</span>
          <span class='date'>12/03/2020</span>
        </div>
        <span class='transaction-amount'>${trans}</span>
      </div>
    `;

    allTransactionsContainer.insertAdjacentHTML('afterbegin', transactionHTML);
  });
}
