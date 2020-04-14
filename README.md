# REST Currency App
Currency app created as a part of the internship test task 

## Setup
The project has been made by using Node.js and React JS. The main language used in the project is JavaScript. The REST protocol has been applied to create routes. React has been used for the UI. <br>

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). Reactstrap was used to add styles.

Other used frameworks and technologies:
* [Express.js](https://expressjs.com/)
* [Mongoose](https://mongoosejs.com/)
* [Mocha](https://www.npmjs.com/package/mocha)
* [Chai](https://www.chaijs.com/)
* [Supertest](https://www.npmjs.com/package/supertest)

Database:
* [MongoDB](https://www.mongodb.com/) - as a main database
* [Mockgoose](https://www.npmjs.com/package/mockgoose) - for unit tests

### Schema

2. Currency
```const mongoose = require("mongoose");

const CurrencySchema = mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    shortCode: {
        type: String,
        required: true,
        unique: true
    },
    rate: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default:Date.now
    }
});

module.exports = mongoose.model('currencies', CurrencySchema);
```

### Deployment

On your local machine terminal run the following code to clone the project from the repository: <br>
```git clone https://github.com/Elvinius/Currency_App.git``` <br>
After opening the project in one of the code editors (for example, Visual Studio Code) type the following command to run the server:<br>
```npm start``` <br>
To run the React and open the rendered application:<br>
```npm start```
Open [http://localhost:3000](http://localhost:3000) to view the UI part in the browser. You can find the image from the application below. <br>
In order to run the unit tests type the following command: <br>
```npm test``` <br>




