export let chain = async (fns, context) => {
  let fn = fns[0], next = false

  if (!fn && fns.length > 1)
    return await chain(fns.slice(1), context)

  let result = fn && await fn(context, () => next = true)

  if (next)
    return await chain(fns.slice(1), context)

  if (result instanceof Error)
    throw result

  return result
}
