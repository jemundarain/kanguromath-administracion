// require the necessary libraries
const { faker } = require('@faker-js/faker/locale/es');
const MongoClient = require("mongodb").MongoClient;

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

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

        const collection = client.db("canguro_math_db").collection("users");

        // The drop() command destroys all data from a collection.
        // Make sure you run it against proper database and collection.
        collection.drop();

        for (let i = 0; i < 1; i++) {
            const registration_date = faker.date.between('2023-01-01T00:00:00.000Z', new Date());
            const sex = faker.helpers.arrayElement(['F', 'M']);
            var name, last_name, country, state, type, level, ci, type_institution;
            sex=='F'? name = faker.name.firstName('female') : name = faker.name.firstName('male');
            sex=='F'? last_name = faker.name.lastName('female') : last_name = faker.name.lastName('male');
            const username = name[0] + last_name;         
            const email = faker.internet.email(name, last_name, 'kanguromath.com');
            const date_birth = faker.date.birthdate({ min: 10, max: 25, mode: 'age' });
            faker.helpers.maybe(() => country = 'venezuela', { probability: 0.8 })
            faker.helpers.maybe(() => country = faker.helpers.arrayElement(["argentina", "bolivia", "brasil", "chile", "colombia", "costa-rica", "cuba", "ecuador", "espana", "el-salvador", "guatemala", "haiti", "honduras", "mexico", "nicaragua", "panama", "paraguay", "peru", "puerto-rico", "republica-dominicana", "uruguay"]), { probability: 0.2 })
            if(country === 'venezuela') {
                state = faker.helpers.arrayElement(["amazonas", "anzoategui", "apure", "aragua", "barinas", "bolivar", "carabobo", "cojedes", "delta-amacuro", "distrito-capital", "falcon", "guarico", "la-guaira", "lara", "merida", "miranda", "monagas", "nueva-esparta", "portuguesa", "sucre", "tachira", "trujillo", "yaracuy", "zulia"]);
            } else {
                state = null;
            }
            const streak_days = faker.datatype.number(100);
            if(date_birth.getFullYear() > 2000) {
                type = 'estudiante';
            } else {
                type = faker.helpers.arrayElement(["profesor", "aficionado"]);
            }
            if(type === 'estudiante' && country === 'venezuela') {
                level = faker.helpers.arrayElement(["1ero", "2do", "3ero", "4to", "5to", "universitario"]);
                if(level != 'universitario') {
                    ci = faker.datatype.number({ min: 4000000, max: 34000000 }).toString();
                } else {
                    ci = null;
                }
                type_institution = faker.helpers.arrayElement(["publico", "privado"]);
            } else {
                level = null;
                ci = null;
                type_institution = null;
            }
            const password = faker.internet.password(12, true);
            await collection.insertOne({
                'registration_date': registration_date,
                'name': name, 
                'last_name': last_name,
                'username': username,
                'email': email,
                'sex': sex,
                'date_birth': date_birth,
                'country': country,
                'state': state,
                'streak_days': streak_days,
                'type': type,
                'level': level,
                'ci': ci,
                'type_institution': type_institution,
                'password': password
            });
        }
        setTimeout(() => {client.close()}, 1500)
        console.log("Database seeded! :)");
    } catch (err) {
        console.log(err.stack);
    }
}

seedDB();