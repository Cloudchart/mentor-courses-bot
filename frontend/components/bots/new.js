import fetch from 'fbjs/lib/fetch'

import React from 'react'

export default class extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      errors  : [
      ],
      attributes: {
        title : '',
        token : '',
        type  : 'messenger'
      }
    }
  }


  handleChange = (fieldName) =>
    (event) =>
      this.setState({
        attributes: {
          ...this.state.attributes,
          [fieldName] : event.target.value
        }
      })


  handleCreate = () => {
    fetch('/bots', {
      method: 'post',
      headers: {
        'Accept'        : 'application/json',
        'Content-Type'  : 'application/json',
      },
      body: JSON.stringify(this.state.attributes)
    })
      .then(response => response.json())
      .then(response => {
        if (response.errors)
          this.setState({ errors: response.errors })
      })
  }


  render() {
    return (
      <div>
        <h4>New bot</h4>

        <div>
          { this.renderTitleInput() }
          <br />
          { this.renderTokenInput() }
          <br />
          { this.renderTypeSelect() }
          <br />
          <button onClick={ this.handleCreate }>Create</button>
        </div>

        <br />

        <a href="/bots">Back</a>
      </div>
    )
  }


  renderTitleInput = () => {
    return [
      <label key='label' style={{ display: 'inline-block', width: 100 }}>Title:</label>
      ,
      <input key='input' value={ this.state.attributes.title } onChange={ this.handleChange('title') } style={{ width: 200 }} />
    ]
  }


  renderTokenInput = () => {
    return [
      <label key='label' style={{ display: 'inline-block', width: 100 }}>Token:</label>
      ,
      <input key='input' value={ this.state.attributes.token } onChange={ this.handleChange('token') } style={{ width: 400 }} />
    ]
  }


  renderTypeSelect = () => {
    return [
      <label key='label' style={{ display: 'inline-block', width: 100 }}>Type:</label>
      ,
      <select key='select' value={ this.state.attributes.type } onChange={ this.handleChange('type') }>
        <option value='messenger'>Messenger</option>
        <option value='telegram'>Telegram</option>
      </select>
    ]
  }


}
