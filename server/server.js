require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
var cors = require('cors')

var {mongoose} = require('./db/mongoose');
var {Trade} = require('./models/trade');

var app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

//Start of Trade Methods

//Add Method
app.post('/trades', (req, res) => {
  var trade = new Trade({
    tradeDate: req.body.tradeDate,
    commodity: req.body.commodity,
    side : req.body.side,
    quantity : req.body.quantity,
    price : req.body.price,
    counterParty : req.body.counterParty,
    location : req.body.location
  });

  trade.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET
app.get('/trades', (req, res) => {
  if(_.isEmpty(req.query)){
      Trade.find().then((trades) => {
      res.send({trades});
    }, (e) => {
      res.status(400).send(e);
    });
  }
  else{
    const searchTermJSON = JSON.parse(req.query.searchTerm);
    var term = _.pick(searchTermJSON, ['startDate', 'commodity','side','quantity','price','counterParty','location']);
    
    var date = new Date(term.startDate);
    year = date.getFullYear();
    month = date.getMonth()+1;
    dt = date.getDate();

    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }

    date = new Date(year+'-' + month + '-'+dt);
    //console.log(date);

    var createdTerm = {"tradeDate" : { "$gte": date }};
    createdTerm = term.commodity ? {...createdTerm, "commodity" : term.commodity} : createdTerm;
    //createdTerm = term.quantity ? {...createdTerm, "quantity" : term.quantity} : createdTerm;
    //createdTerm = term.price ? {...createdTerm, "price" : { "$gt": term.price }} : createdTerm;
    createdTerm = term.counterParty ? {...createdTerm, "counterParty" : term.counterParty} : createdTerm;
    createdTerm = term.location ? {...createdTerm, "location" : term.location} : createdTerm;
    createdTerm = (term.side && term.side.length > 0) ? {...createdTerm, "side" : { $in: term.side }} : createdTerm;

    console.log(createdTerm);
    Trade.find(createdTerm).then((trades) =>{
        res.send({trades});
    },(e) => {
        res.status(400).send(e);
    });
  }
}
);

//Delete
app.delete('/trades/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Trade.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

//Update
app.put('/trades/:id', (req, res) => {
  //console.log("Server patch Method");
  var id = req.params.id;
  var body = _.pick(req.body, ['tradeDate', 'commodity','side','quantity','price','counterParty','location']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  //console.log(id, body);

  Trade.findByIdAndUpdate(id, {$set: body}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    // console.log(todo);
    // res.send({todo});
    Trade.findById(id).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      console.log(todo);
      res.send({todo});
    });
  }).catch((e) => {
    res.status(400).send();
  })
});

//End Of Trade Methods

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});


app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
