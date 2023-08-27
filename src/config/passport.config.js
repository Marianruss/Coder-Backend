const passport = require("passport")
const passportLocal = require("passport-local")
const userModel = require("../dao/models/user.model")
const { createHash, isValidPassword } = require("../utils/passwordHash")

const localStrategy = passportLocal.Strategy

const initializePassport = () => {

    passport.use("register", new localStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, username, password, done) => {
            try {
                var user = await userModel.findOne({ email: username })

                console.log({ username })

                if (user) {
                    console.log("Ya existe el usuario")
                    return done(null, false)
                }


                var newUser = req.body
                newUser.password = createHash(newUser.password)
                const isAdmin = ((newUser.email === "adminCoder@coder.com" && newUser.password === "adminCod3r123") || (newUser.email === "marianruss12@gmail.com")) ? true : false



                newUser = {
                    ...newUser,
                    isAdmin,
                    logged: false
                }


                newUser = await userModel.create(newUser)
                return done(null, newUser)
            }

            catch (err) {
                return done(err)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        console.log("serialize")
        done(null, user._id)
    })


    passport.deserializeUser(async (id, done) => {
        console.log("deserialize ")
        const user = await userModel.findOne({ _id: id })
        done(null, user)
    })


    passport.use("login", new localStrategy({ usernameField: "email" }, async (username, password, done) => {
        try {

            const user = await userModel.findOne({ email: username })
            console.log(user)
            console.log(password)

            console.log("pasó encontrar user")
            if (!user) {
                console.log("No user")
                return done(null, false)
            }
            console.log("pasó primer if")

            //if name is incorrect recalls login with loginFailed true
            console.log("asdasd")
            if (username != user.email || !isValidPassword(password, user.password)) {
                console.log("entró 2do if")
                console.log("credenciales invalidas")
                return done(null, false)

            }

            console.log("pasó 2do if")

            user.logged = true
            await user.save()
            console.log("llegó al final")
            // console.log(req.user)
            return done(null, user)

        }

        catch (error) {

        }
    }))


}

module.exports = initializePassport

