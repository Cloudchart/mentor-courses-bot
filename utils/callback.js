let resolveInsightCallback = async (user, payload, insightID) => {
  let insight = await user.query('insight', { id: insightID }, true)

  if (payload.data === 'positive') {
    await user.mutation('rateInsight', {
      rate: 1,
      insight,
      user,
    })
    return true
  }

  if (payload.data === 'negative') {
    await user.mutation('rateInsight', {
      rate: -1,
      insight,
      user,
    })
    return true
  }

  return false
}


export const resolve = async (user, payload) => {
  let pendingMessage = await user.query('pendingMessage', {}, true)
    .then(({ pendingMessage }) => pendingMessage)

  if (!pendingMessage)
    return false

  if (pendingMessage.id !== payload.message.message_id.toString())
    return false

  switch (pendingMessage.sourceType) {
    case 'Insight':
      return resolveInsightCallback(user, payload, pendingMessage.sourceID)
  }
}
