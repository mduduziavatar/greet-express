const assert = require("assert");
let GreetFactoryFunction = require('../greet');


<<<<<<< HEAD
const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://mdu:pg123@localhost:5432/greeting1';
const pool = new Pool({
    connectionString
});

let greetFactory = GreetFactoryFunction(pool);
describe("The getNames function", function() {


    const INSERT_QUERY = "insert into greetings (name, counter) values ($1, $2)";

=======
    const pg = require("pg");
    const Pool = pg.Pool;
    const connectionString = process.env.DATABASE_URL || 'postgresql://siphiwe:pg123@localhost:5432/greeting_test';
    const pool = new Pool({
        connectionString
    });
    const INSERT_QUERY = `insert into greeting_test (name, counter) values ($1, 0)`;
>>>>>>> e97ad8e968da7b7d3227e1be3290e30131263b03
    beforeEach(async function() {
        await pool.query("delete from greetings");
    });

<<<<<<< HEAD

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

=======
    it("should be able to greet siphiwe once", async function() {
        const name = "siphiwe";
        await greetFactory.addToDatabase(name)
        await pool.query(INSERT_QUERY, ["siphiwe"]);
        const results = await pool.query(`select count( * ) from greeting_test `);
        assert.equal(1, results.rows[0].count);
    });

    it("should be able to greet siphiwe multiple times", async function() {
        const name = "siphiwe";
        await greetFactory.addToDatabase(name)
        await pool.query(INSERT_QUERY, ["siphiwe"]);
        await pool.query(INSERT_QUERY, ["siphiwe"]);
        await pool.query(INSERT_QUERY, ["siphiwe"]);
        const results = await pool.query(`select count( * ) from greeting_test `);
        assert.equal(3, results.rows[0].count);
    });

    it("should be able to find a name", async function() {
        const name = "siphiwe";
        await greetFactory.addToDatabase(name)
        await pool.query(INSERT_QUERY, ["siphiwe"]);
        const results = await pool.query(`select * from greeting_test where name = $1`, ["siphiwe"]);
        assert.equal("siphiwe", results.rows[0].name);
    });

    it("should be able to count", async function() {
        const name = "siphiwe";
        await greetFactory.getGreetCounter(name)
        await pool.query(INSERT_QUERY, ["siphiwe"]);
        await pool.query(INSERT_QUERY, ["siphiwe"]);
        await pool.query(INSERT_QUERY, ["siphiwe"]);
        const results = await pool.query("select * from greeting_test where name = $1", ["siphiwe"]);
        assert.equal("siphiwe", results.rows[0].name);
    });

    it("it should be able to counting per person", async function() {
        const name = "siphiwe";
        await greetFactory.perPerson(name)
        await pool.query(INSERT_QUERY, ["siphiwe"]);
        await pool.query(INSERT_QUERY, ["siphiwe"]);
        await pool.query(INSERT_QUERY, ["siphiwe"]);
        const results = await pool.query(`select name from greeting_test where name = $1`, ["siphiwe"]);
        assert.equal("siphiwe", results.rows[0].name);
        //assert.equal(3, results.rows[0].counter);
>>>>>>> e97ad8e968da7b7d3227e1be3290e30131263b03

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