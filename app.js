const express = require("express");
const { buildSchema } = require("graphql");
const graphqlHttp = require('express-graphql')
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());


const events = []

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
    schema {
      query: RootQuery
      mutation: RootMutation
    }



    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }


    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }
  `),
    rootValue: {
      events: () => events,
      createEvent: (args) => {
        const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(),
        };
        events.push(event);
        return event;
      },
    },
    graphiql: true,
  })
);

app.listen(3000, () => {
  console.log("Started in port 3000");
});
