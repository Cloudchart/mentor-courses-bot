import algolia from 'algoliasearch'


const SearchIndex = algolia(
  process.env.ALGOLIA_CLIENT_ID,
  process.env.ALGOLIA_CLIENT_SECRET
).initIndex(process.env.ALGOLIA_INDEX_NAME)


const SearchConfig = {
  hitsPerPage             : 250,
  attributesToRetrieve    : [
    'objectID',
    'content',
    'pinboard_tags',
    'origin',
    'user',
    'positive_reaction',
    'negative_reaction',
  ].join(','),
  attributesToHighlight   : 'none'
}


const search = (query, options) =>
  SearchIndex
    .search(query, { ...SearchConfig, ...options })
    .then(({ hits }) => hits)


export default {
  search
}
