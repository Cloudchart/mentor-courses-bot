import React from 'react'


export default class extends React.Component {


  render() {
    return (
      <div>
        <h4>Bots</h4>

        <ul>
          { this.renderBots() }
        </ul>

        <a href="/bots/new">Create bot</a>
      </div>
    )
  }


  renderBots = () => {
    return this.props.bots.map(this.renderBot)
  }

  renderBot = (bot) => {
    return (
      <li key={ bot.id }>
        <a href={ '/bots/' + bot.id }>
          { bot.id }
        </a>
        <span> :: </span>
        { bot.type }
      </li>
    )
  }

}
