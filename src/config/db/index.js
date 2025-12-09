const mongoose = require('mongoose');
const schema = mongoose.Schema;
const dotenv = require('dotenv');
dotenv.config();

const Connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
module.exports = Connect;