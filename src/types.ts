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
  { value: ActivityType.Kmer, label: 'Randonnée', icon: 'kayaking' },
  { value: ActivityType.Piscine, label: 'Piscine', icon: 'pool' },
  { value: ActivityType.EauVive, label: 'Eau vive', icon: 'waves' },
  { value: ActivityType.Slalom, label: 'Slalom', icon: 'flag' },
  { value: ActivityType.Musculation, label: 'Renforcement musculaire', icon: 'fitness_center' },
]

export const ParticipationTypeLabelsList = [
  { value: ParticipationType.Oui, label: 'Oui', icon: 'check', explain: 'Participe'},
  { value: ParticipationType.PeutEtre, label: 'Peut-être', icon: 'change_circle', explain: 'Je ne sais pas encore' },
  { value: ParticipationType.Non, label: 'Non', icon: 'close', explain: 'Ne participe pas'},
  { value: ParticipationType.NonRepondu, label: 'Non répondu', icon: 'question_mark', explain: "N'a pas répondu"},
  { value: ParticipationType.Coordinator, label: 'Coordinateur', icon: 'manage_accounts', explain: "Participe à l'organisation"},
  { value: ParticipationType.Security, label: 'Sécurité', icon: 'security', explain: 'Assure la sécurité'},
]

export const ActivityTypeToLabel = (type: ActivityType) => ActivityTypeLabelsList.find((activityType) => activityType.value === type)?.label || type
export const ActivityTypeToIcon = (type: ActivityType) => ActivityTypeLabelsList.find((activityType) => activityType.value === type)?.icon || 'interests'

export const ParticipationTypeToIcon = (type: ParticipationType) => ParticipationTypeLabelsList.find((participationType) => participationType.value === type)?.icon || 'question_mark'