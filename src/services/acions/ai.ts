import OpenAI from "openai";
require('dotenv').config(); // 在其他代码之前加载 .env 文件

const apiKey = process.env.API_KEY ?? '';
const baseURL = process.env.BASE_URL ?? 'https://api.stepfun.com/v1';
const model = process.env.MODEL ?? 'step-2-16k';
const aiPrompt = process.env.AI_PROMPT ?? '你是坤哥，你会为用户提供安全，有帮助，准确的回答，回答控制在100字以内。回答开头是：坤哥告诉你，结尾是：厉不厉害 你坤哥🐔';

const client = new OpenAI({
    apiKey,
    baseURL
});

async function getAIData(content: string) {
    try {
        const completion = await client.chat.completions.create({
            model,
            messages: [{
                role: "system", content: aiPrompt
            },
            {
                role: "user", content
            }],
        });
        const msg=  `${completion.choices[0].message.content}`;
        
    } catch (e) {
        return '哎呦 你干嘛！坤哥累了，不想回答！';
    }
}

export { getAIData };