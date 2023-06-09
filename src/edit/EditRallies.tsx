import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import {createTheme} from '@mui/material/styles'
import {Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Logout as LogoutIcon, Login as LoginIcon} from '@mui/icons-material/'
import {useState, useEffect} from 'react'
import useAuthUser from "../firebase/useAuthUser"
import {AdminRally} from "../validator"
import {useNavigate} from 'react-router-dom'
import {home_path} from '../config'
import {Link} from 'react-router-dom'
import {deleteRally, getAdminRallies} from '../firebase/rally-db'

type RallyWithID = AdminRally & {id: string}

createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 720,
      lg: 1025,
      xl: 1536,
    },
  }
})

const RallyCard: React.FC<{rally: RallyWithID}> = ({rally}) => {
  const navigate = useNavigate()
  const path = `/rally/${rally.read_id}`
  return <Card>
    <CardContent>
      <Typography>
        ラリー名： {rally.name}<br/>
        スタンプ数: {rally.stamps.length}<br/>
        URL: <Link to={path}>https://noji.ddnex.net{home_path}{path}</Link>
      </Typography>
    </CardContent>
    <CardActions>
      <Button sx={{fontWeight: 'bold'}} onClick={e=> {
        navigate(`/edit/${rally.id}`)
      }}>
        <EditIcon/>編集する
      </Button>
      <Button sx={{fontWeight: 'bold'}} onClick={e=> {
        if (confirm(`${rally.name}を削除してもよろしいですか？`)) {
          deleteRally(rally.read_id, rally.id)
            .then(()=> {
              alert(`${rally.name}を削除しました`)
              navigate(0)
            })
        }
      }}>
        <DeleteIcon/>削除する
      </Button>
    </CardActions>
  </Card>
}

const EditRary: React.FC = () => {
  const {user, signIn, signOut} = useAuthUser()
  const [rallies, setRallies] = useState<RallyWithID[]>([])
  const navigate = useNavigate()
  useEffect(()=> {
    if (user) getAdminRallies(user.uid).then(setRallies)
  }, [user])
  return <div style={{width: '100%', height: '100%', backgroundColor: '#E7EBF0'}}>
    <Box sx={{width: {sx: '98%', md: 720}, margin: 'auto'}}>
    {user ?
      <>
        <div>
          <Button variant='contained' onClick={e=>
            signOut().then(()=> location.reload())
          }>
            <LogoutIcon/>ログアウト
          </Button>
        </div>
        <Grid container spacing={2}>
          {rallies.map(rally=>
            <Grid item xs={12} key={rally.id}>
              <RallyCard rally={rally}/>
            </Grid>)}
        </Grid>
        <Button sx={{fontWeight: 'bold'}} onClick={e=> {
          navigate('/edit/new')
        }}>
          <AddIcon/>新しいラリーを作る
        </Button>
      </>
    : user === undefined ?
      <span>loading...</span>
    :
      <Button variant='contained' onClick={e=> signIn()}>
        <LoginIcon/>ログイン
      </Button>
    }
    </Box>
  </div>
}
export default EditRary