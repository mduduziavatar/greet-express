const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const GreetFactoryFunction = require('./greet');
const app = express();
const greetFactory = GreetFactoryFunction();
const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://mdu:pg123@localhost:5432/greetings';
const pool = new Pool({
    connectionString
});
const PORT = process.env.PORT || 3008;
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
app.use(flash());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//sending back home
app.get('/', async function(req, res) {
    res.render('index', { counter: await greetFactory.getCounterForUsers });
});

// app.get("/api/greetings", async function(req, res) {
//     const hello = await greetFactory.greetUser();
//     res.send(hello);
// });
//greet app setup
app.post("/greet", async function(req, res) {
    const item = req.body.textitem
    const language = req.body.selector
    const greetedUsers = greetFactory.greetUser(item, language)
    if (item === "") {
        req.flash('errors', 'please enter a name and select a language');
    }
    const count = greetFactory.getGreetCounter(req.body);
    console.log(greetedUsers);
    res.render('index', {
        txtBox: await greetedUsers,
        counter: await count
    });
});

app.listen(PORT, function() {
    console.log('App starting on port', PORT);
});