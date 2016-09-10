This Web UI shows heartbeat status for messages sent with 
[amqp-heartbeat package](https://www.npmjs.com/package/amqp-heartbeat) 
to RabbitMA and collected via
[amqp-heartbeat-to-mongodb package](https://www.npmjs.com/package/amqp-heartbeat-to-mongodb)
to a MongoDB.

## Full Set Up

### MongoDB (Docker)

    docker pull mongo
    docker run --name mongodb -p 27017:27017 -d mongo
    
### Service With Heartbeat

See [amqp-heartbeat example](https://github.com/ma-ha/amqp-heartbeat) 
    
### Heartbeat-To-MongoDB Service

See [amqp-heartbeat package](https://github.com/ma-ha/amqp-heartbeat-to-mongodb) 

### Heartbeat Web UI

   node index.js --mongoHost=localhost 
   