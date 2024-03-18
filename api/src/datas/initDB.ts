import fs from 'fs'

import { Club } from "../models/Club";
import { db } from "./db-mongo";
import { User } from '../models/User';

await db.initDB()

const club = await Club.create({
  name: 'CKLOM',
  domains: ['cklom.kayakons.ovh', 'kayakons.ovh'],
})

const recurrences = [
  {
    "title": "Winter body",
    "description": "Viens préparer ton corps pour la reprise du kayak et n'oublie pas l'apéro après !",
    "type": "musculation",
    "start": "2024-02-12T00:00:00.000Z",
    "end": "2024-03-31T00:00:00.000Z",
    "duration": 7200000,
    "pattern": {
      "day": 2,
      "hour": 19,
      "minutes": 30
    }
  },
  {
    "title": "Kayak et apéro",
    "description": "Viens sur l'eau le mardi soir et n'oublie pas l'apéro après !",
    "type": "kmer",
    "start": "2024-04-01T00:00:00.000Z",
    "end": "2024-10-27T00:00:00.000Z",
    "duration": 7200000,
    "pattern": {
      "day": 2,
      "hour": 18,
      "minutes": 15
    }
  },
  {
    "title": "Randonnée kmer du jeudi",
    "description": "Rejoins le gang des disponibles du jeudi !",
    "type": "kmer",
    "start": "2024-02-12T00:00:00.000Z",
    "duration": 7200000,
    "pattern": {
      "day": 4,
      "hour": 9,
      "minutes": 0
    }
  },
  {
    "title": "Piscine",
    "description": "Après quelques longueurs d'échauffement en natation, selon les envies de chacun:\n\n    natation nage au choix avec des lignes d'eau\n    apprentissage éducatifs techniques pour amméliorer l' aisance aquatique, la respiration, l'efficacité du geste ou même pourquoi pas découvrir une nouvelle nage\n    kayak avec technique, sécurité, esquimautage dans des conditions optimales de confort avant de mettre celà en pratique en extérieur\n\nAccès : piscine municipale d'Oullins / 44 grande rue\nParking sur place\nTCL arrêt piscine municipale C10, C17, 14, 17, 63, métro B gare d'Oullins à 500m\n\nPrévoir :\nmaillot de bain (short interdit), bonnet obligatoire, serviette, lunettes ou masque.",
    "type": "piscine",
    "start": "2024-02-19T00:00:00.000Z",
    "duration": 7200000,
    "pattern": {
      "day": 5,
      "hour": 20,
      "minutes": 30
    }
  },
  {
    "title": "Sortie kmer du samedi matin",
    "description": "LA sortie à ne pas manquer",
    "type": "kmer",
    "start": "2024-02-12T00:00:00.000Z",
    "duration": 7200000,
    "pattern": {
      "day": 6,
      "hour": 9,
      "minutes": 0
    }
  },
  {
    "title": "Randonnée kmer du samedi après-midi",
    "description": "Surveille si Damien et Benjamin sont là",
    "type": "kmer",
    "start": "2024-02-12T00:00:00.000Z",
    "duration": 7200000,
    "pattern": {
      "day": 6,
      "hour": 14,
      "minutes": 0
    }
  }
]

club.recurrences.push(...recurrences)

await club.save()

console.info('Club created', club);

const json = fs.readFileSync(process.env.DB_PATH, 'utf8')

const rawUsers = JSON.parse(json).users

for (const user of rawUsers) {
  await User.create({
    email: user.email,
    name: user.name,
    phone: user.phone,
    clubs: [club.id],
    notifications: user.notifications
  })
}

await db.closeDB()