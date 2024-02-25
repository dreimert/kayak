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

export const ActivityTypeLabelsList = [
  { value: ActivityType.Kmer, label: 'Randonnée', icon: "kayaking" },
  { value: ActivityType.Piscine, label: 'Piscine', icon: "pool" },
  { value: ActivityType.EauVive, label: 'Eau vive', icon: "waves" },
  { value: ActivityType.Slalom, label: 'Slalom', icon: "flag" },
  { value: ActivityType.Musculation, label: 'Musculation', icon: "fitness_center" },
]

export const ActivityTypeToLabel = (type: ActivityType) => ActivityTypeLabelsList.find((activityType) => activityType.value === type)?.label || type
export const ActivityTypeToIcon = (type: ActivityType) => ActivityTypeLabelsList.find((activityType) => activityType.value === type)?.icon || 'interests'