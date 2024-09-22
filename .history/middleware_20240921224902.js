const ExpressError = require('./utils/ExpressError');
const menu = reqruire('/')

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error','Please log in first')
        return res.redirect('/login')
    }
    next(;)
}
