import {
  getFirestore, collection, doc, getDoc, getDocs,
  query, where, writeBatch,
  type DocumentSnapshot
} from 'firebase/firestore/lite'
import {assert} from 'superstruct'
import {rally_struct, rally_admin_struct, type Rally, type AdminRally} from '../validator'
import {app} from './init'

const firestore = getFirestore(app)

const rallies = collection(firestore, 'rallies').withConverter({
  fromFirestore (ss: DocumentSnapshot) {
    const rally = ss.data()
    assert(rally, rally_struct)
    return rally
  },
  toFirestore (rally: Rally) {
    assert(rally, rally_struct)
    return rally
  }
})

export const getRally = (id: string) =>
  getDoc(doc(rallies, id)).then(ss=> ss.data())

const admin_rallies = collection(firestore, 'admin-rallies').withConverter({
  fromFirestore (ss: DocumentSnapshot) {
    const rally = ss.data()
    assert(rally, rally_admin_struct)
    return rally
  },
  toFirestore (rally: AdminRally) {
    assert(rally, rally_admin_struct)
    return rally
  }
})

export const getAdminRallies = (uid: string) =>
  getDocs(query(admin_rallies, where('uid', '==', uid)))
  .then(rallies=> rallies.docs.map(d=> ({...d.data(), id: d.id})))


export const getAdminRally = (id: string) =>
  getDoc(doc(admin_rallies, id)).then(ss=> ss.data())


export const createRally = (rally: Rally, admin_rally: Omit<AdminRally, 'read_id'>) => {
  const new_rally = doc(rallies)
  const read_id = new_rally.id
  const new_admin_rally = doc(admin_rallies)
  return writeBatch(firestore)
    .set(new_rally, rally)
    .set(new_admin_rally, {...admin_rally, read_id})
    .commit()
    .then(()=> [read_id, new_admin_rally.id] as [rally_id: string, admin_rally_id: string])
}

export const updateRally = (
  id: string, rally: Partial<Rally>,
  admin_id: string, admin_rally: Partial<AdminRally>
) =>
  writeBatch(firestore)
  .update(doc(rallies, id), rally)
  .update(doc(admin_rallies, admin_id), admin_rally)
  .commit()

export const deleteRally = (id: string, admin_id: string) =>
  writeBatch(firestore)
  .delete(doc(rallies, id))
  .delete(doc(admin_rallies, admin_id))
  .commit()
