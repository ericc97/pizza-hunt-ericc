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

    // add to reply to a comment
    addReply({ params, body}, res ) {
        Comment.findOneAndUpdate(
            {_id: params.commentId},
            { $push: { replies: body }},
            { new: true, runValidators: true }
        )
        .then(dbPizzaData => {
            if(!dbPizzaData){
                res.status(400).json({ message: 'No pizza found with that id'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => console.log(err));
    },
    removeReply({ params }, res){
        Comment.findOneAndUpdate(
            {_id: params.commentId},
            { $pull: { replies: { replyId: params.replyId } } },
            { new:true }
        )
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.json(err))
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