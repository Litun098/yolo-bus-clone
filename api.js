let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');
let mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/busdb', {
    userCreateIndex: true,
    userUnifiedTopology: true,
    useNewUrlParser: true
})

let ticketModel = require('./database/ticketDetails');
const { json } = require('body-parser');
let app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.post('/fillDb', function (req, res) {
    for (let i = 1; i <= 40; i++) {
        let ins = new ticketModel({ status: true, ticketNo: 1 });
        ins.save(function (err) {
            if (err) {
                console.log(err);
            }
        })
    }
    res.json({ msg: 'Data Saved' })
})

app.get('/userDetail/:name', function (req, res) {
    let no = req.params.number;
    if (no > 40 || no < 1) {
        res.json({ Data: "Invalid input" })
        return;
    }
    let lt = ticketModel.findOne({ ticketModel: no });
    lt.exec(function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.json({ Data: data.userDetails })
        }
    })
})

app.get('/closed', (req, res) => {
    let query = ticketModel.find({ 'status': false }).select('ticketNo')

    query.exec(function (err, data) {
        if (err) console.log(err);
        else res.json({ Data: data })
    })
})

app.get('/open', (req, res) => {
    let query = ticketModel.find({ 'status': true }).select('ticketNo');
    query.exec((err, data) => {
        if (err) console.log(err);
        else res.json({ Data: data })
    })
})


app.put('/updateTicket', (req, res) => {
    let no = req.body.ticketModel;

    if (no > 40 || no < 1) {
        res.json({ data: "Invalid input" });
        return;
    }

    ticketModel.updateOne({ 'ticketNo': no }, req.body, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.json({ Data: "Data updated" })
        }
    });
});
app.get('/ticketStatus/:number', function (req, res) {
    let no = req.params.ticketNo;
    if (no > 40 || no < 1) {
        res.json({ data: "Invalid Input" });
        return
    }

    let query = ticketModel.findOne({ 'ticketNo': no }).select("status");
    query.exec((err, data) => {
        if (err) {
            console.log(err);
        }
        else if (data.status) {
            res.json({ Data: 'Open' });
        } else {
            res.json({ Data: "Close" })
        }
    });
});

app.put('/reset', (req, res) => {
    ticketModel.updateMany({ "status": false }, { "$set": { "status": true, "userDetail": [] } }, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json({ Data: "Data reset" });
        }
    })
})

app.listen(8899, () => {
    console.log('Server running...');
})