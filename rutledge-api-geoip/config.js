module.exports = {
	'secret': 'xuanlv',
  'localhost':'127.0.0.1',
  'api_port':9002,
  'socket_port':9003,
  'brokerPort': 'tcp://172.16.0.72:1883',
  'username': 'admin',
  'password': 'admin',
  "db_conn": {
    "production": {
      connectionLimit : 100,
      host     : '192.168.99.100',
      user     : 'root',
      password : 'oratojii',
      database : 'rutledge',
      debug    :  false
    },
    "development": {
      connectionLimit : 100,
      host     : '172.16.0.69',
      user     : 'root',
      password : 'root',
      database : 'rutledge-geoip',
      debug    :  false
    }
  },
  'mailerConfig': {
      host: '172.16.0.69',
      port: 1025,
      secure: false
  }
};

