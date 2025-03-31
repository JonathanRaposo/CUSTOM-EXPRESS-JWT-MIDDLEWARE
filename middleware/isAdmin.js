
exports.isAdmin = function (req, res, next) {

    if (!req.payload.isAdmin) {
        res.status(403).json({ errorMessage: 'Unauthorized.This page is for admin users only.' });
        return;
    }
    next();
}