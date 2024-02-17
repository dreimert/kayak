import { User } from "./app/models/user.model";

export type ID = string

export enum ActivityType {
  Kmer = 'kmer',
  Piscine = 'piscine',
  EauVive = 'eauVive',
  Slalom = 'slalom',
  Musculation = 'musculation',
}

export enum ParticipationType {
  Oui = 'oui',
  PeutEtre = 'peutEtre',
  Non = 'non',
  NonRepondu = 'nonRepondu',
  Coordinator = 'coordinator',
  Security = 'security',
}

export type ActivityParticipation = {
  participant: User;
  type: ParticipationType;
}