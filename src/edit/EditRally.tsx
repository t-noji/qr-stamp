import {useState, useEffect} from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import {Close} from '@mui/icons-material'
import EditMap from './EditMap'
import {AdminRally} from '../validator'
import {createRally, updateRally, getAdminRally} from '../firebase/rally-db'
import {hash} from '../lib'
import {useNavigate, useParams} from 'react-router-dom'
import useAuthUser from '../firebase/useAuthUser'

type Props = {
  id: string | 'new'
}
const EditRally: React.FC = () => {
  const {user} = useAuthUser()
  const uid = user?.uid
  const {id} = useParams<Props>()
  const navigate = useNavigate()
  const exit = ()=> navigate('/edit')
  const is_new = id === 'new'
  const [rally, setRally] = useState<AdminRally>()
  useEffect(()=> {
    if (!uid) return
    if (!is_new && id) getAdminRally(id).then(rally=> setRally(rally))
    else setRally({
      name: '',
      read_id: '',
      uid,
      stamps: []
    })
  }, [uid, id])
  if (!uid || !id) return <div>
    <Button variant='contained' onClick={exit}>
      ラリー一覧に戻る
    </Button>
  </div>
  return rally ?
    <>
      <TextField sx={{height: '4em', marginTop: '1em',  width: 'calc(100% - 4em)'}}
       label='スタンプラリー名' variant='outlined' value={rally.name}
       onChange={e=> {
        setRally({...rally, name: e.currentTarget.value})
       }}/>
      <IconButton onClick={exit} sx={{marginTop: '0.5em', marginleft: '0.5em'}} size='large'>
        <Close fontSize='large'/>
      </IconButton>
      <div style={{width: '100%', height: 'calc(100% - 3em)'}}>
        <EditMap stamps={rally.stamps} setStamps={stamps=> setRally({...rally, stamps})}/>
      </div>
      <Button sx={{zIndex: 'tooltip', position: 'absolute', bottom: '3em', left: '4em', right: '4em'}} 
       variant='contained' size='large' onClick={e=> {
        if (rally.stamps.length === 0) {
          alert('スタンプが一つもありません')
          return
        }
        else if (rally.name === '') {
          alert('スタンプラリー名が未入力です')
          return
        }
        if (confirm('保存してよろしいですか？')) {
          Promise.all(rally.stamps.map(stamp=> hash(stamp.key).then(key=> ({...stamp, key}))))
          .then(hash_stamps=> {
            if (is_new) createRally({name: 'test', admin_id: uid, stamps: hash_stamps}, rally)
              .then(([id])=> {
                alert('スタンプラリーを作成しました。\nキー: ' + id)
                exit()
              })
            else updateRally(
                rally.read_id, {name: rally.name, stamps: hash_stamps},
                id, {name: rally.name, stamps: rally.stamps}
              )
              .then(()=> {
                alert('スタンプラリーを更新しました。\nキー: ' + id)
                exit()
              })
          })
        }
      }}>保存</Button>
    </>
  :
    <div>loading...</div>
}
export default EditRally