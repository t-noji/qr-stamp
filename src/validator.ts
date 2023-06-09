import {object, string, tuple, array, number, boolean, assign, type Infer} from 'superstruct'

export const stamp_pre_struct = object({
  name: string(),
  key: string(), // hash
  position: tuple([number(), number()])
})
export type StampPre = Infer<typeof stamp_pre_struct>

export const rally_struct = object({
  name: string(),
  admin_id: string(),
  stamps: array(stamp_pre_struct)
})
export type Rally = Infer<typeof rally_struct>

export const stamp_struct = assign(stamp_pre_struct, object({end: boolean()}))
export type Stamp = Infer<typeof stamp_struct>

export const endkeys_struct = array(string()) // add version
export type Endkeys = Infer<typeof endkeys_struct>

export const stamp_admin_struct = object({
  name: string(),
  key: string(),
  position: tuple([number(), number()])
})
export const rally_admin_struct = object({
  name: string(),
  read_id: string(),
  uid: string(),
  stamps: array(stamp_admin_struct)
})
export type AdminRally = Infer<typeof rally_admin_struct>

/*
export const admin_struct = object({
  uid: string(),
  rallies: array(rally_admin_struct)
})
export type Admin = Infer<typeof admin_struct>
*/