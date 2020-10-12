const assert = require("assert");
let GreetFactoryFunction = require('../greet');


const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://mdu:pg123@localhost:5432/greeting1';
const pool = new Pool({
    connectionString
});

let greetFactory = GreetFactoryFunction(pool);
describe("The getNames function", function() {


    const INSERT_QUERY = "insert into greetings (name, counter) values ($1, $2)";

    beforeEach(async function() {
        await pool.query("delete from greetings");
    });


    it("should be able to add mdu to the database", async function() {

        var name = 'mdu'

        await greetFactory.addToDatabase(name)

        var allUsers = await greetFactory.getAllUsers()

        // const results = await pool.query(`select count( * ) from greetings `);
        assert.deepEqual([{ name: "Mdu" }], allUsers);
    });

    it("should be able to add multiple names to the database", async function() {

        const name2 = "sphiwe";
        const name3 = "kagiso";
        const name4 = "marko";


        await greetFactory.addToDatabase(name2)
        await greetFactory.addToDatabase(name3)
        await greetFactory.addToDatabase(name4)
        var allUsers = await greetFactory.getAllUsers()

        // const results = await pool.query(`select count( * ) from greetings `);
        assert.deepEqual([{
            name: "sphiwe"
        }], [{
            name: "sphiwe"
        }], [{
            name: "kagiso"
        }], [{
            name: "marko"
        }], allUsers);
    });

    it("should greet Siphiwe in english", async function() {
        assert.equal("Hello, Siphiwe", await greetFactory.greetUser("Siphiwe", "english"));
    });


    it("should show the total number of new users greeted if greeted twice", async function() {

        await greetFactory.greetUser("Siphiwe", "english")
        await greetFactory.greetUser("Kagiso", "english")
        assert.equal(2, await greetFactory.getCounter());
    });

    it("should be able to update the counter for how many times each person has been greeted", async function() {
        const name = "mdu";
        await greetFactory.addToDatabase(name);
        await greetFactory.addToDatabase(name);
        await greetFactory.addToDatabase(name);
        await greetFactory.addToDatabase(name);
        await greetFactory.addToDatabase(name);
        await greetFactory.addToDatabase(name);

        var allUsers = await greetFactory.getAllUsers();
        assert.deepEqual([{
            name: "Mdu"
        }], [{
            name: "Mdu"
        }], [{
            name: "Mdu"
        }], [{
            name: "Mdu"
        }], [{
            name: "Mdu"
        }], [{
            name: "Mdu"
        }], allUsers);
    });
    after(function() {
        pool.end();
    })

});