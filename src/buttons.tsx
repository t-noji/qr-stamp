import {useEffect, useState} from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import {LocationSearching, Menu as MenuIcon} from '@mui/icons-material'
import {home_path} from './config'
import {Icon, type LatLng} from 'leaflet'
import {Circle, Marker, useMapEvent} from 'react-leaflet'

export const MapMenuButton: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [anchor_ele, setAnchorEle] = useState<HTMLElement | null>(null)
  const open = Boolean(anchor_ele)
  return <>
    <IconButton sx={{
      boxShadow: 1, backdropFilter: 'blur(4px)', bgcolor: 'rgba(255,255,255,0.25)',
      zIndex: 'tooltip', position: 'absolute', top: '1.5em', right: '1.5em'
    }} 
     color='info' size='medium' onClick={e=> setAnchorEle(e.currentTarget)}>
      <MenuIcon/>
    </IconButton>
    <Menu anchorEl={anchor_ele} open={open} onClose={e=> setAnchorEle(null)} sx={{zIndex: 'tooltip'}}>
      {children}
    </Menu>
  </>
}

const locale_icon = new Icon({
  iconUrl: `${home_path}/icon/circle.png`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

export const MeLocationButton: React.FC = () => {
  const [locale, setLocale] = useState<{latlng: LatLng, accuracy: number} | null>(null)
  const map = useMapEvent('locationfound', ({latlng, accuracy})=> {
    setLocale({latlng, accuracy})
  })
  useEffect(()=> {
    map.locate({watch: true, enableHighAccuracy: true})
  }, [])
  return locale && <>
    <IconButton sx={{
      boxShadow: 1, backdropFilter: 'blur(4px)', bgcolor: 'rgba(255,255,255,0.25)',
      zIndex: 'tooltip', position: 'absolute', top: '4em', right: '1.5em'
     }}
     onClick={e=> {
      if (locale) map.flyTo(locale.latlng, map.getZoom())
     }}>
      <LocationSearching/>
    </IconButton>
    {
      locale.accuracy < 100.0 ?
        <Marker position={locale.latlng} icon={locale_icon}/>
      :
        <Circle center={locale.latlng} radius={locale.accuracy}/>
    }
  </>
}
