import * as Lark from '@larksuiteoapi/node-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

export class LarkService {
  private client: Lark.Client;
  private wsClient: Lark.WSClient;
  private eventDispatcher: Lark.EventDispatcher;

  constructor() {
    const baseConfig = {
      appId: process.env.APP_ID || '',
      appSecret: process.env.APP_SECRET || '',
      domain: process.env.BASE_DOMAIN || '',
    };

    this.client = new Lark.Client(baseConfig);
    this.wsClient = new Lark.WSClient(baseConfig);
    this.initEventDispatcher();
  }

  private initEventDispatcher() {
    this.eventDispatcher = new Lark.EventDispatcher({}).register({
      'im.message.receive_v1': this.handleMessage.bind(this),
    });
  }

  private async handleMessage(data: any) {
    const {
      message: { chat_id, content, message_type, chat_type, message_id },
    } = data;

    const responseText = this.parseMessageContent(message_type, content);
    await this.sendResponse(chat_type, chat_id, message_id, responseText);
  }

  private parseMessageContent(messageType: string, content: string): string {
    try {
      if (messageType === 'text') {
        return JSON.parse(content).text;
      }
      return '解析消息失败，请发送文本消息 \nparse message failed, please send text message';
    } catch (error) {
      return '解析消息失败，请发送文本消息 \nparse message failed, please send text message';
    }
  }

  private async sendResponse(
    chatType: string,
    chatId: string,
    messageId: string,
    responseText: string
  ) {
    const messageContent = JSON.stringify({
      text: `收到你发送的消息:${responseText}\nReceived message: ${responseText}`,
    });

    if (chatType === 'p2p') {
      await this.sendDirectMessage(chatId, messageContent);
    } else {
      await this.replyToMessage(messageId, messageContent);
    }
  }

  private async sendDirectMessage(chatId: string, content: string) {
    await this.client.im.v1.message.create({
      params: {
        receive_id_type: 'chat_id',
      },
      data: {
        receive_id: chatId,
        content: content,
        msg_type: 'text',
      },
    });
  }

  private async replyToMessage(messageId: string, content: string) {
    await this.client.im.v1.message.reply({
      path: {
        message_id: messageId,
      },
      data: {
        content: content,
        msg_type: 'text',
      },
    });
  }

  public start() {
    this.wsClient.start({ eventDispatcher: this.eventDispatcher });
  }
} 