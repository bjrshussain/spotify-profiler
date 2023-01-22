const { Token } = require("../token/tokens")


module.exports = {

    User: class User {

        constructor() {
            this.url = `${process.env.spotify_api_base}`
            this.user_id = ""
        }

        // get user information
        async get_user() {

            const response = await fetch(`${this.url}/v1/me`, {
                method: 'GET',
                credentials: 'include',
                headers: new Headers({
                    'Authorization': `Bearer ` + Token.access_token
                })
            })

            const user = await response.json()
            this.user_id = user.id
            return user
        }

        // gets to 20 artists for user
        async get_top_artists() {

            const query = new URLSearchParams({
                type: "artists"
            }).toString()
            const response = await fetch(`${this.url}/v1/me/top/artists`, {
                method: 'GET',
                credentials: 'include',
                headers: new Headers({
                    'Authorization': `Bearer ` + Token.access_token,
                    "Content-Type": "application/json",
                    Accept: 'application/json'
                })
            })
            return await response.json()


        }

        // gets to 20 artists for tracks
        async get_top_tracks() {

            const query = new URLSearchParams({
                type: "artists"
            }).toString()
            const response = await fetch(`${this.url}/v1/me/top/tracks`, {
                method: 'GET',
                credentials: 'include',
                headers: new Headers({
                    'Authorization': `Bearer ` + Token.access_token,
                    "Content-Type": "application/json",
                    Accept: 'application/json'
                })
            })
            return await response.json()


        }

    }

}