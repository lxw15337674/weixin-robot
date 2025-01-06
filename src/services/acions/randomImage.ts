import axios from 'axios';
import { saveBufferToImage } from '../../utils/save';
import path from 'path';


interface ImageData {
    image:string
}

export async function getRandomImage(): Promise<string> {
  try {
    
    // 获取图片列表
    const response = await axios.get<ImageData>(
      `https://bhwa233.vercel.app/api/image`
    );
     const imageUrl = response.data.image

    // 从URL中提取文件扩展名
    const extension = imageUrl.split('.').pop() || 'webp';
    const filename = `random_awsl.${extension}`;

    // 下载图片
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });

    // 保存图片到本地（使用提取的扩展名）
    const filepath = await saveBufferToImage(imageResponse.data, filename);

    return filepath;
  } catch (error) {
    console.error('获取随机图片失败:', error);
    return '获取随机图片失败，请稍后重试';
  }
} 