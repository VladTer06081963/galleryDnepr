const getCommentsHandler = (req, res) => {
    res.send('Get comments route');
    console.log('Get comments route');
};

const getSingleCommentHandler = (req, res) => {
    res.send(`Get comment route. CommentId ${req.params.commentId}`);
    console.log(`Get comment route. CommentId ${req.params.commentId}`);
};

const postCommentsHandler = (req, res) => {
    res.send('Post comments route');
    console.log('Post comments route1');
};

const deleteSingleCommentHandler = (req, res) => {
    res.send(`Delete comment route. CommentId ${req.params.commentId}`);
    console.log(`Delete comment route. CommentId ${req.params.commentId}`);
};

module.exports = {
    getCommentsHandler,
    getSingleCommentHandler,
    postCommentsHandler,
    deleteSingleCommentHandler,
};
