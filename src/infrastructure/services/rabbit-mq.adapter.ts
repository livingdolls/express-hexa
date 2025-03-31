import { MessageBrokerPort } from "../../core/ports/message-brokers.port";
import { Channel } from 'amqplib';
import * as amqp from 'amqp-connection-manager';

export class RabbitMQAdapter implements MessageBrokerPort {
    private connection!: amqp.AmqpConnectionManager; // Definite assignment assertion
    private channelWrapper!: amqp.ChannelWrapper;    // Definite assignment assertion
    private readonly queueName = process.env.QUEUE_IMG_PROCESSING_NAME || 'image_processing';

    constructor(private readonly url: string) {}

    async Connect(): Promise<void> {
        this.connection = amqp.connect([this.url]);
        this.channelWrapper = this.connection.createChannel({
            json: true,
            setup: (channel: Channel) => channel.assertQueue(this.queueName, { durable: true })
        });
    }

    async PublishToQueue(queue: string, message: any): Promise<boolean> { 
        console.log('queue', queue);
        console.log('message', message);
        if (!this.channelWrapper) {
            throw new Error('Channel not initialized. Call Connect() first.');
        }
        return this.channelWrapper.sendToQueue(queue, message, { persistent: true });
    }

    async ConsumeFromQueue(queue: string, callback: (msg: any) => Promise<void>): Promise<void> {
        if (!this.channelWrapper) {
            throw new Error('Channel not initialized. Call Connect() first.');
        }

        console.log('consume', queue);
        
        await this.channelWrapper.consume(queue, async (msg) => {
            if (msg) {
                try {
                    await callback(JSON.parse(msg.content.toString()));
                    this.channelWrapper.ack(msg);
                } catch (err) {
                    console.error('Error processing message:', err);
                    this.channelWrapper.nack(msg, false, false);
                }
            }
        });
    }

    async Close(): Promise<void> {
        if (this.channelWrapper) {
            await this.channelWrapper.close();
        }
        if (this.connection) {
            await this.connection.close();
        }
    }
}