import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import {Icon} from 'leaflet'
import Markdown from 'react-markdown'
import type {Stamp} from '../validator'
import {home_path} from '../config'
import {MeLocationButton} from '../buttons'

export const marker_icon = new Icon({
  iconUrl: `${home_path}/icon/marker-icon.png`,
  iconRetinaUrl: `${home_path}/icon/marker-icon-2x.png`,
  shadowUrl: `${home_path}/icon/marker-shadow.png`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -42]
})
const end_icon = new Icon({
  iconUrl: `${home_path}/icon/spot-marker.png`,
  iconRetinaUrl: `${home_path}/icon/spot-marker.png`,
  shadowUrl: `${home_path}/icon/marker-shadow.png`,
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -42],
  shadowSize: [25, 41],
  shadowAnchor: [6, 41],
})

type Props = {
  center?: [number, number]
  stamps: Stamp[]
}
const Map: React.FC<Props> = ({stamps}) => {
  if (stamps.length === 0) return <div>loading...</div>
  const [sum_x, sum_y] = stamps.reduce(([x, y], {position: [xx, yy]})=> [x + xx, y + yy], [0,0])
  const center: [number, number] = [sum_x / stamps.length, sum_y / stamps.length]
  return (
    <MapContainer center={center} zoom={13} style={{width: '100%', height: '100%'}}>
      <TileLayer
        attribution='<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>'
        url='https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png'
      />
      {stamps.map((stamp, i)=>
        <Marker key={i} position={stamp.position}
         icon={stamp.end ? end_icon : marker_icon}
        >
          <Popup>
            <Markdown>{stamp.name}</Markdown>
          </Popup>
        </Marker>)}
      <MeLocationButton/>
    </MapContainer>)
}
export default Map