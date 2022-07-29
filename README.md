# movie api

## Project description

This is the server side of a movie app. The app provides users with access to information about different movies, directors, and genres.
Users are able to sign up and login, update their personal information, and create a list of their favorite movies.
The REST API and database are built using Node.js, Express, and MongoDB. The business logic is modeled with Mongoose.
The endpoints of the API can be accessed with HTTP methods (POST, GET, PUT, and DELETE) to Create, Read, Update, and Delete (CRUD) data from the database.

## Built With

- Node.js
- Express
- MongoDB

## Dependencies

- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [body-parser](https://github.com/expressjs/body-parser)
- [CORS](https://github.com/expressjs/cors)
- Express
- [express validator](https://express-validator.github.io/docs/)
- JsonWebToken
- [Morgan](https://github.com/expressjs/morgan)
- MongoDB
- Mongoose
- [Passport](https://www.passportjs.org/)

## Endpoints

### Get data of all movies

<strong>Endpoint:</strong> `/movies`

<strong>HTTP method:</strong> GET

<strong>Request body data format:</strong> none

<strong>Response body data format:</strong> JSON object holding data about all movies

### Get data of a single movie

<strong>Endpoint:</strong> `/movies/[movie ID]`

<strong>HTTP method:</strong> GET

<strong>Request body data format:</strong> none

<strong>Response body data format:</strong> JSON object holding data about a movie containing description, genre, director, image URL

<strong>Format:</strong>

```
{
  Title: String, (required)
  Description: String, (required)
  Genre: {
    Name: String,
    Description: String
    },
    Director: {
      Name: String,
      Bio: String,
      Birth: Date, ("YYYY-MM-DD")
      Death: Date ("YYYY-MM-DD")
      },
      ImagePath: String,
      Featured: Boolean
}
```

### Get data of a genre

<strong>Endpoint:</strong> `/genres/[genre name]`

<strong>HTTP method:</strong> GET

<strong>Request body data format:</strong> none

<strong>Response body data format:</strong> JSON object holding data about a genre

<strong>Format:</strong>

```
{
  Name: String,
  Description: String
}
```

### Get data of a director

<strong>Endpoint:</strong> `/directors/[name]`

<strong>HTTP method:</strong> GET

<strong>Request body data format:</strong> none

<strong>Response body data format:</strong> JSON object holding data about a director including bio, birth year, death year

<strong>Format:</strong>

```
{
  Name: String,
  Bio: String,
  Birth: Date, ("YYYY-MM-DD")
  Death: Date ("YYYY-MM-DD")
}
```

### Add new user

<strong>Endpoint:</strong> `/users`

<strong>HTTP method:</strong> POST

<strong>Request body data format:</strong> JSON object holding data about the new user including username and mail

<strong>Format:</strong>

```
{
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date, ("YYYY-MM-DD")
  FavoriteMovies: Array
}
```

<strong>Response body data format:</strong> JSON object holding data about the new user including ID, username and mail

<strong>Format:</strong>

```
{
  ObjectId: String,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date, ("YYYY-MM-DD")
  FavoriteMovies: Array
}
```

### Get data of a single user

<strong>Endpoint:</strong> `/users/[username]`

<strong>HTTP method:</strong> GET

<strong>Request body data format:</strong> none

<strong>Response body data format:</strong> JSON object holding the data about the user

<strong>Format:</strong>

```
{
  ObjectId: String,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date, ("YYYY-MM-DD")
  FavoriteMovies: Array
}
```

### Update user data

<strong>Endpoint:</strong> `/users/[username]`

<strong>HTTP method:</strong> PUT

<strong>Request body data format:</strong> JSON object with the new user infos

<strong>Format:</strong>

```
{
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date ("YYYY-MM-DD")
}
```

<strong>Response body data format:</strong> JSON object holding the data about the new user

<strong>Format:</strong>

```
{
  ObjectId: String,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date, ("YYYY-MM-DD")
  FavoriteMovies: Array
}
```

### Add movie to favorite list of user

<strong>Endpoint:</strong> `/users/[username]/movies/[movie ID]`

<strong>HTTP method:</strong> PUT

<strong>Request body data format:</strong> none

<strong>Response body data format:</strong> JSON object holding the new data about the user

<strong>Format:</strong>

```
{
  ObjectId: String,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date, ("YYYY-MM-DD")
  FavoriteMovies: Array
}
```

### Remove movie from favorite list of user

<strong>Endpoint:</strong> `/users/[username]/movies/[movie ID]`

<strong>HTTP method:</strong> DELETE

<strong>Request body data format:</strong> none

<strong>Response body data format:</strong> JSON object holding the data about the user without the deleted movie

<strong>Format:</strong>

```
{
  ObjectId: String,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date, ("YYYY-MM-DD")
  FavoriteMovies: Array
}

```

### Delete user

<strong>Endpoint:</strong> `/users/[username]`

<strong>HTTP method:</strong> DELETE

<strong>Request body data format:</strong> none

<strong>Response body data format:</strong> Text message indicating that the user email was removed
