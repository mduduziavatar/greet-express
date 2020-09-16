const assert = require("assert");

describe("the greetings_app test", function() {

    const pg = require("pg");
    const Pool = pg.Pool;
    const connectionString = process.env.DATABASE_URL || 'postgresql://mdu:pg123@localhost:5432/greetings';
    const pool = new Pool({
        connectionString
    });
    const INSERT_QUERY = "insert into greetings (name, counter) values ($1, $2)";

    beforeEach(async function() {
        await pool.query("delete from greetings");
    });

    it("should be able to add names", async function() {

        await pool.query(INSERT_QUERY, ["Mdu", 4]);
        await pool.query(INSERT_QUERY, ["Siphiwe", 7]);

        const results = await pool.query("select count(*) from greetings");

        // how many bookings should have been added?
        assert.equal(0, results.rows[0].count);

    });

    it("should be able to find all bookings", async function() {

        await pool.query(INSERT_QUERY, ["Snowy", 4, "Wednesday"]);
        await pool.query(INSERT_QUERY, ["Spotty", 3, "Friday"]);
        await pool.query(INSERT_QUERY, ["Kitty", 7, "Thursday"]);

        const results = await pool.query("select count(*) from booking");

        // how many bookings should be found?
        assert.equal(0, results.rows[0].count);

    });

    it("should be able to find a booking", async function() {

        await pool.query(INSERT_QUERY, ["Kitty", 7, "Thursday"]);

        const results = await pool.query("select * from booking where name = $1", ["Kitty"]);

        // what fields should have been found in the database?
        assert.equal("", results.rows[0].name);
        assert.equal(0, results.rows[0].staying_for);
        assert.equal("", results.rows[0].arriving_on);

    });

    it("should be able to update a booking", async function() {

        await pool.query(INSERT_QUERY, ["Kitty", 7, "Thursday"]);

        let results = await pool.query("select * from booking where name = $1", ["Kitty"]);

        assert.equal("Kitty", results.rows[0].name);
        assert.equal(7, results.rows[0].staying_for);
        assert.equal("Thursday", results.rows[0].arriving_on);

        await pool.query("update booking set staying_for = $2  where name = $1", ["Kitty", 5]);

        results = await pool.query("select * from booking where name = $1", ["Kitty"]);

        // what new values should have been found
        assert.equal("", results.rows[0].name);
        assert.equal(0, results.rows[0].staying_for);
        assert.equal("", results.rows[0].arriving_on);

    });


    it("should be able to find bookings for 5 days or longer", async function() {

        await pool.query(INSERT_QUERY, ["Snowy", 5, "Wednesday"]);
        await pool.query(INSERT_QUERY, ["Spotty", 3, "Friday"]);
        await pool.query(INSERT_QUERY, ["Kitty", 7, "Thursday"]);

        const results = await pool.query("select count(*) from booking where staying_for >= 5");

        // how many bookings should be found?
        assert.equal(0, results.rows[0].count);

    });

    after(function() {
        pool.end();
    })

});