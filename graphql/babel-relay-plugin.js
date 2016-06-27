import BabelRelayPlugin from 'babel-relay-plugin'
import Schema from './schema.json'

export default BabelRelayPlugin(Schema.data)
