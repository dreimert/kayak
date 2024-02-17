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

export type Activity = {
  id: ActivityId
  date: Date
  type: ActivityType
  participations: ActivityParticipation[]
}

export type Club = {
  id: ClubId;
  name: string;
  members: User[];
  activities: Activity[];
  agenda: Agenda;
}

export type Agenda = {
  activities: Activity[];
  participants: User[]
}

export type User = {
  id: UserId;
  name: string;
}

export type UserFull = User & {
  phone: string;
  email: string;
}