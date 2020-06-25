const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById){
    const authenticUser = async (email, password, done) => {
        const user = getUserByEmail(email)
        if (user == null) {
            return done(null, false, { message: 'No user with that email'})
        }

        try{ 
            if( await bcrypt.compare(password)){
            return done(null, user)
        } else {
            return done(null, false, {message: 'password incorrect'})
        }

        } catch (e) {
            return done(e)
        }
    }

    passport.use(new localStrategy({usernameField: 'email'},
    authenticUser))
    passport.serializeUser((user, done) => done(null,  user.id))
    passport.deserializeUser((id, done) => {
    return done(null,  getUserById(id))
    })
} 

module.exports = initialize