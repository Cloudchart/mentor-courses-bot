import Algolia from './algolia'

import {
  Course,
  Insight,
} from './stores'


let filterRecords = (keys) =>
  (records) =>
    records.filter(
      ({ pinboard_tags }) =>
        pinboard_tags && keys.every(key => pinboard_tags.indexOf(key) > -1)
    )


let saveRecord = async (record) => {
  let {
    user,
    origin,
    positive_reaction,
    negative_reaction
  } = record

  let attributes = {
    id      : record.objectID,
    content : record.content,
    author  : user && user.name || null,
    origin  : {
      url       : origin && origin.url      || null,
      title     : origin && origin.title    || null,
      duration  : origin && origin.duration || null,
    },
    positive_reaction,
    negative_reaction
  }

  let insight = await Insight.load(record.objectID)

  if (insight)
    await Insight.update(insight.id, attributes)
  else
    await Insight.create(attributes)
}


let loadRecords = async (course) => {
  let keys = ['course', course.name.toLowerCase()]
  let records = await Algolia.search(keys.join(',')).then(filterRecords(keys))
  await Course.update(course.id, { insights: records.map(record => record.objectID) })
  await Promise.all(records.map(record => saveRecord(record, course)))
}


let perform = async () => {
  try {
    let courses = await Course.loadAll()
    await Promise.all(courses.map(loadRecords))
  } catch(error) {
    console.error(error)
  }
}


perform()
  .then(() => process.exit(0))
