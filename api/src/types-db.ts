import { ParticipationType } from "./enums/ParticipationType.js"

export type ID = string

export type ActivityParticipation = {
  participant: ID
  type: ParticipationType
}