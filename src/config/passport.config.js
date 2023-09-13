const passport = require("passport")
const passportLocal = require("passport-local")
const githubStrategy = require("passport-github2")
const userModel = require("../dao/models/user.model")
const { createHash, isValidPassword } = require("../utils/passwordHash")
const cartManager = require("../dao/managers/cartManager")
const cartRouter = require("../routers/cartRouter")
const admin = new cartManager

const localStrategy = passportLocal.Strategy

const initializePassport = () => {

    passport.use("github", new githubStrategy({
        clientID: "Iv1.252c59937eaff6ae",
        clientSecret: "e4c969df7828cd0cc5ff6b8c8a98866c90264e28",
        callbackURL: "http://localhost:8080/login/githubcallback"
    },
        async (accessToken, refreshToken, profile, done) => {
            try {

                let user = await userModel.findOne({ name: profile._json.login })


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

                user.logged = true
                await user.save()
                return done(null, user)

            }
            catch (error) {
                return done(error)
            }
        }))

        ///--- Register strat ---///
    passport.use("register", new localStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, username, password, done) => {
            try {
                let user = await userModel.findOne({ email: username })
                const cartId = await admin.addCart({clientName: username,products:[]})

                // console.log({ username })

                if (user) {
                    console.log("Ya existe el usuario")
                    return done(null, false)
                }


                let body = req.body
                body.password = createHash(body.password)

                console.log(cartId)



                const newUser = {
                    ...body,
                    isAdmin: false,
                    logged: false,
                    cart: cartId
                }

                newUser.isAdmin = ((newUser.email === "adminCoder@coder.com" && newUser.password === "adminCod3r123") || (newUser.email === "marianruss12@gmail.com")) ? true : false


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

            const user = await userModel.findOne({ email: username }).populate("carts")

            if (!user) {

                return done(null, false)
            }

            //if name is incorrect recalls login with loginFailed true

            if (username != user.email || !isValidPassword(password, user.password)) {
                return done(null, false)

            }



            user.logged = true
            await user.save()
            return done(null, user)

        }

        catch (error) {

        }
    }))


}

module.exports = initializePassport

