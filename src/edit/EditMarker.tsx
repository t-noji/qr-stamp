import {Marker, Popup} from 'react-leaflet'
import {marker_icon} from '../view/Map'
import type {StampPre} from '../validator'
import QRCode from 'qrcode'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import {QrCode, Delete as DeleteIcon} from '@mui/icons-material'

type Props = {
  stamp: StampPre
  update: (stamp: StampPre) => void
  remove: ()=> void
}
const EditMarker: React.FC<Props> = ({stamp, update, remove}) =>
  <Marker position={stamp.position} icon={marker_icon}>
    <Popup>
      <TextField value={stamp.name} onChange={e=> {
        update({...stamp, name: e.currentTarget.value})
      }} multiline rows={4}/>
      <br/>
      <Button onClick={e=> {
        QRCode.toDataURL(stamp.key, {errorCorrectionLevel: 'M'})
        .then(href=> {
          Object.assign(document.createElement('a'), {
            href, download: `${stamp.name}_qrcode.png`
          }).click()
        })
      }}>
        <QrCode/>ダウンロード
      </Button>
      <IconButton onClick={e=> {
        e.stopPropagation()
        remove()
      }}>
        <DeleteIcon/>
      </IconButton>
    </Popup>
  </Marker>
export default EditMarker