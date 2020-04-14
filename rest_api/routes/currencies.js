const express = require("express");
const router = express.Router(); 
const Currency = require('../models/Currency');
const mongoose = require("mongoose");

//Get back all the currencies
router.get("/", async(req, res) => {
    try {
        const currencies = await Currency.find(); //this mongoose method enables us to get all the currencies
        res.json(currencies);
    } catch (err) {
        res.sendStatus(404);
    }
});

//Submit the currency
router.post("/", async (req, res) => {
    if (!req.body.name || !req.body.shortCode || !req.body.rate) {
        res.status(400).send('Please, fill in all the fields!');
    }
    else {
        const currency = new Currency({
        name: req.body.name,
        shortCode: req.body.shortCode,
        rate: req.body.rate  
    });
    try {
        await currency.save();
        res.sendStatus(200);
    } catch (err) {
        res.status(400).send('Short code already exists!');
    }
  }
});

//to get a specific currency
router.get('/:currencyId', async(req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.currencyId)) {
        return res.status(404).send('Invalid id'); 
    } else {
        try {
            const currency = await Currency.findById(req.params.currencyId);
            res.json(currency);
        } catch (err) {
            res.sendStatus(404);
        } 
    }  
});

//Delete currency
router.delete('/:currencyId', (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.currencyId)) {
        return res.status(404).send('Invalid id'); 
    } else {
        Currency.findById(req.params.currencyId, (err, currency) => {
            if (err) {
                res.sendStatus(400);
             } else {
                 currency.remove();
                 res.sendStatus(200);
             }
        }); 
    }     
});

//Update currency
router.patch('/:currencyId', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.currencyId) ) {
        res.status(404).send('Invalid id'); 
    } else if (!req.body.name || req.body.name === '' || !req.body.shortCode || req.body.shortCode === '' || !req.body.rate || req.body.rate === '') {
        res.status(400).send("Please, fill in all the fields!");
    } else {
        try {
            await Currency.updateOne({_id: req.params.currencyId}, {$set : {name : req.body.name, rate: req.body.rate, shortCode:req.body.shortCode}});
            res.sendStatus(200);
        } catch (err) {
            res.status(400).send("Short code already exists!");
        }
    }
});

module.exports = router; //we export the router with the help of this line
