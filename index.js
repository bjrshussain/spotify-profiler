require('dotenv').config()
const cookieParser = require('cookie-parser')
const { generate_access_token, Token } = require('./spotify/tokens')
const express = require('express');
const { User } = require('./spotify/user');
const { create_db_connection } = require('./db/connection');
const Session = require('./models/session_model');
const Spotify = require('./spotify/tokens');


// app and middlware
const app = express()
app.use(express.static(__dirname + '/public'))
app.use(cookieParser(process.env.cookie_secret))
app.set('view engine', 'ejs');

// connect the db
create_db_connection()
console.log("TIME", new Date())

// routes
app.get("/", async (req, res) => {


    if (!req.signedCookies.tid) {

        return res.render("home", { user: null })
    }

    const token = await Session.findById(req.signedCookies.tid)

    if (!token) {
        res.clearCookie("tid")
        return res.redirect("/")
    }
    const user = new User(token.access_token)
    if (!user) {
        return res.redirect("/")
    }
    const user_data = await user.crete_views_data()


    res.render("home", { user: user_data })


})


// endpoint for user to access to get redirected for spotify login
app.get('/authorize', (req, res) => {

    // create a query string
    const query = new URLSearchParams({
        client_id: process.env.client_id,
        response_type: "code",
        redirect_uri: process.env.redirect_uri,
        state: process.env.state,
        scope: process.env.scope
    }
    )
    // call redirect to spotify asking user to grant access to spotify
    res.redirect(process.env.spotify_auth_base + "/authorize" + "?" + query.toString())
})

// the redirect uri, spotify will respond here with data
app.get('/authcallback', async (req, res) => {



    const { error, state, code } = req.query
    if (error) {
        return res.redirect("/")
    }

    if (state !== process.env.state) {
        return res.redirect("/")
    }

    const spotify = await Spotify.initialize(code)

    if (!spotify.access_token || !spotify.refresh_token) {
        res.redirect("/")
    }
    const session = await Session.create({
        access_token: spotify.access_token,
        refresh_token: spotify.refresh_token
    })

    res.cookie("tid", session._id, { maxAge: 600000, httpOnly: true, signed: true })
    res.redirect("/")
})

app.get('/logout', async (req, res) => {
    const tid = req.signedCookies.tid
    const session = await Session.findByIdAndDelete(tid)
    res.clearCookie("tid")
    res.redirect("/")
})

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is listenign now...`)
})