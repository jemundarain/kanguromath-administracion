var express = require('express');
const UserModel = require('../schemas/user-schema');
const dayjs = require('dayjs')
// const bcrypt = require('bcryptjs');

var app = express();

// app.post('/post_user/', (req, res) => {
// 	var body = req.body;
// 	var user = new UserModel({
// 	  name: body.name,
// 	  last_name: body.last_name,
// 	  username: body.name[0] + body.last_name,
// 	  email: body.email,
// 	  sex: body.sex,
// 	  date_birth: body.date_birth,
// 	  country: body.country,
// 	  state: body.state,
// 	  streak_days: 0,
// 	  type: body.type,
// 	  level: body.level,
// 	  ci: body.ci,
// 	  type_institution: body.type_institution,
// 	  password: bcrypt.hashSync(body.password, 10),
// 	  achieves: [],
// 	  submit: [],
// 	  reminder_hour: body.reminder_hour
// 	});
  
// 	user.save()
// 	  .then((newUser) => {
// 		res.status(201).json(newUser);
// 	  })
// 	  .catch((err) => {
// 		res.status(400).json(err);
// 	  });
// });  

app.get('/get_distribution', async (req, res, next) => {
    try {
        var startD = dayjs(req.query.start);
        const endD = dayjs(req.query.end);

        const promises = [];

        while (startD.format('YYYY-MM-DD') !== endD.add(1, 'day').format('YYYY-MM-DD')) {
            const endD_aux = startD.add(1, 'day');
            const promise = UserModel.find({ 'registration_date': { $gte: startD.format('YYYY-MM-DD'), $lte: endD_aux.format('YYYY-MM-DD') } }).count();
            promises.push(promise);

            startD = startD.add(1, 'day');
        }

        const results = await Promise.all(promises);
        const arr = results.map((data) => data || 0);

        res.json(arr);
    } catch (error) {
        console.log('Error fetching entries /usuarios', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/get_total',(req, res) => {
	UserModel.find({ 'registration_date': {$gte: new Date(req.query.start), $lt: new Date(req.query.end)}}).count()
	  .then((quantity) => {
		res.status(200).json(quantity)
	   })
	  .catch((err) => {
        res.status(500).json(err);
	  })
})

app.get('/get_minimum_date',(req, res, next) => {
	UserModel.findOne({}, {'_id': 0, 'registration_date': 1}).sort({'registration_date': 1}).limit(1)
	  .then((user) => {
	  	res.json(user.registration_date);
	  })
	  .catch(() => {
        res.status(500).json(err);
	  })
})

app.get('/get_ranking', (req, res, next) => {
	UserModel.aggregate([{$match:{"type":"estudiante", "level": {"$ne": "universitario"}, "country": "venezuela"}}, {$group : { _id : '$state', count : {$sum : 1}}}])
	  .then((data) => {
		res.status(200).json(data.sort((a, b) => b.count-a.count));
	  })
	  .catch(() => {
        res.status(500).json(err);
	  })
})

function getDistributionByField(field) {
	return UserModel.aggregate([
	  { $group: { _id: `$${field}`, count: { $sum: 1 } } }
	])
	.then((data) => {
	  return data.status(200).sort((a, b) => a._id.localeCompare(b._id));
	});
}
  
app.get('/get_distribution_by_type', (req, res, next) => {
	getDistributionByField('type')
	  .then((data) => {
	    res.status(200).json(data);
	  })
	  .catch((err) => {
	    res.status(500).json(err);
	  });
});

app.get('/get_distribution_by_level', (req, res, next) => {
	getDistributionByField('level')
	  .then((data) => {
	    res.status(200).json(data);
	  })
	  .catch((err) => {
	    res.status(500).json(err);
	  });
});

app.get('/get_distribution_by_sex', (req, res, next) => {
	getDistributionByField('sex')
	  .then((data) => {
	    res.status(200).json(data);
	  })
	  .catch((err) => {
	    res.status(500).json(err);
	  });
});

app.get('/get_distribution_by_type_institution', (req, res, next) => {
	getDistributionByField('type_institution')
	  .then((data) => {
	    res.status(200).json(data);
	  })
	  .catch((err) => {
	    res.status(500).json(err);
	  });
});

module.exports = app;