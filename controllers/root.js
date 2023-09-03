const getRootHandler = (req, res) => {
    res.send('Get root route');
    console.log('Get root route');
};

module.exports = { getRootHandler };
