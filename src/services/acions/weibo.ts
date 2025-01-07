import dayjs from "dayjs";
import axios from 'axios';
import { saveTextToImage } from "../../utils/save";


interface SavedWeibo {
    title: string;
    category: string;
    description: string;
    url: string;
    hot: number;
    ads: boolean;
    readCount?: number;
    discussCount?: number;
    origin?: number;
}

function getWeiboSearchCoreUrl(title) {
    // 使用 encodeURIComponent 对 title 进行 URL 编码
    const encodedTitle = encodeURIComponent(`#${title}#`);
    // 构建新的 URL
    const baseUrl = 'https://s.weibo.com/weibo?';
    const coreUrl = `${baseUrl}q=${encodedTitle}`;
    return coreUrl;
}

const BASE_URL = 'https://raw.githubusercontent.com/lxw15337674/weibo-trending-hot-history/master/api';

export async function getWeiboData(): Promise<string> {
    const date = dayjs().format('YYYY-MM-DD');
    const url = `${BASE_URL}/${date}/summary.json`;
    try {
        const { data } = await axios.get<SavedWeibo[]>(url);
        const topData = data.slice(0, 20);

        const content = topData.map((item, index) => 
            `${index + 1}. ${item.title} ${item.hot}🔥`
        ).join('\n\n');

        const markdown = `# 微博热搜榜\n\n${content}`;
        return await saveTextToImage(markdown, 'weibo.png');
    } catch (error) {
        console.error('生成微博热搜图片失败:', error);
        const { data } = await axios.get<SavedWeibo[]>(url);
        return data.slice(0, 20).map((item, index) => 
            `${index + 1}. ${item.title} ${item.hot}🔥`
        ).join('\n\n');
    }
}