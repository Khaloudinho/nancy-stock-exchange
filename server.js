var express = require('express'); // for routes management
var mongoose = require('mongoose'); // to communicate with MongoDB
var bodyParser = require('body-parser'); // (un)serialize JSON
var cors = require('cors'); // to avoid cors errors, provide good working of app
var cron = require('node-cron'); // cron to make the wallet chart
const YahooFinanceAPI = require('yahoo-finance-data'); // speak with API

var app = express();
app.use(bodyParser.json());
app.use(express.static('./public'));
app.use(cors());

mongoose.connect('mongodb://localhost:27017/nancy-stock-exchange');

var Schema = mongoose.Schema;
var stockSchema = new Schema({
  name: String,
  symbol: String,
  price: Number,
  current_price: Number,
  qte: Number
});

var walletSchema = new Schema({
    date: Date,
    value: String
});

var Stock = mongoose.model('Stock', stockSchema);
var Wallet = mongoose.model('Wallet', walletSchema);

// authentication credentials on Yahoo finance API
const api = new YahooFinanceAPI({
    key: 'dj0yJmk9elhoUFpNbG93c1Q2JmQ9WVdrOWR6RmlWRTVzTjJzbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1iOQ--',
    secret: 'd94626eedcb110d30babf6e3c115e6b07edbd879'
});

app.get('/stocks', function (req, res) {
    api.getRealtimeQuotes(req.query.toolbar).then(value => res.send(value["query"]["results"]))
});

app.post('/stocks', function (req) {
    Stock.findOneAndUpdate(
        { symbol: req.body.code, name: req.body.name, price: req.body.price, current_price: req.body.price},
        { $inc: { qte: 1 }}, // new values you want to set
        { upsert: true, 'new': true})
        .exec();
});

app.get('/wallet', function (req, res) {
    Stock.find().exec(function(err, stocks) {
        res.send(stocks);
    });
});

//graph wallet evolution
app.get('/wallet-graph', function (req, res) {
    Wallet.find().where("value").ne("NaN").exec(function(err, wallets) {
        res.send(wallets);
    });
});

function getWalletAmount(stocks) {
    var sum = 0;

    for (var i = 0; i < stocks.length; i++) {
        var quantity = parseInt(stocks[i].qte, 10);
        sum += parseInt(stocks[i].current_price, 10) * quantity;
    }

    return sum;
}

// Each day wallet is save in order to plot how it evolved later
cron.schedule('* * * * *', function(){

    Stock.find().exec(function(err, stocks) {
        var result = getWalletAmount(stocks).toString();

        if (result.length >= 1) {
            var walletRightNow = new Wallet({
                date: Date.now(),
                value: result
            });
            walletRightNow.save();
        }
    });

    var date = new Date;
    var hours = date.getHours().toString();
    var minutes = date.getMinutes().toString();
    var seconds = date.getSeconds().toString();

    if (hours.length === 1) hours = '0' + hours;
    if (minutes.length === 1) minutes = '0' + minutes;
    if (seconds.length === 1) seconds = '0' + seconds;

    console.log(hours + ':' + minutes + ':' + seconds + ' :: Wallet stored !');
});

app.listen('3000');
console.log('Server is running on port 3000....');

// app.route(path).get(callback).post(callback)

// req.query
// req.params
// req.param(name)
// req.body
// req.path, req.host, req.ip
// req.cookies

// res.status
// res.set
// res.cookie
// res.redirect
// res.send
// res.json
