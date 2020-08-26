let assert = require("assert")
let greetFactory = require("../greet");
let item = greetFactory()

describe("The greetUser function", function() {
    it("should greet Siphiwe in english", function() {
        item = greetFactory()
        assert.equal("Hello, Siphiwe", item.greetUser("Siphiwe", "english"));
    });
    it("should greet Siphiwe in sesotho", function() {
        item = greetFactory()
        assert.equal("Dumela, Siphiwe", item.greetUser("Siphiwe", "sesotho"));
    });
    it("should greet Siphiwe in zulu", function() {
        item = greetFactory()
        assert.equal("Sawubona, Siphiwe", item.greetUser("Siphiwe", "zulu"));
    });
});

describe("The getGreetCounter function", function() {
    it("should return the total number of users greeted starting from zero", function() {
        item = greetFactory();
        assert.equal(0, item.getGreetCounter());
    });
    it("should return the total number of users greeted if greeted twice", function() {
        item = greetFactory();
        item.greetUser("Siphiwe", "english")
        item.greetUser("Kagiso", "english")
        assert.equal(2, item.getGreetCounter());
    });
});

describe("The getAllUsers function", function() {
    it("should return the object of all users greeted on local storage", function() {
        item = greetFactory();
        item.greetUser("Siphiwe", "zulu");
        item.greetUser("Kagiso", "english");
        assert.deepEqual({ "Siphiwe": 0, "Kagiso": 0 }, item.getAllUsers());
    });

    it("should return one if clicked one for Siphiwe in english", function() {
        item = greetFactory();
        item.greetUser("Siphiwe", "english")
        assert.equal(1, item.getGreetCounter());
    });
});

describe("The getNameFromInput function", function() {
    it("should return a name without numbers or special characters", function() {
        item = greetFactory()
        assert.equal("Siphiwe", item.getNameFromInput("si455ph55i1w2e21321321321"));
        assert.equal("Marko", item.getNameFromInput("m9a9r9k9o3344454432"));
        assert.equal("", item.getNameFromInput(""));
    });
});