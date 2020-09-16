module.exports = function greetFactory() {
    const pg = require("pg");
    const Pool = pg.Pool;
    const connectionString = process.env.DATABASE_URL || 'postgresql://mdu:pg123@localhost:5432/greetings';
    const pool = new Pool({
        connectionString
    });

    var userMappedData = {};

    async function greetUser(item, language) {
        var regularExpression = /[^A-Za-z]/g;
        var lettersOnly = item.replace(regularExpression, "")
        var name = lettersOnly.charAt(0).toUpperCase() + lettersOnly.slice(1).toLowerCase()
        if (await verifyUser(name)) {
            await setCounterForUsers(name)
        } else {
            await addToDatabase(name)
        }
        // addedUser(name);
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
        await pool.query(`insert into greetings(name, counter) values ($1, $2)`, [name, 0]);
    }

    async function verifyUser(item) {
        const working = await pool.query(`select * from greetings where name = $1`, [item]);
        // incrementing rows everytime new user is added 
        if (working.rowCount == 0) {
            return false
        } else {
            return true
        }
    }

    async function setCounterForUsers(item) {
        const count = await getCounterForUsers(item) + 1;
        await pool.query(`update greetings set counter = ${count} where name = $1`, [item]);
    }

    async function getCounterForUsers(item) {
        const count = await pool.query(`select * from greetings where name = $1`, [item]);
        return count.rows[0].counter
    }

    function getGreetCounter() {
        return Object.keys(userMappedData).length;
    }

    async function getAllUsers() {
        // this is for local storage
        const hello = await pool.query(`
                    select id, name, counter as "counter"
                    from greetings `);
        return hello.rows;
        //return userMappedData;
    }

    function resetBtn() {
        userMappedData = {};
    }

    return {
        getCounterForUsers,
        verifyUser,
        getAllUsers,
        addToDatabase,
        setCounterForUsers,
        greetUser,
        getGreetCounter,
        getAllUsers,
        resetBtn,
    }
}