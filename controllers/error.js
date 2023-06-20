

exports.getError404 = (req, res, next) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', 'Error404.html'));
    res.render('Error404', {pageTitle: 'Error-404', path:'/'});

}