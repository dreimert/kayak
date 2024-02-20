import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServerErrorCode } from '@apollo/server/errors';

import { readFileSync } from 'fs';
import { DateTimeResolver, EmailAddressResolver, PhoneNumberResolver } from 'graphql-scalars';

import { ActivityParticipation, ID } from '../types-db.js';

import { Club } from '../models/Club.js';

import { ParticipationType } from '../enums/ParticipationType.js';
import { ActivityType } from '../enums/ActivityType.js';
import { User } from '../models/User.js';
import { sendMail } from '../mail.js';
import { Activity } from '../models/Activity.js';

export type Context = {
  user?: User;
}

// TODO : https://www.apollographql.com/docs/apollo-server/api/plugin/drain-http-server/

// Note: this uses a path relative to the project's
// root directory, which is the current working directory
// if the server is executed using `npm run`.
const typeDefs = readFileSync('./api/src/graphql/schema.graphql', { encoding: 'utf-8' });

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  DateTime: DateTimeResolver,
  EmailAddress: EmailAddressResolver,
  PhoneNumber: PhoneNumberResolver,

  ParticipationType,
  ActivityType,

  Query: {
    clubs: () => Club.all(),
    club: (_, args: { id: ID }) => Club.findById(args.id),
    clubByDomain: (_, args: { domain: string }) => Club.findByDomain(args.domain),
    activity: (_, args: { id: ID }) => Activity.findById(args.id),
    user: (_, args: { id: ID }) => User.findById(args.id),
    me: (_, __, { user }) => {
      return user || null;
    },
    userPrivateData: async (_, args: { userId: ID, type: string }, context: Context) => {
      if (!context.user?.id) {
        throw new Error('Vous devez être connecté pour accéder à cette ressource');
      }

      const user = User.findById(args.userId);

      if (!user) {
        throw new Error(`User not found: ${args.userId}`);
      }

      let fieldName

      switch (args.type) {
        case 'phone':
          fieldName = 'numéro de téléphone';
          break;
        case 'email':
          fieldName = 'adresse mail';
          break;
        default:
          throw new Error(`Invalid type: ${args.type}`);
      }

      await sendMail(
        user.email,
        `${context.user.name} a consulté votre ${fieldName}`,
        `${context.user.name} a consulté votre ${fieldName}.`,
        `${context.user.name} a consulté votre ${fieldName}.`
      )

      return user[args.type];
    },
  },

  Mutation: {
    // participate(activityId: ID!, userId: ID!, type: ParticipationType!): ActivityParticipation!
    participate: (_, args: { activityId: ID, userId: ID, type: ParticipationType }, context) : ActivityParticipation => {
      const activity = Activity.findById(args.activityId);

      if (!activity) {
        throw new Error(`Activity not found: ${args.activityId}`);
      }

      const user = User.findById(args.userId);

      if (!user) {
        throw new Error(`User not found: ${args.userId}`);
      }

      if (user.id !== context.user?.id) {
        throw new Error(`User not authorized: ${args.userId}`);
      }

      const participation = activity.participations.find((participation) => participation.participant === user.id);

      if (participation) {
        participation.type = args.type;
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
    updateProfile: (_, args: { userId: ID, input: Pick<User, 'name' | 'phone' | 'notifications'> }, context) : User => {
      //(user: ID!, name: String!, phone: PhoneNumber!): User!
      const user = User.findById(args.userId);

      if (!user) {
        throw new Error(`User not found: ${args.userId}`);
      }

      if (user.id !== context.user?.id) {
        throw new Error(`User not authorized: ${args.userId}`);
      }

      user.name = args.input.name;
      user.phone = args.input.phone;
      user.notifications = args.input.notifications || [];

      return user;
    },
  },

  Club: {
    members: (parent: Club) => parent.getMembers(),
    activities: (parent: Club) => parent.getActivities(),
    agenda: (parent: Club) => parent.getAgenda(),
  },

  ActivityParticipation: {
    participant: (parent: ActivityParticipation) => User.findById(parent.participant),
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
export const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  plugins: [
    // Install a landing page plugin based on NODE_ENV
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageProductionDefault({
          includeCookies: true,
        })
      : ApolloServerPluginLandingPageLocalDefault({
        includeCookies: true,
      }),
  ],
  formatError: (formattedError, error) => {
    console.error('GraphQLError', formattedError);
    // Return a different error message
    if (formattedError.extensions.code === ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED) {
      return {
        ...formattedError,
        message: "Your query doesn't match the schema. Try double-checking it!",
      };
    }

    // Otherwise return the formatted error. This error can also
    // be manipulated in other ways, as long as it's returned.
    return formattedError;
  },
})

await server.start()

