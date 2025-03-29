export interface MessageBrokerPort {
    Connect(): Promise<void>;
    PublishToQueue(queue: string, message: any):  Promise<Boolean>;
    ConsumeFromQueue(queue: string, callback: (msg: any) => Promise<void>): Promise<void>;
    Close(): Promise<void>
}