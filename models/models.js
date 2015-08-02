var path = require('path');

// Postgres
var url 		= 	process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_NAME		=	(url[6] || null);
var user		=	(url[2] || null);
var pwd			=	(url[3] || null);
var protocol	=	(url[1] || null);
var dialect		=	(url[1] || null);
var port		=	(url[5] || null);
var host		=	(url[4] || null);
var storage		=	process.env.DATABASE_STORAGE;

// carga modelo ORM
var Sequelize = require('sequelize');

// usar BBDD SQLite
var sequelize = new Sequelize(DB_NAME, user, pwd, 
		{	dialect: 	protocol,
			protocol: 	protocol,
			port: 		port,
			host: 		host,
			storage: 	storage,
			omitNull: 	true
		}
	);

// importar la definicion de la tabla en quiz.js
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

exports.Quiz = Quiz;

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
	// success(...) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count) {
		if(count === 0) {
			// la tabla se inicializa solo se esta vacia
			Quiz.create({	pregunta: 'Capital de Italia',
						 	respuesta: 'Roma'
						})
			.then(function(){
				console.log('Base de datos inicializada')
			});
		}
	});
});
