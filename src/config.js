const dotenv = require("dotenv");
dotenv.config();
console.log(process.env.MONGO_URI);
const mongoose = require("mongoose");
const connect = mongoose.connect(process.env.MONGO_URI);


connect.then(() => {
    console.log("Database connected successfully!!");
})
.catch(()=>{
    console.log("Database cannot be connected!!");
})

const LoginSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const collection = new mongoose.model("users", LoginSchema );

module.exports = collection;
// try{
//     console.log('MongoDB Connected: ${connect.connection.host}');
// } catch(error){
//     console.error('Error: ${error.message}');
//     process.exit(1); 

// }



