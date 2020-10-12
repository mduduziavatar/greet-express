module.exports = function greetingsRoutes(greetFactory) {
    async function index(req, res, next) {
        try {
            res.render('index');
        } catch (err) {
            next(err)
        }
    }
    async function greet(req, res, next) {
        const name = req.body.textItem;
        const language = req.body.selector;
        const greetedUsers = greetFactory.greetUser(name, language);
        try {
            if (name === "" && language === undefined) {
                req.flash("errors", "please enter a name and select a language ")
            } else if (name === "") {
                req.flash("errors", "please enter a name!");
            } else if (language === undefined) {
                req.flash("errors", "please select a language ");
            } else {
                await greetFactory.addToDatabase(name);
                var count = await greetFactory.getGreetCounter(name);
            }
            res.render('index', {
                txtBox: await greetedUsers,
                counter: count
            });
        } catch (err) {
            next(err);
        }
    }
    async function greeted(req, res, next) {
        var name = req.params.name;

        try {
            const names = await greetFactory.getAllUsers(name)
            res.render('data', {
                name: names
            });

        } catch (err) {
            next(err)
        }
    }
    async function counter(req, res, next) {
        var name = req.params.name;
        try {
            var count = await greetFactory.perPerson(name)
            res.render('counter', {
                name: name,
                counter: count
            })
        } catch (err) {
            next(err)
        }
    }

    async function reset(req, res, next) {
        try {
            var reset = await greetFactory.reset()
            res.render('index')
        } catch (err) {
            next(err)
        }

    }

    return {
        reset,
        index,
        greet,
        counter,
        greeted
    }
}