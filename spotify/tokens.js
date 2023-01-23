


    class Spotify {
        
        // private constructor
        constructor(at, rt){
            this.access_token = at
            this.refresh_token = rt
        }

        static async initialize(authorization_code){
            const b64 = Buffer.from(process.env.client_id + ':' + process.env.client_secret).toString('base64')

            const response = await fetch(`${process.env.spotify_auth_base}/api/token`, {
                method: 'POST',
                headers: new Headers({
                    'Authorization': 'Basic ' + b64,
                    "Content-Type": "application/x-www-form-urlencoded"
                }),
                body: new URLSearchParams({
                    grant_type: "authorization_code",
                    code: authorization_code,
                    redirect_uri: process.env.redirect_uri
                })
            })
       
            
                const{access_token,refresh_token}= await response.json()
                return new Spotify(access_token, refresh_token)
       

        }
}


module.exports = Spotify