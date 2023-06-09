export const tryCatch = <T, S>(tfn: ()=>T, efn: (e: unknown)=>S) => {
  try { return tfn() }
  catch (e) { return efn(e) }
}

export const hash = (text: string) =>
  crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  .then(digest=>
    Array.from(new Uint8Array(digest)).map(v =>
      v.toString(16).padStart(2,'0')).join(''))