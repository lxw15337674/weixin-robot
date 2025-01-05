import dayjs from "dayjs";
import axios from 'axios';


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
        const res = await axios.get<SavedWeibo[]>(url); // 指定axios返回类型
        const data = res.data.slice(0, 20); // 简化数据处理
        let text = `今日微博热搜榜\n`;
        // 使用数组方法生成结果字符串，避免手动拼接
        text += data.map((item, index) => `${index + 1}. ${item.title}  ${item.hot}🔥`)
            .join('\n');
        return text;
    } catch (error) {
        console.error('获取微博热搜数据失败:', error); // 打印错误信息
        return '获取微博热搜数据失败';
    }
}