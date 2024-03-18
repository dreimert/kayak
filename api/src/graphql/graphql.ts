import { HydratedDocument, Types } from 'mongoose';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServerErrorCode } from '@apollo/server/errors';

import { readFileSync } from 'fs';
import { DateTimeResolver, EmailAddressResolver, PhoneNumberResolver, ObjectIDResolver } from 'graphql-scalars';

import { Club, IClubMethods, TClub } from '../models/Club.js';

import { ParticipationType } from '../enums/ParticipationType.js';
import { ActivityType } from '../enums/ActivityType.js';
import { TUser, User } from '../models/User.js';
import { notifyNewActivity, sendMail } from '../mail.js';
import { Activity, ActivityParticipation, IActivityMethods, TActivity } from '../models/Activity.js';

export type Context = {
  user?: HydratedDocument<TUser>;
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
  // ObjectID: ObjectIDResolver,

  ParticipationType,
  ActivityType,

  Query: {
    clubs: async () => await Club.find({}),
    club: async (_, args: { id: Types.ObjectId }) => await Club.findById(args.id),
    clubByDomain: async (_, args: { domain: string }) => await Club.findOne({ domains: args.domain }),
    activity: async (_, args: { id: Types.ObjectId }) => await Activity.findById(args.id),
    user: async (_, args: { id: Types.ObjectId }) => await User.findById(args.id),
    me: (_, __, context: Context) => {
      return context.user || null;
    },
    userPrivateData: async (_, args: { userId: Types.ObjectId, type: string }, context: Context) => {
      if (!context.user?.id) {
        throw new Error('Vous devez être connecté pour accéder à cette ressource');
      }

      const user = await User.findById(args.userId);

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
    createActivity: async (_, args: { clubId: Types.ObjectId, input: Pick<TActivity, 'title' | 'description' | 'type' | 'start' | 'end' | 'limit'> }, context: Context) : Promise<HydratedDocument<TActivity>> => {
      if (!context.user?.id) {
        throw new Error('Vous devez être connecté pour accéder à cette ressource');
      }

      const club = await Club.findById(args.clubId);

      if (!club) {
        throw new Error(`Club not found: ${args.clubId}`);
      }

      const input: Partial<TActivity> = {
        ...args.input,
        coordinators: [context.user.id],
        participations: [{
          participant: context.user.id,
          type: ParticipationType.coordinator,
        }],
      };

      const activity = await Activity.create(input);

      club.activities.push(activity.id);

      await club.save();

      // notify club members
      await notifyNewActivity(activity, club);

      return activity;
    },
    // updateActivity(activityId: ID!, input: ActivityInput!): Activity!
    updateActivity: async (_, args: { activityId: Types.ObjectId, input: Pick<TActivity, 'title' | 'description' | 'type' | 'start' | 'end' | 'limit'> }, context: Context) : Promise<HydratedDocument<TActivity>> => {
      const activity = await Activity.findById(args.activityId);

      if (!activity) {
        throw new Error(`Activity not found: ${args.activityId}`);
      }

      if (!activity.isCoordinatorOrClubAdministrator(context.user)) {
        throw new Error(`User not authorized: ${context.user?.id || 'anonymous'}`);
      }

      activity.title = args.input.title;
      activity.description = args.input.description;
      activity.type = args.input.type;
      activity.start = args.input.start;
      activity.end = args.input.end;
      activity.limit = args.input.limit || 0;

      await activity.save();

      return activity;
    },
    participate: async (_, args: { activityId: Types.ObjectId, userId: Types.ObjectId, type: ParticipationType }, context: Context) : Promise<ActivityParticipation> => {
      const activity = await Activity.findById(args.activityId);

      if (!activity) {
        throw new Error(`Activity not found: ${args.activityId}`);
      }

      const user = await User.findById(args.userId);

      if (!user) {
        throw new Error(`User not found: ${args.userId}`);
      }

      if (user.id !== context.user?.id) {
        throw new Error(`User not authorized: ${args.userId}`);
      }

      const participation = activity.participations.find((participation) => participation.participant.equals(user.id));

      if (participation) {
        participation.type = args.type;
      } else {
        activity.participations.push({
          participant: user.id,
          type: args.type,
        });
      }

      await activity.save();

      return {
        participant: user.id,
        type: args.type,
      };
    },
    updateProfile: async (_, args: { userId: Types.ObjectId, input: Pick<TUser, 'name' | 'phone' | 'notifications'> }, context) : Promise<HydratedDocument<TUser>> => {
      //(user: Types.ObjectId!, name: String!, phone: PhoneNumber!): User!
      const user = await User.findById(args.userId);

      if (!user) {
        throw new Error(`User not found: ${args.userId}`);
      }

      if (user.id !== context.user?.id) {
        throw new Error(`User not authorized: ${args.userId}`);
      }

      user.name = args.input.name;
      user.phone = args.input.phone;
      user.notifications = args.input.notifications || [];

      await user.save();

      return user;
    },
  },

  ActivityParticipation: {
    participant: async (parent: ActivityParticipation) => await User.findById(parent.participant),
  },

  Activity: {
    iCanEdit: async (parent: HydratedDocument<TActivity, IActivityMethods>, _, context: Context) => {
      return parent.isCoordinatorOrClubAdministrator(context.user);
    }
  },

  Club: {
    members: (parent: HydratedDocument<TClub, IClubMethods>) => parent.getMembers(),
    activities: (parent: HydratedDocument<TClub, IClubMethods>) => parent.getActivities(),
    agenda: (parent: HydratedDocument<TClub, IClubMethods>) => parent.getAgenda(),
  },

  Me: {
    clubs: async (parent: TUser) => await Promise.all(parent.clubs.map((clubId) => Club.findById(clubId)))
  },

  UserFull: {
    clubs: async (parent: TUser) => await Promise.all(parent.clubs.map((clubId) => Club.findById(clubId)))
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

