const { Comment, Pizza } = require('../models');

const commentController = {
    // add comment to pizza
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
        .then(({ _id }) => {
            return Pizza.findOneAndUpdate(
                {_id: params.pizzaId },
                { $push: { comments: _id }},
                { new: true }
            );
        })
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(400).json({ message: 'No Pizza Found with this id' });
                return;
            }
            res.json(dbPizzaData)
        })
        .catch(err => res.status(400).json(err));
        
    },

    // remove a comment
    removeComment({ params }, res) {
        Comment.findOneAndDelete({_id: params.commentId})
        .then(deletedComment => {
            if (!deletedComment) {
                res.status(404).json({ message: 'No comment with this id!' });
                return;
            }
            return Pizza.findOneAndUpdate(
                {_id: params.pizzaId },
                //We then take that data and use it to identify and remove it from the associated pizza using the Mongo $pull operation
                { $pull: { comments: params.commentId } },
                { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => {
            res.json(err);
        })
        
    }
};

module.exports = commentController;