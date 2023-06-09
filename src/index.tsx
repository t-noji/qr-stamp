import {createRoot} from 'react-dom/client'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {home_path} from './config'
import {Suspense, lazy} from 'react'

const StampSheet = lazy(()=> import('./view/StampSheet'))
const EditRallies = lazy(()=> import('./edit/EditRallies'))
const EditRally = lazy(()=> import('./edit/EditRally'))

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={home_path}>
    <Routes>
      <Route path='rally'>
        <Route path=':id' element={
          <Suspense fallback='...loading'><StampSheet/></Suspense>
        }/>
      </Route>
      <Route path='edit'>
        <Route index element={
          <Suspense fallback='...loading'><EditRallies/></Suspense>
        }/>
        <Route path=':id' element={
          <Suspense fallback='...loading'><EditRally/></Suspense>
        }/>
      </Route>
    </Routes>
  </BrowserRouter>
)
