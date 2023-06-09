import {app} from './init'
import {getAuth, GoogleAuthProvider, signInWithRedirect, onAuthStateChanged, type User, signOut} from 'firebase/auth'
import {useState, useEffect} from 'react'

const auth = getAuth(app)

export const useAuthUser = () => {
  const [user, setUser] = useState(auth.currentUser)
  useEffect(()=> {
    //getRedirectResult(auth)
    //.then(result=> {})
    onAuthStateChanged(auth, user=> {
      setUser(user)
    })
  }, [])
  return {
    user,
    signIn:  ()=> signInWithRedirect(auth, new GoogleAuthProvider()),
    signOut: ()=> signOut(auth)
  } as const
}
export default useAuthUser