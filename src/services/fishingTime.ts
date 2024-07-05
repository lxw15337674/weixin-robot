import axios from "axios";

interface Holiday {
    holiday: string;
    enName: string;
    name: string;
    year: number;
    start?: string;
    end?: string;
}
// 计算距离下一个假期的间隔天数, 传入假期日期,如果假期已经过去, 返回-1，否则返回间隔天数
export const calculateRestDays = (dateString: string) => {
    const date = new Date(dateString);
    const currentTime = new Date().getTime();
    const targetTime = date.getTime();
    const difference = targetTime - currentTime + 1000 * 60 * 60 * 24;
    if (difference <= 0) {
        return -1;
    }
    return Math.floor(difference / 1000 / 60 / 60 / 24);
};

export async function holiday(): Promise<string> {
    return await axios.get('https://s3.cn-north-1.amazonaws.com.cn/general.lesignstatic.com/config/jiaqi.json').then((res) => {
        const text = res?.data.vacation.reduce((pre, cur) => {
            const restDays = calculateRestDays(cur.holiday);
            if (restDays < 0) {
                return pre;
            }
            return pre + `距离${cur.holiday}【${cur.name}】 还有${restDays}天\n`;
        }, '')
        return text.trim(); // 去除最后的换行
    })
}
