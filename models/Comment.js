const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');


const replySchema = new Schema({
    // set custom id to avoid confusion with parent comment's _id field
    replyId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    replyBody: {
        type:String,
        required: true,
        trim: true
    },
    writtenBy: {
        type:String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdVal => dateFormat(createdVal)
    }
},
{
    toJSON: {
        getters: true
    }
}
);

const CommentSchema = new Schema({
    writtenBy: {
        type: String,
        required: true,
        trim: true
    },
    commentBody: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdVal => dateFormat(createdVal)
    },
    // use ReplySchema to validate data for a reply
    replies: [replySchema]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
}
);

// get total count of comments and replies on retrieval 
CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
});

const Comment = model('Comment', CommentSchema);

module.exports = Comment;