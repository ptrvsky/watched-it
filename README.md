# Watched It

## General info 
Watched It is a web application that let you discover information about movies, TV series and people that create them. Rate productions, track your progress and check at which platform you can watch your favorite TV show. All in one place.

## Used technologies
Application was written in **JavaScript** as two concurrent **Node.js** applications supported by **PostgreSQL** database. Moreover there were used frameworks and tools listed below:
* **Frontend:** React, SASS, HTML, React Router
* **Backend:** Express, Sequelize, Passport.js, Joi
* **Testing:** Supertest, Mocha, Chai

## API
Backend application provides REST API that lets user perform CRUD operations on database using following routes: 
```/api/productions
/api/people
/api/productions-people
/api/images
/api/images-people
/api/users
/api/productions-rates
/api/people-rates
/api/users-productions
/api/platforms
/api/productions-platforms 
```
Most of the requests that return collections can be parameterized using limit, offset, order or sepcific attribute parameters.
All POST, PUT and PATCH requests are validated using [Joi](https://github.com/hapijs/joi) library. 

## Screenshots
<img src="https://user-images.githubusercontent.com/27224945/74557776-30f4e800-4f61-11ea-934d-c99f16d4e100.png" width="49%"> <img src="https://user-images.githubusercontent.com/27224945/74557897-77e2dd80-4f61-11ea-99e2-3995608728ab.png" width="49%"> <img src="https://user-images.githubusercontent.com/27224945/74558814-4a972f00-4f63-11ea-8752-703d2c88e0b8.png" width="49%"> <img src="https://user-images.githubusercontent.com/27224945/74558960-8d590700-4f63-11ea-82fd-359ca1255c9e.png" width="49%">
