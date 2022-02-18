/*
Author: Christophe DUFOUR
*/

// dépendances
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// instanciation express
const app = express()

// port
const port = 4000

// middleware
app.use(express.static('public'))
app.use(bodyParser.json())

// connection à mongodb
mongoose.connect('mongodb://localhost/nuvolapp', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, '[-] connection to mongdb NOT OK'))
db.once('open', () => console.log('[+] connection to mongodb OK'))

// schema, model
const Schema = mongoose.Schema
const expenseSchema = new Schema({
  date: Date, 
  amount: Number, 
  category: String, 
  payment: String
})
const Expense = mongoose.model('expense', expenseSchema)

// API
app.post('/expense', (req, res) => {
  let expense = new Expense(req.body)
  expense.save()
  .then(expense => {
    console.log('[+] POST /expense => success')
    return res.json(expense)
  } )
  .catch(err => {
    console.log('[-] POST /expense => failure');
    return res.json(err)
  })
})

app.get('/expense', (req, res) => {
  Expense.find({})
    .then(expenses => res.json(expenses))
    .catch(err => res.json(err))
})

app.put('/expense', (req, res) => {
  console.log(req.body);
  let expense = {
    date: req.body.date,
    amount: req.body.amount,
    category: req.body.category,
    payment: req.body.payment
  };
  Expense.findOneAndUpdate({_id:req.body._id}, expense)
    .then(result => res.json({message: 'ok'}))
    .catch(err => res.json({message: 'échec'}))
})

app.delete('/expense/:id', (req, res) => {
  Expense.findOneAndDelete({_id: req.params.id})
    .then(result => res.json({message: 'ok'}))
    .catch(err => res.json({message: 'échec'}))
})

app.listen(port, () => {
  console.log('[+] express webserver running on port ' + port + '...')
})
