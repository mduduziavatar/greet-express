const assert = require("assert");
let GreetFactoryFunction = require('../greet')
const greetFactory = GreetFactoryFunction();

describe("the greetings_app database test", function() {

    const pg = require("pg");
    const Pool = pg.Pool;
    const connectionString = process.env.DATABASE_URL || 'postgresql://mdu:pg123@localhost:5432/greetings';
    const pool = new Pool({
        connectionString
    });
    const INSERT_QUERY = `insert into greetings (name, counter) values ($1, $2)`;

    beforeEach(async function() {
        await pool.query("delete from greetings");
    });

    it("should be able to greet Mdu once", async function() {
        const name = "Mdu";
        const counter = 1;
        await greetFactory.greetUser(name, counter)
        await pool.query(INSERT_QUERY, ["Mdu", 1]);
        const results = await pool.query(`select count( * ) from greetings `);
        assert.equal(1, results.rows[0].count);
    });

    it("should be able to greet Mdu multiple times", async function() {
        const name = "Mdu";
        const counter = 0;
        await greetFactory.greetUser(name, counter)
        await pool.query(INSERT_QUERY, ["Mdu", 1]);
        await pool.query(INSERT_QUERY, ["Mdu", 2]);
        await pool.query(INSERT_QUERY, ["Mdu", 3]);
        const results = await pool.query(`select count( * ) from greetings `);
        assert.equal(3, results.rows[0].count);
    });

    it("should be able to find a name", async function() {
        const name = "Mdu";
        const counter = 0;
        await greetFactory.greetUser(name, counter)
        await pool.query(INSERT_QUERY, ["Mdu", 0]);
        const results = await pool.query(`select * from greetings where name = $1`, ["Mdu"]);
        assert.equal("Mdu", results.rows[0].name);
    });

    it("should be able to count", async function() {
        const name = "Mdu";
        const counter = 0;
        await pool.query(INSERT_QUERY, ["Mdu", 3]);
        const results = await pool.query("select * from greetings where name = $1", ["Mdu"]);
        assert.equal("Mdu", results.rows[0].name);
        assert.equal(3, results.rows[0].counter);
    });

    it("should be able to update a counter", async function() {
        const name = "Mdu";
        const counter = 7;
        await greetFactory.getGreetCounter(name, counter)
        await pool.query(INSERT_QUERY, ["Mdu", 7]);
        let results = await pool.query("select * from greetings where name = $1", ["Mdu"]);
        //checking initial values
        assert.equal("Mdu", results.rows[0].name);
        assert.equal(7, results.rows[0].counter);
        //updating to new values
        await pool.query("update greetings set counter = $2  where name = $1", ["Mdu", 5]);
        results = await pool.query("select * from greetings where name = $1", ["Mdu"]);
        //new values should have been found
        assert.equal("Mdu", results.rows[0].name);
        assert.equal(5, results.rows[0].counter);
    });
    after(function() {
        pool.end();
    })

});