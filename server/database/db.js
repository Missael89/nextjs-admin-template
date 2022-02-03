const mysql = require('mysql');

const db_config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.BD_DATABASE,
};

var connection = mysql.createConnection(db_config);

connection.connect((err) => {
    if (err) {
        console.log('error when connecting to db:', err);
        connection = reconnect(connection);
    } else {
        console.log('Connection Success!');
    }
    
});

//- Reconnection function
function reconnect(connection){
    console.log("\n New connection tentative...");

    //- Destroy the current connection variable
    if(connection) connection.destroy();

    //- Create a new one
    var connection = mysql.createConnection(db_config);

    //- Try to reconnect
    connection.connect(function(err){
        if(err) {
            //- Try to connect every 2 seconds.
            setTimeout(reconnect, 2000);
        }else {
            console.log("\n\t *** New connection established with the database. ***")
            return connection;
        }
    });
}

//- Error listener
connection.on('error', (err) => {

    //- The server close the connection.
    if(err.code === "PROTOCOL_CONNECTION_LOST"){    
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        connection = reconnect(connection);
    }

    //- Connection in closing
    else if(err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        connection = reconnect(connection);
    }

    //- Fatal error : connection variable must be recreated
    else if(err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        connection = reconnect(connection);
    }

    //- Error because a connection is already being established
    else if(err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
    }

    //- Anything else
    else{
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        connection = reconnect(connection);
    }

});


module.exports = connection;