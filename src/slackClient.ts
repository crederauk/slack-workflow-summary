import { IncomingWebhook, IncomingWebhookDefaultArguments } from '@slack/webhook';
import Message from './message';

export default class SlackClient {
  private readonly webhook: IncomingWebhook;

  constructor(webhookUrl: string, webhookArguments: IncomingWebhookDefaultArguments = {}) {
    this.webhook = new IncomingWebhook(webhookUrl, webhookArguments);
  }

  async sendMessage(message: Message): Promise<string> {
    return this.webhook
      .send({
        attachments: [message.render()],
      })
      .then((result) => result.text);
  }
}
