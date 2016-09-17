var gui = require( 'easy-web-app' ) 
var log = require( 'npmlog' )
var MongoClient = require( 'mongodb' ).MongoClient, assert = require( 'assert' )
var dateFormat  = require('dateformat')
var pjson = require('./package.json');

//----------------------------------------------------------------------------
// evaluate arguments
var argv = require('minimist')(process.argv.slice(2));

var mongoHost = 'mongo'
var mongoDB   = 'dashboard'
if ( argv[ 'mongoHost' ] ) { mongoHost = argv[ 'mongoHost' ] }
if ( argv[ 'mongoDB' ]   ) { mongoDB   = argv[ 'mongoDB' ] }
var mongoDbURL  = 'mongodb://'+mongoHost+':27017/'+mongoDB

// ----------------------------------------------------------------------------
// define the GUI  page
var mainPage = gui.init( 'Service Heartbeats', 8888, '/heartbeat' )
mainPage.title = 'Home'
mainPage.addView( 
  { 
  	id:    'ServiceStatus', 
  	title: 'Services', 
  	type:  'pong-easytable', 
  	resourceURL: '/heartbeat/services' 
  }, 
	{
    dataURL:'',
    pollDataSec: "5",
    easyCols:
      [
        'Health=light|5%',
        'Service~Name=name',
        'Version=version',
        'Check=check',
        'Service~Status=status',
        'Checking~since=started'
      ]
  } 
)

mainPage.footer.copyrightText = 
	'Dashboard v'+pjson.version+ ", "+mainPage.footer.copyrightText 

var svc  = gui.getExpress();

svc.get( 
	  '/services', 
	  function( req, res ) {
	  	//log.info( 'services','start')
			MongoClient.connect( mongoDbURL, function( err, db ) {
				if ( ! err ) {
				  db.collection( 'services' ).find( {} ).toArray( 
				  	function( err, docs ) {
				  		var svc = { MongoDB:{ alive: 1, started:0 } }
				  		var now = Date.now()
				  		for ( var i in docs ) {
				  			//log.info( 'services', docs[i].serviceName )
				  			if ( ! svc[ docs[i].serviceName ] ) {
				  				svc[ docs[i].serviceName ] = 
				  					{ 
				  						alive:   0,
				  						newest:  0,
				  						check:   'never started',
				  						status:  '',
				  						version: '',
				  						started: 0
				  					}
				  			}
				  			if ( svc[ docs[i].serviceName ].newest < docs[i].heartbeatTime )  {
				  				svc[ docs[i].serviceName ].newest  = docs[i].heartbeatTime
				  				svc[ docs[i].serviceName ].version = docs[i].serviceVersion 
				  				svc[ docs[i].serviceName ].started = docs[i].serviceStart
				  				svc[ docs[i].serviceName ].status  = docs[i].status
				  				//log.info( 'x', docs[i] )
				  			}			  			
				  		}
				  		for ( var s in svc ) {
				  			if ( svc[ s ].newest ) {
				  				//log.info( s, now +' - '+ svc[ s ].newest+' = ' +( now - svc[ s ].newest) )
				  				if (  now - svc[ s ].newest >  20*1000 ) {
				  					svc[ s ].check =  'dead since '+dateFormat( svc[ s ].newest , "dd.mm.yyyy, HH:MM:ss " )
				  				} else {
				  					svc[ s ].alive = svc[ s ].alive + 1
				  				}
				  			}
				  		}
				  		
				  		var svcHealth = []
				  		for ( var i in svc ) {
				  			var s = 
				  				{ 
				  					name   : i, 
				  					check  : '', 
				  					version: svc[ i ].version, 
				  					status : svc[ i ].status, 
				  					light  : '<span style="color:#444;">--</span>', 
				  					started: '' 
				  				}
				  			if ( svc[i].alive == 1 ) {
				  				s.check = 'Service OK'
				  				s.light = '<span style="color:#0C0;">OK</span>'
				  				if ( svc[ i ].started  ) { 
					  				s.started = dateFormat( svc[ i ].started , "dd.mm.yyyy, HH:MM:ss " )			  					
				  				} 
				  			} else if ( svc[i].alive > 1 ) {
				  				s.check = 'Service OK and in HA '
				  				s.light = '<span style="color:#0F0;">HA</span>'
				  				if ( svc[ i ].started  ) { 
				  					s.started = dateFormat( svc[ i ].started , "dd.mm.yyyy, HH:MM:ss " )
				  				}
				  			} else {
				  				s.check = svc[i].stat 
				  				s.light = '<span style="color:#F00;">no&nbsp;heartbeart</span>'
				  			}
				  			svcHealth.push( s )
				  		}
				  		res.json( svcHealth ) 
						  db.close()
				  	} 
				  )
				} else {
					log.error( "service", 'can not connect to MongoDB "'+mongoDbURL+'": '+err )
					res.json( {} ) 
				}
			} )
	  }
	)