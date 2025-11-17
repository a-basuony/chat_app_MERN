const {StreamChat } = require('stream-chat');
const dotenv = require("dotenv");

dotenv.config();

const   apiKey = process.env.STREAM_API_KEY;
const   apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("Missing Stream API key or secret");
    throw new Error("Missing Stream API key or secret");
}


const streamClient = StreamChat.getInstance(apiKey, apiSecret);

const upsertStreamUser = async (userData)=>{
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error upSert Stream user:", error);
        throw error;
    }
}

// todo: doit later
const generateStreamToken =(userId) =>{}


module.exports = { upsertStreamUser , generateStreamToken };