let buildTelegramInlineKeyboard = (buttons) =>
  buttons.map(button => {
    return {
      text          : button.text,
      callback_data : button.id,
    }
  })


let buildFacebookMessengerButtons = (buttons) =>
  buttons.map(button => {
    return {
      type    : 'postback',
      title   : button.text,
      payload : button.id
    }
  })


class Message {

  constructor(text, buttons = []) {
    this.text     = text
    this.buttons  = [].concat(buttons)
  }


  async forTelegram() {
    await this.prepareButtons()
    return {
      text          : this.text,
      reply_markup  : {
        inline_keyboard : [buildTelegramInlineKeyboard(this.buttons)]
      }
    }
  }


  async forFacebookMessenger() {
    await this.prepareButtons()
    return {
      type          : 'template',
      template_type : 'button',
      text          : this.text,
      buttons       : buildFacebookMessengerButtons(this.buttons)
    }
  }


  async prepareButtons() {
    if (this.buttons.length === 0) return
    // cleanup previous payloads
    // create new payload for each button
  }

}


export default Message
