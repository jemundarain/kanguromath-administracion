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

        for (let i = 0; i < 17561; i++) { //17561
            const registration_date = faker.date.between('2023-02-01T00:00:00.000Z', new Date());
            const sex = faker.helpers.arrayElement(['F', 'M']);
            var name, last_name, country, state, type, level, ci, type_institution, in_progress, t_remain_s;
            sex=='F'? name = faker.name.firstName('female') : name = faker.name.firstName('male');
            sex=='F'? last_name = faker.name.lastName('female') : last_name = faker.name.lastName('male');
            const username = name[0] + last_name;         
            const email = faker.internet.email(name, last_name, 'kanguromath.com');
            const date_birth = faker.date.birthdate({ min: 10, max: 25, mode: 'age' });
            faker.helpers.maybe(() => country = 'venezuela', { probability: 0.9 })
            faker.helpers.maybe(() => country = faker.helpers.arrayElement(["argentina", "bolivia", "brasil", "chile", "colombia", "costa-rica", "cuba", "ecuador", "espana", "el-salvador", "guatemala", "haiti", "honduras", "mexico", "nicaragua", "panama", "paraguay", "peru", "puerto-rico", "republica-dominicana", "uruguay"]), { probability: 0.1 })
            if(country === 'venezuela') {
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

            const achievement = faker.helpers.arrayElement(["foto-perfil", "10-problemas", "1era-prueba", "1semana-racha", "cada-categoria", "1prueba-simulacion", "1mes-racha", "6meses-racha", "1ano-racha"]);
            const percentage = faker.datatype.float({ min: 0, max: 1, precision: 0.01 }) 

            const test = faker.helpers.arrayElement(["preliminar-2010-1ero-2do", "preliminar-2010-3ero", "preliminar-2013-1ero-2do", "preliminar-2013-1ero-2do", "preliminar-2011-1ero-2do"]);
            const mode = faker.helpers.arrayElement(["practica", "simulacion"]);
            if(mode == 'simulacion') {
                in_progress = faker.datatype.boolean();
                t_remain_s = faker.datatype.float({ min: 0, max: 6300 });
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
                'sex': sex,
                'date_birth': date_birth,
                'country': country,
                'state': state,
                'streak_days': streak_days,
                'type': type,
                'level': level,
                'ci': ci,
                'type_institution': type_institution,
                'password': password,
                'achieves': {
                    'achievement': achievement,
                    'percentage': percentage
                },
                'submit': {
                    'test': test,
                    'mode': mode,
                    'in_progress': in_progress,
                    't_remain_s': t_remain_s
                }
            });
        }
        setTimeout(() => {client.close()}, 1500)
        console.log("Database seeded! :)");
    } catch (err) {
        console.log(err.stack);
    }
}

seedDB();