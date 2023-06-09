import {MapContainer, TileLayer, useMapEvent} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type {LatLng} from 'leaflet'
import type {AdminRally} from '../validator'
import EditMarker from './EditMarker'
import {MapMenuButton, MeLocationButton} from '../buttons'
import MenuItem from '@mui/material/MenuItem'

const ClickComponent = ({on}: {on: (latlng: LatLng)=> void}) => {
  useMapEvent('click', e=> {
    on(e.latlng)
  })
  return null
}

type Props = {
  stamps: AdminRally['stamps']
  setStamps: (stamps: AdminRally['stamps'])=> void
}
const EditMap: React.FC<Props> = ({stamps, setStamps}) => {
  const [sum_x, sum_y] = stamps.reduce(([x, y], {position: [xx, yy]})=> [x + xx, y + yy], [0,0])
  const center: [number, number] = [sum_x / stamps.length, sum_y / stamps.length]
  return <div style={{width: '100%', height: '100%'}}>
    <MapContainer center={stamps.length ? center : [35.681156, 139.767838]}
      zoom={13}
      style={{width: '100%', height: '100%'}}
    >
      <TileLayer
        attribution='<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>'
        url='https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png'
      />
      {stamps.map((stamp, i)=>
        <EditMarker key={i} stamp={stamp}
         update={stamp=> {
          setStamps(stamps.map(s=> s.key === stamp.key ? stamp : s))
         }}
         remove={()=> setStamps(stamps.filter(s=> s.key !== stamp.key))}
        />)}
      <ClickComponent on={latlng=> {
        setStamps([...stamps, {
          name: 'test', position: [latlng.lat, latlng.lng], key: crypto.randomUUID()
        }])
      }}/>
      <MeLocationButton/>
      <MapMenuButton>
        <MenuItem onClick={e=> {
          setStamps([])
        }}>リセット</MenuItem>
      </MapMenuButton>
    </MapContainer>
  </div>
}
export default EditMap