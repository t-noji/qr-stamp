import React, {useState, useEffect, lazy, Suspense} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import type {Stamp} from '../validator'
import {loadEndkeys, saveEndkeys} from './local-save'
import {getRally} from '../firebase/rally-db'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Snackbar from '@mui/material/Snackbar'
import {MapMenuButton} from '../buttons'
import {QrCodeScanner} from '@mui/icons-material'
import Map from './Map'
import {home_path} from '../config'

const Capture = lazy(()=> import('./Capture'))

const complate =
  <img src={`${home_path}/icon/complate.png`}
   style={{position: 'absolute', opacity: 0.8, zIndex: 1500, left: '5vw', top: '5vw', maxWidth: '30vw', maxHeight: '30vw'}}
  />

type Props = {
  id: string
}
const StampSheet: React.FC = () => {
  const {id} = useParams<Props>()
  const navigate = useNavigate()
  const [stamps, setStamps] = useState<Stamp[]>([])
  const [capture_key, setCaptureKey] = useState('')
  const [capture_mode, setCaptureMode] = useState(false)
  const stamp = capture_key ? (stamps.find(s=> s.key === capture_key) || 'unreach') : null
  const [message, setMessage] = useState('')
  useEffect(()=> {
    if (id) getRally(id).then(rally=> {
      if (!rally) return
      const endkeys = loadEndkeys(id)
      setStamps(rally.stamps.map(s=> ({...s, end: endkeys.includes(s.key)})))
    })
  }, [])
  useEffect(()=> {
    setMessage(
      stamp === 'unreach' ? '無関係なQRコードです' :
      stamp               ? 'QRスタンプを取得しました！':
                            ''
    )
  }, [stamp])
  if (!id) return <div/>
  return <div style={{height: '100%'}}>
    {capture_mode ?
      <>
        <Suspense fallback={<div>Loading...</div>}>
          <Capture captureKey={key=> {
            setStamps(stamps.map(s=> s.key === key ? {...s, end: true} : s))
            setCaptureKey(key)
            saveEndkeys(id, [...stamps.filter(s=> s.end).map(s=> s.key), key])
            setCaptureMode(false)
          }}/>
        </Suspense>
        <Button sx={{zIndex: 'tooltip', position: 'absolute', bottom: '3em', left: '4em', right: '4em'}}
         variant='contained' size='large' onClick={e=> setCaptureMode(false)}>
          キャプチャ終了
        </Button>
      </>
    :
      <>
        {Boolean(stamps.length) &&
          <Map stamps={stamps} center={typeof stamp === 'object' && stamp?.position || undefined}/>}

        <MapMenuButton>
          <MenuItem onClick={e=> {
            if (!confirm('スタンプ取得状況をリセットしますか？')) return
            saveEndkeys(id, [])
            location.reload()
          }}>
            リセット
          </MenuItem>
          <MenuItem onClick={()=> navigate('/edit') }>
            スタンプラリー作成
          </MenuItem>
        </MapMenuButton>

        {stamps.length > 0 && stamps.every(s=> s.end) ?
          complate
        :
          <Button sx={{zIndex: 'tooltip', position: 'absolute', bottom: '3em', left: '4em', right: '4em'}} 
           variant='contained' size='large' onClick={e=> setCaptureMode(true)}>
            <QrCodeScanner/>
            QRコードをキャプチャ
          </Button>
        }
      </>
    }
    <Snackbar open={Boolean(message)} sx={{
      bottom: {xs:'7em', sm: '7em'}, boxShadow: 3
    }} autoHideDuration={5000} onClose={e=> setMessage('')} message={message}/>
  </div>
}
export default StampSheet