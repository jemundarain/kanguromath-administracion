// require the necessary libraries
const { faker } = require('@faker-js/faker/locale/es');
const MongoClient = require("mongodb").MongoClient;

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

        // The drop() command destroys all data from a collection.
        // Make sure you run it against proper database and collection.
        collection_answers.drop();
        let usernames, problems;
        usernames = await collection_users.distinct('username');
        problems = await collection_problems.distinct('_id')
        for (let i = 0; i < 950; i++) {
            user = faker.helpers.arrayElement(usernames);
            problem = faker.helpers.arrayElement(problems);
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