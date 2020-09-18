module.exports = function greetFactory() {
    const pg = require("pg");
    const Pool = pg.Pool;
    const connectionString = process.env.DATABASE_URL || 'postgresql://mdu:pg123@localhost:5432/greetings';
    const pool = new Pool({
        connectionString
    });

    async function greetUser(name, language) {

        switch (language) {
            case "english":
                return "Hello, " + name;
            case "zulu":
                return "Sawubona, " + name;
            case "sesotho":
                return "Dumela, " + name;
            default:
                return ""
        }
    }

    async function addToDatabase(name) {
        var regularExpression = /[^A-Za-z]/g;
        var lettersOnly = name.replace(regularExpression, "")
        var item = lettersOnly.charAt(0).toUpperCase() + lettersOnly.slice(1).toLowerCase()
        const checker = await pool.query(`select id from greetings where name = $1`, [item])
        if (checker.rowCount === 0) {
            await pool.query(`insert into greetings (name, counter) values ($1, 0)`, [item]);
        }
        await pool.query(`update greetings set counter = counter+1 where name = $1`, [item])
    }

    async function getGreetCounter() {
        const count = await pool.query(`select count(*) as count from greetings`)
        return count.rows[0].count;
    }

    async function getAllUsers() {
        // this is for db 
        const hello = await pool.query(`select name from greet`);
        return hello.rows;
    }

    return {
        getAllUsers,
        addToDatabase,
        greetUser,
        getGreetCounter
    }
}