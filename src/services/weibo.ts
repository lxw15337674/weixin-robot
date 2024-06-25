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

export async function getWeiboData(): Promise<string> {
    const date = dayjs().format('YYYY-MM-DD')
    try {
        const res = await axios.get(
            `https://raw.githubusercontent.com/lxw15337674/weibo-trending-hot-history/master/api/${date}/summary.json`
        );
        const data: SavedWeibo[] = res.data;
        const promises = data.slice(0, 20).map(async (cur, index) => {
            // const shortUrl = getWeiboSearchCoreUrl(cur.title);
            return `${index + 1}.${cur.title}  ${cur.hot}🔥`
        });
        const results = await Promise.all(promises);
        return results.join('\n');
    } catch (error) {
        return '获取数据失败';
    }
}