/*
Author: Christophe DUFOUR
*/

(function() {

  const urlServer = '/expense';

  // reférences au DOM
  const expenseForm = document.querySelector('#expenseForm');
  const date = expenseForm.querySelector('#date');
  const amount = expenseForm.querySelector('#amount');
  const category = expenseForm.querySelector('#category');
  const payment = expenseForm.querySelector('#payment');
  const submit = expenseForm.querySelector('#submit');
  const btnReset = expenseForm.querySelector('#reset');
  const tableExpenses = document.querySelector('#tableExpenses');
  
  let expenses = null; // tableau des dépenses initialisé à null
  let editedExpense = null; // aucune dépense en cours d'édition

  expenseForm.addEventListener('submit', function(e) {
    e.preventDefault(); // bloque la requête http standard
    let expense = {
      date: date.value,
      amount: amount.value,
      category: category.value,
      payment: payment.value,
    };

    saveExpense(expense);
  })

  btnReset.addEventListener('click', reset);

  function saveExpense(expense) {
    let method = '';
    if (editedExpense) {
      method = 'put';
      expense._id = editedExpense; // ajout de la clé _id pour la mise à jour
    } else {
      method = 'post'
    }

    console.log(expense);
    // ajax POST ou PUT
    fetch(urlServer, {
      headers: {
        'Content-Type':'application/json',
        'Accept':'application/json'
      },
      method,
      body: JSON.stringify(expense)
    })
    .then(res => res.json())
    .then(res => getExpenses())
  }

  function getExpenses() {
    fetch(urlServer)
      .then(res => res.json())
      .then(res => {
        expenses = res;
        updateDom();
      })
  }

  function updateDom() {
    let html = '';

    expenses.forEach(expense => {
      html += `
        <tr>
          <td>${expense.date}</td>
          <td>${expense.amount}</td>
          <td>${expense.category}</td>
          <td>${expense.payment}</td>
          <td>
            <button data-id="${expense._id}" class="edit btn btn-secondary btn-sm">Modifier</button>
            <button data-id="${expense._id}" class="delete btn btn-danger btn-sm">Supprimer</button>
          </td>
        </tr>`;
    }) // fin forEach

    tableExpenses.innerHTML = html;

    // ajout d'un écouteur click sur les boutons edit
    tableExpenses.querySelectorAll('.edit').forEach(btn => {
      btn.addEventListener('click', function(e) {
        let expense =
          expenses.filter(exp => exp._id == this.dataset.id)[0];
        populateForm(expense);
      })
    })

    // ajout d'un écouteur click sur les boutons delete
    tableExpenses.querySelectorAll('.delete').forEach(btn => {
      btn.addEventListener('click', function(e) {
          deleteExpense(this.dataset.id);
      })
    })

  } // fin updateDom

  function deleteExpense(id) {
    fetch(urlServer + '/' + id, {method: 'delete'})
      .then(res => res.json())
      .then(res => getExpenses())
  }

  function populateForm(expense) {
    editedExpense = expense._id;

    // "2018-10-04T00:00:00.000Z" => "yyyy-MM-dd".
    date.value = expense.date.substr(0,10);
    amount.value = expense.amount;
    category.value = expense.category;
    payment.value = expense.payment;
    submit.value = 'Mettre à jour';
  }

  function reset() {
    editedExpense = null;
    date.value = '';
    amount.value = '';
    category.value = 'Cinema';
    payment.value = 'Cash';
    submit.value = 'Ajouter';
  }

  function init() {
    getExpenses();
  }

  init();

})()
