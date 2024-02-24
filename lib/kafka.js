const { Kafka } = require('kafkajs')

class KafkaService {
    constructor() {
        this.kafka = new Kafka({
            clientId: 'referess',
            brokers: ['localhost:9092']
        })
        this.producer = this.kafka.producer()
        this.consumer = this.kafka.consumer({ groupId: 'test-group' })
    }

    async init() {
        await this.producer.connect({
            clientId: 'referess-producer'
            
        })
        await this.consumer.connect()
    }

    async createTopic(topic) {
        const admin = this.kafka.admin()
        await admin.connect()
        await admin.createTopics({
            topics: [{ topic }]
        })
        await admin.disconnect()
    }

    async produceMessage(topic, message) {
        await this.producer.send({
            topic,
            messages: [{ value: message }]
        })
    }

    async consumeMessage(topic, callback) {
        await this.consumer.subscribe({ topic, fromBeginning: true })
        await this.consumer.run({
            eachMessage: async ({ message }) => {
                callback({
                    value: message.value.toString(),
                    timestamp: message.timestamp,
                    headers: message.headers
                
                })
            }
        })
    }
}

module.exports = KafkaService;
