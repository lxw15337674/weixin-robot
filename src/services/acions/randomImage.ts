import axios from 'axios';
import { saveBufferToImage } from '../../utils/save';
import path from 'path';

interface PicInfo {
    large: {
        url: string;
        width: number;
        height: number;
    };
    original: {
        url: string;
        width: number;
        height: number;
    };
}

interface ImageData {
    pic_id: string;
    wb_url: string;
    pic_info: PicInfo;
}

export async function getRandomImage(): Promise<string> {
  try {
    // 生成随机的 offset (0-1000之间)
    const randomOffset = Math.floor(Math.random() * 1000);
    
    // 获取图片列表
    const response = await axios.get<ImageData[]>(
      `https://awsl.api.awsl.icu/v2/list?uid=&limit=1&offset=${randomOffset}`
    );
    const randomImg = response.data[0];
    const imageUrl = randomImg.pic_info.large.url;

    // 下载图片
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });

    // 保存图片到本地（覆盖已存在的文件）
    const filepath = await saveBufferToImage(imageResponse.data, 'random_awsl.jpg');

    return filepath;
  } catch (error) {
    console.error('获取随机图片失败:', error);
    return '获取随机图片失败，请稍后重试';
  }
} 