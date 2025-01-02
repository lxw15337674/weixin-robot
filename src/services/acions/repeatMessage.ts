import { CommandParams } from "../command";


export function extractBracketContent(text: string): string | null {
    const match = text.match(/text="\[([^"]+)\]_web"/);
    return match ? `[${match[1]}]` : text;
}

export const repeatMessage = async (params: CommandParams): Promise<string> => {
    const { args, sendMessage } = params;


    // 替换整个表情标签为[内容]格式
    const lastSpaceIndex = args.lastIndexOf(' ');

    const content = extractBracketContent(args.slice(0, lastSpaceIndex))
    const rawCount = args.slice(lastSpaceIndex + 1);

    if (!content?.trim()) {
        return '请输入要复读的内容';
    }

    const count = Math.min(Math.max(Number(rawCount) || 3, 3), 6);

    for (let i = 0; i < count; i++) {
        await sendMessage(content);
    }
};