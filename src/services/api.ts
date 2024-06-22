import dayjs from "dayjs";


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

export async function getShortUrl(url: string, title: string) {
    const res = await fetch(`https://ulvis.net/api.php?url=${url}&custom=${title}`);
    if (!res.ok) {
        return '获取短链接失败';
    }
    return res.json().then((data) => data);
}

export async function getWeiboData(date: string = dayjs().format('YYYY-MM-DD')) {
    const res = await fetch(
        // `https://cdn.jsdelivr.net/gh/lxw15337674/weibo-trending-hot-history@master/api/${date}/summary.json`,
        `https://raw.githubusercontent.com/lxw15337674/weibo-trending-hot-history/master/api/${date}/summary.json`,
    );

    if (!res.ok) {
        return '获取数据失败';
    }
    return res.json().then(async (data: SavedWeibo[]): Promise<string> => {
        const promises = data.slice(0, 10).map(async (cur, index) => {
            const shortUrl = await getShortUrl(cur.url, cur.title);
            return `${index + 1}-${cur.title}] - ${shortUrl}\n`;
        });
        const results = await Promise.all(promises);
        return results.join('');
    });
}
