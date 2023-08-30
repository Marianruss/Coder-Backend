const passport = require("passport")
const passportLocal = require("passport-local")
const githubStrategy = require("passport-github2")
const userModel = require("../dao/models/user.model")
const { createHash, isValidPassword } = require("../utils/passwordHash")

const localStrategy = passportLocal.Strategy

const initializePassport = () => {

    passport.use("github", new githubStrategy({
        clientID: "Iv1.252c59937eaff6ae",
        clientSecret: "e4c969df7828cd0cc5ff6b8c8a98866c90264e28",
        callbackURL: "http://localhost:8080/login/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // console.log(profile._json.login)
            let user = await userModel.findOne({ name: profile._json.login })
            console.log(profile._json)
            console.log("Se mostró usuario")

            if (!user) {
                console.log("no existe el usuario de git")
                const newUser = await userModel.create({
                    name: profile._json.login,
                    lastname: "",
                    email: profile._json.email,
                    gender: "M",
                    password: "",
                    isAdmin: true,
                    logged: false
                })


                return done(null, newUser)
            }


            // req.session.sessionId = user._id
            console.log("Ya existe el usuario de git")
            // user = user.toObject()
            user.logged = true
            await user.save()
            return done(null, user)




        }
        catch (error) {
            return done(error)
        }
    }))

    passport.use("register", new localStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, username, password, done) => {
            try {
                var user = await userModel.findOne({ email: username })

                // console.log({ username })

                if (user) {
                    console.log("Ya existe el usuario")
                    return done(null, false)
                }


                var body = req.body
                body.password = createHash(body.password)
                const isAdmin = ((newUser.email === "adminCoder@coder.com" && newUser.password === "adminCod3r123") || (newUser.email === "marianruss12@gmail.com")) ? true : false



                const newUser = {
                    ...body,
                    isAdmin,
                    logged: false
                }


                const create = await userModel.create(newUser)
                return done(null, create)
            }

            catch (err) {
                return done(err)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        console.log("serialize")
        // console.log(user)
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

