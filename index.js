const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const GreetFactoryFunction = require('./greet');
const app = express();
const greetFactory = GreetFactoryFunction();
const PORT = process.env.PORT || 3008;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({ layoutsDir: './views/layouts' }));

app.use(express.static('public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.render('index', );
});

app.post("/greet", function(req, res) {
    const item = req.body.textitem
    const language = req.body.selector
    const greetedUsers = greetFactory.greetUser(item, language)

    greetFactory.greetUser(
        req.body.textitem
    );

    greetFactory.greetUser(req.body.textitem)
    console.log(req.body);
    // note that data can be sent to the template
    res.render('index', {
        txtBox: greetedUsers
    });
});


app.listen(PORT, function() {
    console.log('App starting on port', PORT);
});