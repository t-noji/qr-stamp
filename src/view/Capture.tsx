import {type FunctionComponent} from 'react'
import {QrReader} from 'react-qr-reader'
import {hash} from '../lib'

type Props = {
  captureKey: (key: string)=> void
}
const Capture: FunctionComponent<Props> = ({captureKey})=> {
  return <QrReader
    scanDelay={250}
    constraints={{facingMode: 'environment'}}
    onResult={(result, err)=> {
      if (!result) return
      hash(result.getText()).then(captureKey)
    }}
    containerStyle={{backgroundColor: 'black', height: '100%'}}
    videoContainerStyle={{paddingTop: 0, height: '100%'}}
  />
}
export default Capture