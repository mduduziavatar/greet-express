module.exports = function greetFactory(stored) {

    var userMappedData = stored || {};

    function greetUser(item, language) {
        var regularExpression = /[^A-Za-z]/g;
        var lettersOnly = item.replace(regularExpression, "")
        var name = lettersOnly.charAt(0).toUpperCase() + lettersOnly.slice(1).toLowerCase()

        addedUser(item);
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

    function addedUser(userName) {
        if (userMappedData[userName] === undefined) {
            userMappedData[userName] = 0;
        } else {
            userMappedData[userName]++;
        }
        return userMappedData[userName]
    }

    function getGreetCounter() {
        return Object.keys(userMappedData).length;
    }

    function getNameFromInput(textBoxValue) {

        if (textBoxValue !== "") {


            return name;
        }
        return "";
        z
    }

    function getAllUsers() {
        // this is for local storage
        return userMappedData;
    }

    function resetBtn() {
        userMappedData = {};
    }


    return {
        greetUser,
        getGreetCounter,
        getNameFromInput,
        getAllUsers,
        resetBtn,
        addedUser
    }
}