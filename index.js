const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const GreetFactoryFunction = require('./greet');
const app = express();
const greetFactory = GreetFactoryFunction();
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
app.get('/', async function (req, res) {
    res.render('index');
});

//greet app setup
app.post("/greet", async function (req, res) {
    const name = req.body.textItem;
    const language = req.body.selector;
    const greetedUsers = greetFactory.greetUser(name, language);
    if (name === "" && language === undefined) {
        req.flash("errors", "please enter a name and select a language ");
    } else if (name === "") {
        req.flash("errors", "please enter a name!");
    } else if (language === undefined) {
        req.flash("errors", "please select a language ");
    } else {
        await greetFactory.addToDatabase(name);
        var count = await greetFactory.getGreetCounter(name);
    }



    console.log(greetedUsers);
    res.render('index', {
        txtBox: await greetedUsers,
        counter: count
    });
});

app.get('/data', async function (req, res) {
    var name = req.params.name;

    var data = {
        name: await greetFactory.getAllUsers(name),
    }

    res.render('data', data);
});

app.get('/counter/:name', async function (req, res) {
    var name = req.params.name;
    var count = await greetFactory.perPerson(name)
    res.render('counter', {
        name: name,
        counter: count
    })
});

app.get('/reset', async function (req, res) {
    var reset = await greetFactory.reset()
    res.render('index')
});

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});