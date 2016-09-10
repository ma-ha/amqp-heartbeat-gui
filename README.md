This Web UI shows heartbeat status for messages sent with 
[amqp-heartbeat package](https://www.npmjs.com/package/amqp-heartbeat) 
to RabbitMA and collected via
[amqp-heartbeat-to-mongodb package](https://www.npmjs.com/package/amqp-heartbeat-to-mongodb)
to a MongoDB.

## Full Set Up

### MongoDB (Docker)

    docker pull mongo
    docker run --name my-mongo -p 27017:27017 -d mongo
	
### RabbitMQ (Docker)

    docker pull rabbitmq
    docker run -d --hostname my-rabbit --name some-rabbit -p 5672:5672 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=user -e RABBITMQ_DEFAULT_PASS=password rabbitmq
    
### Service With Heartbeat

TODO    
    
### Heartbeat-To-MongoDB Service

TODO

### Heartbeat Web UI

   node index.js --mongoHost=localhost 
   