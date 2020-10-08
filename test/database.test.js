const assert = require("assert");
let GreetFactoryFunction = require('../greet')
const greetFactory = GreetFactoryFunction();

describe("the greetings_app database test", function() {

    const pg = require("pg");
    const Pool = pg.Pool;
    const connectionString = process.env.DATABASE_URL || 'postgresql://mdu:pg123@localhost:5432/greeting_test';
    const pool = new Pool({
        connectionString
    });
    const INSERT_QUERY = `insert into greeting_test (name, counter) values ($1, 0)`;
    beforeEach(async function() {
        await pool.query("delete from greeting_test");
    });

    it("should be able to greet Mdu once", async function() {
        const name = "Mdu";
        await greetFactory.addToDatabase(name)
        await pool.query(INSERT_QUERY, ["Mdu"]);
        const results = await pool.query(`select count( * ) from greeting_test `);
        assert.equal(1, results.rows[0].count);
    });

    it("should be able to greet Mdu multiple times", async function() {
        const name = "Mdu";
        await greetFactory.addToDatabase(name)
        await pool.query(INSERT_QUERY, ["Mdu"]);
        await pool.query(INSERT_QUERY, ["Mdu"]);
        await pool.query(INSERT_QUERY, ["Mdu"]);
        const results = await pool.query(`select count( * ) from greeting_test `);
        assert.equal(3, results.rows[0].count);
    });

    it("should be able to find a name", async function() {
        const name = "Mdu";
        await greetFactory.addToDatabase(name)
        await pool.query(INSERT_QUERY, ["Mdu"]);
        const results = await pool.query(`select * from greeting_test where name = $1`, ["Mdu"]);
        assert.equal("Mdu", results.rows[0].name);
    });

    it("should be able to count", async function() {
        const name = "Mdu";
        await greetFactory.getGreetCounter(name)
        await pool.query(INSERT_QUERY, ["Mdu"]);
        await pool.query(INSERT_QUERY, ["Mdu"]);
        await pool.query(INSERT_QUERY, ["Mdu"]);
        const results = await pool.query("select * from greeting_test where name = $1", ["Mdu"]);
        assert.equal("Mdu", results.rows[0].name);
    });

    it("it should be able to counting per person", async function() {
        const name = "Mdu";
        await greetFactory.perPerson(name)
        await pool.query(INSERT_QUERY, ["Mdu"]);
        await pool.query(INSERT_QUERY, ["Mdu"]);
        await pool.query(INSERT_QUERY, ["Mdu"]);
        const results = await pool.query(`select name from greeting_test where name = $1`, ["Mdu"]);
        assert.equal("Mdu", results.rows[0].name);
        //assert.equal(3, results.rows[0].counter);


    });
    after(function() {
        pool.end();
    })

});