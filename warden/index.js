import moment from 'moment'
import {
  r, run
} from '../stores'


const perform = async () => {
}


const start = async () => {
  await perform()
  setTimeout(
    start,
    moment.utc().endOf('minute').diff(moment.utc())
  )
}


export default {
  start
}
