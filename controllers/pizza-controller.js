const { Pizza } = require('../models');
const { db } = require('../models/Pizza');

const pizzaController = {
    // functions will go in here as methods

    // get all pizzas
    getAllPizza(req, res) {
        Pizza.find({})
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // get one pizza by id
    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id })
        .then(dbPizzaData => {
            // If no pizza is found send 404
            if(!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with that id' });
                return;
            } 
            res.json(dbPizzaData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        });
    },

    // createPizza
    createPizza({ body }, res) {
        Pizza.create(body)
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.status(400).json(err));
    },

    // update pizza by id
    updatePizza({ params, body }, res) {
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true }) // { new: true } = will return new updated object
        .then(dbPizzaData => {
            if(!dbPizzaData){
                res.status(400).json({ message: ' No pizza found with that id... Cannot update'});
                return;
            }
            res.json(dbPizzaData)
        })
        .catch(err => res.status(500).json(err))
    },

    // delete a pizza by id
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
        .then(dbPizzaData => {
            if(!dbPizzaData){
                res.status(500).json({ message: 'No Pizza was found with that id' })
                return;
            }
            res.json(dbPizzaData);
        })
        .catch (err => res.status(400).json(err));
    }
};

module.exports = pizzaController;