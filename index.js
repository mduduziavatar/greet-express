const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const GreetFactoryFunction = require('./greet');
const app = express();
// app flash setups 
const flash = require('express-flash');
const session = require('express-session')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

const pg = require("pg");
const Routes = require('./routes');
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://mdu:pg123@localhost:5432/greetings';
const pool = new Pool({
    connectionString
});

const greetFactory = GreetFactoryFunction(pool);
const routes = Routes(greetFactory)

app.use(flash());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//sending back home
app.get('/', routes.index);

//greet app setup
app.post("/greet", routes.greet);

app.get('/data', routes.greeted);

app.get('/counter/:name', routes.counter);

app.get('/reset', routes.reset);


const PORT = process.env.PORT || 3008;


app.listen(PORT, function() {
    console.log('App starting on port', PORT);
});