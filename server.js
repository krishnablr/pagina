//basic express app
const express = require('express');
const app = express();
const port = 5001;

const mongoose = require('mongoose');
const User = require('./users');

mongoose.connect('mongodb://localhost/pagination')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Could not connect to MongoDB', err);
    });

    //add users to database
    const db = mongoose.connection;
    db.on('open', async () => {
       if (await User.countDocuments().exec() > 0) return;

         Promise.all([
            User.create({ name: 'user 1' }),
            User.create({ name: 'user 2' }),
            User.create({ name: 'user 3' }),
            User.create({ name: 'user 4' }),
            User.create({ name: 'user 5' }),
            User.create({ name: 'user 6' }),
            User.create({ name: 'user 7' }),
            User.create({ name: 'user 8' }),
            User.create({ name: 'user 9' }),
            User.create({ name: 'user 10' }),
            User.create({ name: 'user 11' }),
            User.create({ name: 'user 12' }),
            User.create({ name: 'user 13' }),
            User.create({ name: 'user 14' }),
            User.create({ name: 'user 15' }),
            User.create({ name: 'user 16' }),
         ]).then(() => console.log('Added Users'));

    });


//add users to the database -- wokring code below
// for (let i = 0; i < 50; i++) {
//     User.create({name: `user ${i}`});
// }

//list all the users created
//  User.find({}, (err, users) => {
//  console.log(users);
//     }
// );
//MongooseError: Model.find() no longer accepts a callback
//solution
// User.find().then(users => {
//     console.log(users);
// });

//
//

// const users = [
//     {id: 1, name: 'user 1'},
//     {id: 2, name: 'user 2'},
//     {id: 3, name: 'user 3'},
//     {id: 4, name: 'user 4'},
//     {id: 5, name: 'user 5'},
//     {id: 6, name: 'user 6'},
//     {id: 7, name: 'user 7'},
//     {id: 8, name: 'user 8'},
//     {id: 9, name: 'user 9'},
//     {id: 10, name: 'user 10'},
//     {id: 11, name: 'user 11'},
//     {id: 12, name: 'user 12'},
//     {id: 13, name: 'user 13'},
//     {id: 14, name: 'user 14'},
//     {id: 15, name: 'user 15'}
// ];

app.get('/users', paginatedResults(User), (req, res) => {
    res.json(res.paginatedResults);
    //TypeError: Converting circular structure to JSON
    //solution: res.json(res.paginatedResults.results);
    //res.json(res.paginatedResults.results);
    //console.log(res.paginatedResults.results);
    //send the output to the browser
    //res.send(res.paginatedResults.results);
});

//middleware function

function paginatedResults(model) {

    return async (req, res, next) => {

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            };
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }

        try {
            results.results = await model.find().limit(limit).skip(startIndex).exec();
            res.paginatedResults = results;
            next();
        } catch (e) {
            res.status(500).json({message: e.message});
        }
    }
}



//start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }

);

