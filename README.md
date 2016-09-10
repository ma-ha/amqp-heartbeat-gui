This little Web UI shows heartbeat status for messages sent with 
[amqp-heartbeat package](https://www.npmjs.com/package/amqp-heartbeat) 
to RabbitMA and collected via
[amqp-heartbeat-to-mongodb package](https://www.npmjs.com/package/amqp-heartbeat-to-mongodb)
to a MongoDB. 

![demo screen shot](http://bit.ly/heartbeat_web_ui) 
 
This is more a demo, how to start a Web GUI for heartbating services.
 
The GUI uses the [Easy-Web-App Node.js package](https://www.npmjs.com/package/easy-web-app). 
Please check the docu there, how to add security or change the view or add pages and functionality. 

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
   
Open the URL http://localhost:8888/heartbeat/index.html in your browser.
