module.exports = function greetFactory(stored) {

    var userMappedData = stored || {};
    const pg = require("pg");
    const Pool = pg.Pool;
    const connectionString = process.env.DATABASE_URL || 'postgresql://siphiwe:pg123@localhost:5432/greetings';
    const pool = new Pool({
        connectionString
    });

     function greetUser(name, language) {
        var regularExpression = /[^A-Za-z]/g;
        var lettersOnly = name.replace(regularExpression, "")
        var item = lettersOnly.charAt(0).toUpperCase() + lettersOnly.slice(1).toLowerCase()
        if (item === "") {
            return ""
        }
       addedUser(item)
        switch (language) {

            case "english":
                return "Hello, " + item;
            case "zulu":
                return "Sawubona, " + item;
            case "sesotho":
                return "Dumela, " + item;
            default:
                return ""
        }

    }

    function addedUser(userName) {
        if (userMappedData[userName] === undefined) {
            userMappedData[userName] = 0;
        }
    }

    function getCounter() {
        return Object.keys(userMappedData).length;
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
        const hello = await pool.query(`select name from greetings`);
        return hello.rows;
    }

    async function perPerson(name) {
        const counter = await pool.query(`select counter from greetings where name = $1`, [name]);
        return counter.rows[0].counter
    }

    async function reset() {
        const reset = await pool.query(`delete from greetings`)
        return reset.rows
    }

    return {
        getAllUsers,
        addToDatabase,
        greetUser,
        getGreetCounter,
        perPerson,
        reset,
        addedUser,
        getCounter
    }
}