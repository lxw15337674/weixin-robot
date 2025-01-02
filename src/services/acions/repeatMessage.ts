import { isNumber } from "lodash";
import { CommandParams } from "../command";

export const repeatMessage = async (params: CommandParams): Promise<string> => {
    const { args, sendMessage } = params;
    const [content, rawCount] = args.split(' ');

    if (!content?.trim()) {
        return '请输入要复读的内容';
    }

    const count = Math.min(Math.max(Number(rawCount) || 3, 3), 6);

    for (let i = 0; i < count; i++) {
        await sendMessage(content);
    }

    return `已复读 ${count} 次`;
};
