import {tryCatch} from '../lib'
import {endkeys_struct} from '../validator'
import {assert} from 'superstruct'

export const loadEndkeys = (id: string): string[] =>
  tryCatch(()=> {
    const data = JSON.parse(localStorage.getItem(id) || '[]')
    const [err, endkeys] = endkeys_struct.validate(data)
    if (err) {
      console.error(err)
      return []
    }
    else return endkeys
  }, e=> [])

export const saveEndkeys = (id: string, endkeys: string[]) => {
  assert(endkeys, endkeys_struct)
  localStorage.setItem(id, JSON.stringify(endkeys))
}