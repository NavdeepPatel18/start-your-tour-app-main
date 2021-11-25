const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const isAuth = require("./middleware/is-auth");
const graphQlschema = require("./graphql/schema/index");
const graphQlresolvers = require("./graphql/resolvers/index");

const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPITIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-type, Authorization");
  // res.setHeader("Access-Control-Allow-Credentials", true);
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use(
    "/SYT",
   graphqlHTTP({
      schema: graphQlschema,
      rootValue: graphQlresolvers,
      graphiql: true,
    })
  );

  mongoose
  .connect(`mongodb+srv://USER:${process.env.MONGO_PASSWORD}@syt.nrodu.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    }
  )
  .then(() => {
    app.listen(port);
  })
  .catch((err) => {
    throw err;
  });
