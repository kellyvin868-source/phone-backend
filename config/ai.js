const OpenAI=require('openai');
const client=new OpenAI({
    api_key:process.env.OPENAI_API_KEY
});

module.exports=client;