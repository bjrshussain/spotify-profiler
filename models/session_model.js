
const mongoose = require('mongoose')

const session_schema = new mongoose.Schema({
    access_token:{
        type: String,
        required: true
    },
    refresh_token: {
        type: String,
        required: true
    }
})

const Session = mongoose.model('Session', session_schema)
module.exports = Session