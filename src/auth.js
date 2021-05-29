import mongo from 'mongodb'
import connect from './db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
;(async () => {
  let db = await connect()
  await db.collection('users').createIndex({ email: 1 }, { unique: true })
})()

export default {
  async registerUser (userData) {
    let db = await connect()

    let doc = {
      nadimak_obitelji: userData.nadimak_obitelji,
      broj_clanova: userData.broj_clanova,
      email: userData.email,
      lozinka: await bcrypt.hash(userData.lozinka, 8)
    }

    let docPojedinacni = {
      email: userData.email,
      spolMuski: userData.spolMuski,
      spolZene: userData.spolZene,
      ciljMuski: userData.ciljMuski,
      ciljZene: userData.ciljZene,
      kalorijeMuski: userData.kalorijeMuski,
      kalorijeZene: userData.kalorijeZene
    }

    let docObiteljski = {
      email: userData.email,
      radni_dan: userData.radni_dan,
      Pdorucak: userData.Pdorucak,
      Prucak: userData.Prucak,
      Pvecera: userData.Pvecera,
      Udorucak: userData.Udorucak,
      Urucak: userData.Urucak,
      Uvecera: userData.Uvecera,
      Sdorucak: userData.Sdorucak,
      Srucak: userData.Srucak,
      Svecera: userData.Svecera,
      Cdorucak: userData.Cdorucak,
      Crucak: userData.Crucak,
      Cvecera: userData.Cvecera,
      PEdorucak: userData.PEdorucak,
      PErucak: userData.PErucak,
      PEvecera: userData.PEvecera,
      SUdorucak: userData.SUdorucak,
      SUrucak:  userData.SUrucak,
      SUvecera: userData.SUvecera,
      Ndorucak: userData.Ndorucak,
      Nrucak: userData.Nrucak,
      Nvecera: userData.Nvecera


    }

    try {
      let result = await db.collection('users').insertOne(doc)
      let resultPojedinacni = await db.collection('pojedinacniPlan').insertOne(docPojedinacni)
      let resultObiteljski = await db.collection('SpremiTjedan').insertOne(docObiteljski)
      if (result && result.insertedId) {
        return result.insertedId
      }
    } catch (e) {
      if (e.name == 'MongoError' && e.code == 11000) {
        throw new Error('Korisnik vec postoji')
      }
    }
  },

  async authUser (email, lozinka) {
    let db = await connect()

    let user = await db.collection('users').findOne({ email: email })

    if (user && user.lozinka && (await bcrypt.compare(lozinka, user.lozinka))) {
      delete user.lozinka
      let token = jwt.sign(user, process.env.JWT_SECRET, {
        algorithm: 'HS512',
        expiresIn: '1 week'
      })
      return {
        token,
        email: user.email
      }
    } else {
      throw new Error('Nista od prijave')
    }
  },

  verify (req, res, next) {
    try {
      let authorization = req.headers.authorization.split(' ')
      let type = authorization[0]
      let token = authorization[1]

      if (type !== 'Bearer') {
        res.status(401).send()
        return false
      } else {
        req.jwt = jwt.verify(token, process.env.JWT_SECRET)
        return next()
      }
    } catch (e) {
      return res.status(401).send()
    }
  }
}
