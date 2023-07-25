// require the necessary libraries
const { faker } = require('@faker-js/faker/locale/es');
const MongoClient = require("mongodb").MongoClient;
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
async function seedDB() {
    // Connection URL
    const uri = "mongodb+srv://Jemundarain:Cuarentay2@canguromathcluster.azwnjh8.mongodb.net/canguro_math_db?retryWrites=true&w=majority";

    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        // useUnifiedTopology: true,
    });

    try {
        await client.connect();
        console.log("Connected correctly to server");

        const collection_answers = client.db("canguro_math_db").collection("answers");
        const collection_users = client.db("canguro_math_db").collection("users");
        const collection_problems = client.db("canguro_math_db").collection("problems");
        const collection_tests = client.db("canguro_math_db").collection("tests");

        // The drop() command destroys all data from a collection.
        // Make sure you run it against proper database and collection.
        //collection_answers.drop();
        let usernames, problems;
        users = await collection_users.distinct('_id');
        test = await collection_tests.findOne({'_id': new ObjectId("64b9c0d280299f38bed7d3e6")});
        for (let i = 0; i < 16; i++) {
            user = faker.helpers.arrayElement(users);
            problem = test.problems[i];
            option = faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E']);
            answer_time = faker.date.between('2023-02-01T00:00:00.000Z', new Date());
            await collection_answers.insertOne({
                'user': user,
                'problem': problem,
                'option': option,
                'answer_time': answer_time
            });
        }
        setTimeout(() => {client.close()}, 1500)
        console.log("Database seeded! :)");
    } catch (err) {
        console.log(err.stack);
    }
}

seedDB();