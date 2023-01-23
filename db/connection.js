
const mongoose = require('mongoose')


module.exports={

    create_db_connection: async()=>{
        try {
            mongoose.set('strictQuery', false);
            await mongoose.connect(process.env.mongodb_uri)
            console.log("Connected to the database")
            
        } catch (error) {
            console.log("Cannot connect to the database.")
            console.log(error.message);
            
        }
     

    }
}
