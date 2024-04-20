import { User } from "./app/models/user.model";

export type ID = string

export enum ActivityStatus {
  draft = 'draft',
  published = 'published',
  canceled = 'canceled',
}

export enum ActivityType {
  Kmer = 'kmer',
  Piscine = 'piscine',
  EauVive = 'eauVive',
  Slalom = 'slalom',
  DragonBoat = 'dragonBoat',
  Musculation = 'musculation',
  Autres = 'autres',
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
  lastUpdate: Date;
}

export enum PaddleColor {
  vert = 'vert',
  bleu = 'bleu',
  rouge = 'rouge',
  noir = 'noir',
}

export type Paddle = { activityType: ActivityType, color: PaddleColor }

export const ActivityStatusLabelsList = [
  { value: ActivityStatus.draft, label: 'Brouillon', icon: 'drafts' },
  { value: ActivityStatus.published, label: 'Publiée', icon: 'published' },
  { value: ActivityStatus.canceled, label: 'Annulée', icon: 'canceled' },
]

export const ActivityTypeLabelsList = [
  { value: ActivityType.Kmer, label: 'Randonnée', icon: 'kayaking', paddleColor: true},
  { value: ActivityType.Piscine, label: 'Piscine', icon: 'pool' },
  { value: ActivityType.EauVive, label: 'Eau vive', icon: 'waves', paddleColor: true },
  { value: ActivityType.Slalom, label: 'Slalom', icon: 'flag', paddleColor: true },
  { value: ActivityType.DragonBoat, label: 'Dragon boat', icon: 'rowing', paddleColor: true },
  { value: ActivityType.Musculation, label: 'Renforcement musculaire', icon: 'fitness_center' },
  { value: ActivityType.Autres, label: 'Autres', icon: 'interests' },
]

export const ParticipationTypeLabelsList = [
  { value: ParticipationType.Oui, label: 'Oui', icon: 'check', explain: 'Participe'},
  { value: ParticipationType.PeutEtre, label: 'Peut-être', icon: 'change_circle', explain: 'Je ne sais pas encore' },
  { value: ParticipationType.Non, label: 'Non', icon: 'close', explain: 'Ne participe pas'},
  { value: ParticipationType.NonRepondu, label: 'Non répondu', icon: 'question_mark', explain: "N'a pas répondu"},
  { value: ParticipationType.Coordinator, label: 'Coordinateur', icon: 'manage_accounts', explain: "Participe à l'organisation"},
  { value: ParticipationType.Security, label: 'Sécurité', icon: 'security', explain: 'Assure la sécurité'},
]

export const PaddleColorLabelsList = [
  { value: PaddleColor.vert, label: 'Verte' },
  { value: PaddleColor.bleu, label: 'Bleu' },
  { value: PaddleColor.rouge, label: 'Rouge' },
  { value: PaddleColor.noir, label: 'Noir' },
]

export const ActivityStatusToLabel = (status: ActivityStatus) => ActivityStatusLabelsList.find((activityStatus) => activityStatus.value === status)?.label || status

export const ActivityTypeToLabel = (type: ActivityType) => ActivityTypeLabelsList.find((activityType) => activityType.value === type)?.label || type
export const ActivityTypeToIcon = (type: ActivityType) => ActivityTypeLabelsList.find((activityType) => activityType.value === type)?.icon || 'interests'

export const ParticipationTypeToIcon = (type: ParticipationType) => ParticipationTypeLabelsList.find((participationType) => participationType.value === type)?.icon || 'question_mark'

export const PaddleColorToLabel = (type: PaddleColor) => PaddleColorLabelsList.find((participationType) => participationType.value === type)?.label || type