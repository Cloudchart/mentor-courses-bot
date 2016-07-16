import React from 'react'
import ReactDOM from 'react-dom'

import Components from './components'


let getComponentFromPath = (parent, path) => {
  if (path.length === 0)
    return parent
  let result = parent[path[0]]
  return getComponentFromPath(result, path.slice(1))
}


Array.prototype.forEach.call(document.querySelectorAll('[data-react-class]'), (node) => {
  let path = node.dataset.reactClass.split('.')
  let Component = getComponentFromPath(Components, path)

  let props = {}
  try { props = JSON.parse(node.dataset.reactProps) } catch(error) {}

  ReactDOM.render(<Component { ...props } />, node)
})
