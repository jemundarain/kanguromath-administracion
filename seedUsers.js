// require the necessary libraries
const { faker } = require('@faker-js/faker/locale/es');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

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

        const collection = client.db("canguro_math_db").collection("users");

        // The drop() command destroys all data from a collection.
        // Make sure you run it against proper database and collection.
        collection.drop();

        for (let i = 0; i < 17561; i++) { //17561
            const registration_date = faker.date.between('2023-02-22T00:00:00.000Z', new Date());
            const sex = faker.helpers.arrayElement(['F', 'M']);
            var name, last_name, country, state, type, level, type_institution, in_progress, t_remain_s;
            sex=='F'? name = faker.name.firstName('female') : name = faker.name.firstName('male');
            sex=='F'? last_name = faker.name.lastName('female') : last_name = faker.name.lastName('male');
            const username = name[0] + last_name;         
            const email = faker.internet.email(name, last_name, 'kanguromath.com');
            const date_birth = faker.date.birthdate({ min: 10, max: 25, mode: 'age' });
            faker.helpers.maybe(() => country = 'VE', { probability: 0.9 })
            faker.helpers.maybe(() => country = faker.helpers.arrayElement(["AR", "BO", "CL", "CO", "CR", "CU", "EC", "US", "SV", "ES", "GT", "GQ", "HN", "MX", "NI", "PA", "PY", "PE", "PR", "DO", "UY"]), { probability: 0.1 })
            if(country === 'VE') {
                state = faker.helpers.arrayElement(["amazonas", "anzoategui", "apure", "aragua", "barinas", "bolivar", "carabobo", "cojedes", "delta-amacuro", "distrito-capital", "falcon", "guarico", "la-guaira", "lara", "merida", "miranda", "monagas", "nueva-esparta", "portuguesa", "sucre", "tachira", "trujillo", "yaracuy", "zulia"]);
            } else {
                state = null;
            }
            const streak_days = faker.datatype.number(10);
            if(date_birth.getFullYear() > 2000) {
                type = 'estudiante';
            } else {
                type = faker.helpers.arrayElement(["profesor", "aficionado"]);
            }
            if(type === 'estudiante' && country === 'VE') {
                level = faker.helpers.arrayElement(["1ero", "2do", "3ero", "4to", "5to", "universitario"]);
                type_institution = faker.helpers.arrayElement(["publica", "privada"]);
            } else {
                level = null;
                type_institution = null;
            }
            const password = faker.internet.password(12, true);

            const achievement = faker.helpers.arrayElement(["1año-racha", "1mes-racha", "1prueba-practica", "1prueba-simulacion", "1semana-racha", "4categorias", "6meses-racha", "10problemas", "foto-perfil"]);
            const percentage = faker.datatype.float({ min: 0, max: 1, precision: 0.01 })

            const mode = faker.helpers.arrayElement(["practica", "simulacion"]);
            if(mode == 'simulacion') {
                in_progress = faker.datatype.boolean();
                t_remain_s = Math.round(faker.datatype.float({ min: 0, max: 6300 }));
            } else {
                in_progress = false;
                t_remain_s = 0;
            }

            await collection.insertOne({
                'registration_date': registration_date,
                'name': name, 
                'last_name': last_name,
                'username': username,
                'email': email,
                'password': password,
                'sex': sex,
                'date_birth': date_birth,
                'country': country,
                'state': state,
                'streak_days': streak_days,
                'type': type,
                'level': level,
                'type_institution': type_institution,
                'achieves': [],
                'submits': [],
                'goal': 1,
                'reminder_hour': new Date()
            });
        }
        setTimeout(() => {client.close()}, 1500)
        console.log("Database seeded! :)");
    } catch (err) {
        console.log(err.stack);
    }
}

seedDB();