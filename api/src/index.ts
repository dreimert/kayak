import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { DateTimeResolver, EmailAddressResolver, PhoneNumberResolver } from 'graphql-scalars';

import { ActivityParticipation, ID } from './types-db.js';

import { Club } from './models/Club.js';

import { db, initDb } from './datas/db.js';

import { ParticipationType } from './enums/ParticipationType.js';
import { ActivityType } from './enums/ActivityType.js';

initDb();

// Note: this uses a path relative to the project's
// root directory, which is the current working directory
// if the server is executed using `npm run`.
const typeDefs = readFileSync('./api/src/schema.graphql', { encoding: 'utf-8' });

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  DateTime: DateTimeResolver,
  EmailAddress: EmailAddressResolver,
  PhoneNumber: PhoneNumberResolver,

  ParticipationType,
  ActivityType,

  Query: {
    clubs: () => db.clubs,
    club: (_, args: { id: ID }) => db.clubs.find((club) => club.id === args.id),
    user: (_, args: { id: ID }) => db.users.find((user) => user.id === args.id),
  },

  Mutation: {
    // participate(activityId: ID!, userId: ID!, type: ParticipationType!): ActivityParticipation!
    participate: (_, args: { activityId: ID, userId: ID, type: ParticipationType }) : ActivityParticipation => {
      const activity = db.activities.find((activity) => activity.id === args.activityId);
      const user = db.users.find((user) => user.id === args.userId);
      const participation = activity.participations.find((participation) => participation.participant === user.id);

      console.log('participate', activity, user, participation, args.type);

      if (participation) {
        participation.type = args.type;

        console.log('participation', participation);

      } else {
        activity.participations.push({
          participant: user.id,
          type: args.type,
        });
      }

      return {
        participant: user.id,
        type: args.type,
      };
    },
  },

  Club: {
    members: (parent: Club) => parent.getMembers(),
    activities: (parent: Club) => parent.getActivities(),
    agenda: (parent: Club) => parent.getAgenda(),
  },

  ActivityParticipation: {
    participant: (parent: ActivityParticipation) => db.users.find((user) => user.id === parent.participant),
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4040 },
});

console.info(`🚀  Server ready at: ${url}`);