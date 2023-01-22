
module.exports = {

    Token: class Token {
        static access_token = ""
        static refresh_token = ""

    },
    // async mthod to call the spoitify endpint and get the token
    generate_access_token: async (code) => {
        const b64 = Buffer.from(process.env.client_id + ':' + process.env.client_secret).toString('base64')

        const response = await fetch(`${process.env.spotify_auth_base}/api/token`, {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Basic ' + b64,
                "Content-Type": "application/x-www-form-urlencoded"
            }),
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: process.env.redirect_uri
            })
        })

        return await response.json()

    }
}

