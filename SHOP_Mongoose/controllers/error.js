

exports.getError404 = (req, res, next) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', 'Error404.html'));
    res.render('Error404', {
        pageTitle: 'Error-404', 
        path:'/Error404',
        isAuthenticated: req.session.isLoggedIn
    });
}


exports.getError500 = (req, res, next) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', 'Error404.html'));
    res.render('Error500', {
        pageTitle: 'Error-500', 
        path:'/Error500',
        isAuthenticated: req.session.isLoggedIn
    });
}