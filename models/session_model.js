
const mongoose = require('mongoose')

const session_schema = new mongoose.Schema({
    access_token: {
        type: String,
        required: true
    },
    refresh_token: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: new Date().toISOString()
    }
})

const Session = mongoose.model('Session', session_schema)
module.exports = Session