module.exports = {
    errorHandler: (error, req, res, next) => {
        if (error) {
            console.log(error);
           return res.status(error.status || 500).json({
                sucess: false,
                error: error.message,
            })
        }
        
        next()
    },

    notFoundHandler: (req, res, next) => {
        res.send('404:: Endpoint not found')
    }
}