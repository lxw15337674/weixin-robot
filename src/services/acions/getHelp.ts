import { saveTextToImage } from "../../utils/save";
import { commandMap } from "../command";

export async function getHelp() {
    const commandMsg = commandMap
        .filter(command => command.enable !== false)
        .map(command => command.msg)
        .join('\n');

    return `命令列表：\n${commandMsg}\n项目地址：https://github.com/lxw15337674/weixin-robot`;

    // try {
    // const markdown = `# 命令帮助列表\n\n${commandMsg}\n\n项目地址：https://github.com/lxw15337674/weixin-robot`;
    //     const filePath = await saveTextToImage(markdown, 'help.png');
    //     return filePath;
    // } catch (error) {
    //     console.error('生成帮助图片失败:', error);
    //     return `命令列表：\n${commandMsg}\n项目地址：https://github.com/lxw15337674/weixin-robot`;
    // }
}