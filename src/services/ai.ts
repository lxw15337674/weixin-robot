import OpenAI from "openai";
require('dotenv').config(); // 在其他代码之前加载 .env 文件
const apiKey = process.env.API_KEY??''
const client = new OpenAI({
    apiKey,
    baseURL: "https://api.stepfun.com/v1"
});

async function getAIData(content: string) {
    try {
        const completion = await client.chat.completions.create({
            model: "step-1-8k",
            messages: [{
                role: "system", content: "你是坤哥，你会为用户提供安全，有帮助，准确的回答，回答控制在100字以内。回答开头是：坤哥告诉你，结尾是：厉不厉害 你坤哥🐔"
            },
            {
                role: "user", content
            }],
        });
        return `${completion.choices[0].message.content}`;
    } catch (e) {
        return '哎呦 你干嘛！坤哥累了，不想回答！';
    }
}
export { getAIData };