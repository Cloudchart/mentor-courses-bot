import moment from 'moment'


let insightDuration = (insight) => {
  let duration = insight.origin.duration

  return duration
    ? `_${moment.duration(duration, 'seconds').humanize()} read_`
    : ''
}


let insightSource = (insight) => {
  let source = [insight.author, insight.origin.title]
    .filter(part => !!part)
    .join(', ')

  return source
    ? `_${source}_`
    : ''
}


export let insightText = (insight, status = '') =>
  `
    ${insight.content.trim().replace(/\[/g, '[[').replace(/\]/g, ']]')}
    ${insightSource(insight)}
    ${insightDuration(insight)}
    ${status}
  `.trim()


export let insightButtons = (insight, status = '') => {
  let buttons = []

  if (insight.origin.url)
    buttons.push([{ text: 'Source', url: insight.origin.url }])

  if (!status)
    buttons.push([
      { text: `Skip`, callback_data: 'negative' },
      { text: `I'll use it`, callback_data: 'positive' }
    ])

  return buttons
}
