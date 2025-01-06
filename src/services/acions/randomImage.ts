import axios from 'axios';
import { saveBufferToImage } from '../../utils/save';

export async function getRandomImage(): Promise<string> {
  try {
    // 直接获取图片数据
    const response = await axios.get('https://bhwa233.vercel.app/api/image', {
      responseType: 'arraybuffer'
    });

    // 保存webp图片到本地
    const filepath = await saveBufferToImage(response.data, 'random_awsl.png');

    return filepath;
  } catch (error) {
    console.error('获取随机图片失败:', error);
    return '获取随机图片失败，请稍后重试';
  }
} 