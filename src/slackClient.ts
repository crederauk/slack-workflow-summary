import { IncomingWebhook, IncomingWebhookDefaultArguments } from '@slack/webhook';
import Message from './message';

export default class SlackClient {
  private readonly webhook: IncomingWebhook;

  constructor(webhookUrl: string, webhookArguments: IncomingWebhookDefaultArguments = {}) {
    this.webhook = new IncomingWebhook(webhookUrl, webhookArguments);
  }

  async sendMessage(message: Message): Promise<string> {
    const response = await this.webhook.send({
      attachments: [message.render()],
    });
    return response.text;
  }
}
