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
  Non = 'non',
  PeutEtre = 'peutEtre',
  NonRepondu = 'nonRepondu',
}

export type ClubId = ID
export type ActivityId = ID
export type UserId = ID

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
  email: string;
  phone: string;
};