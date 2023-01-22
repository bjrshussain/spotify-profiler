require('dotenv').config()
const { generate_access_token, Token } = require('./token/tokens')
const express = require('express');
const { get_user, User } = require('./spotify/user');
const app = express()
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');

console.log(process.env.spotify_auth_base)
app.get("/", async (req, res) => {

    if (Token.access_token) {
        const user = new User()
        const user_data = await user.crete_views_data()

        res.render("home", { user: user_data })

    }
    else {
        res.render("home", { user: null })

    }

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
        return res.send("Access denied:", error)
    }

    if (state !== process.env.state) {
        return res.send("Access denied.")
    }

    const { access_token, refresh_token } = await generate_access_token(code)
    Token.access_token = access_token
    Token.refresh_token = refresh_token
    res.redirect("/")
})

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is listenign now...`)
})