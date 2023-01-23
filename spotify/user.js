const { json } = require("body-parser")
const Session = require("../models/session_model")
const { Token } = require("./tokens")


module.exports = {

    User: class User {

         constructor (tkn) {
            this.url = `${process.env.spotify_api_base}`
            this.token = tkn
                 
        }

        // crete users data to pass into views
         async crete_views_data(){
        
           var data= new Object()
            data = { ...data, user: await this.get_user()  }
            data = { ...data, playlists: await this.get_user_playlists() }
            data = { ...data, top_tracks: await this.get_top_tracks() }
            data = { ...data, top_artists: await this.get_top_artists() }
            data = { ...data, followings: await this.get_following_artists() }
            return data
        }

        // get user information
        async get_user() {

            const response = await fetch(`${this.url}/v1/me`, {
                method: 'GET',
                credentials: 'include',
                headers: new Headers({
                    'Authorization': `Bearer ` + this.token
                })
            })

            return await response.json()
            
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
                    'Authorization': `Bearer ` + this.token,
                    "Content-Type": "application/json",
                    Accept: 'application/json'
                })
            })
            return await response.json()


        }

        // gets top 20 tracks for user
        async get_top_tracks() {

            const query = new URLSearchParams({
                type: "artists"
            }).toString()
            const response = await fetch(`${this.url}/v1/me/top/tracks`, {
                method: 'GET',
                credentials: 'include',
                headers: new Headers({
                    'Authorization': `Bearer ` + this.token,
                    "Content-Type": "application/json",
                    Accept: 'application/json'
                })
            })
            return await response.json()


        }

        // gets 20 artist that user follows
        async get_following_artists() {

        
            const response = await fetch(`${this.url}/v1/me/following?type=artist&limit=50`, {
                method: 'GET',
                credentials: 'include',
                headers: new Headers({
                    'Authorization': `Bearer ` +this.token,
                    "Content-Type": "application/json",
                    Accept: 'application/json'
                })
            })

            return await response.json()


        }

        // get users playlists
        async get_user_playlists() {


            const response = await fetch(`${this.url}/v1/me/playlists`, {
                method: 'GET',
                credentials: 'include',
                headers: new Headers({
                    'Authorization': `Bearer ` + this.token,
                    "Content-Type": "application/json",
                    Accept: 'application/json'
                })
            })

            return await response.json()


        }

    }

}