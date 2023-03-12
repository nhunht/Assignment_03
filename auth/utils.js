const checkIsAdmin = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/');
    }
    if (!req.user.isAdmin) {
        return res.send("<script>alert('You are not have permission to access this function'); window.history.back();</script>");
    }
    return next();
}

const checkNotAdmin = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/');
    }

    if (req.user.isAdmin) {
        return res.send("<script>alert('You are not have permission to access this function'); window.history.back();</script>");
    }
    return next();
}

module.exports = { checkIsAdmin, checkNotAdmin };
