const ExpressError = require('./utils/ExpressError');


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated(){
        req.session.returnTo = req.originalUrl
        req.flash('error','Please log ')
    })
}