import { MessageBrokerPort } from "../../core/ports/message-brokers.port";
import { Channel } from 'amqplib';
import * as amqp from 'amqp-connection-manager';

export class RabbitMQAdapter implements MessageBrokerPort {
    private connection!: amqp.AmqpConnectionManager; // Definite assignment assertion
    private channelWrapper!: amqp.ChannelWrapper;    // Definite assignment assertion
    private readonly queueName = process.env.QUEUE_IMG_PROCESSING_NAME || 'image_processing';

    constructor(private readonly url: string) {}

    async Connect(): Promise<void> {
    try {
        this.connection = amqp.connect(this.url);
        console.log('Connected to RabbitMQ');

        this.connection.on('close', (err) => {
            console.error('Connection closed:', err?.message);
        });

        this.connection.on('error', (err) => {
            console.error('Connection error:', err.message);
        });

        this.channelWrapper = this.connection.createChannel({
            json: true,
            setup: async (channel: Channel) => {
                console.log('Setting up channel...');
                await channel.assertQueue(this.queueName, { 
                    durable: true 
                });
                console.log(`Queue ${this.queueName} ready in vhost /`);
            }
        });

        // Verifikasi queue setelah setup
        await this.channelWrapper.waitForConnect();
        console.log('Channel setup completed');
    } catch (error) {
        console.error('Connection failed:', error);
        throw error;
    }
}

    async PublishToQueue(queue: string, message: any): Promise<boolean> { 
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