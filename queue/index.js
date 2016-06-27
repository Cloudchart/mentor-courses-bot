import kue from 'kue'

import jobs from './jobs'


const queue = kue.createQueue({
  prefix  : 'courses-queue',
  redis   : process.env.REDIS_URL
})


const start = () => {
  for (let jobName in jobs)
    queue.process(jobName, jobs[jobName].process)
}


let clearDelayedJob = (job_id, user_id) =>
  new Promise((resolve, reject) => {
    kue.Job.get(job_id, (error, job) => {
      if (error)
        return reject(error)
      if (job.data.user_id === user_id)
        job.remove(resolve)
    })
  })


const clear = (user_id) =>
  new Promise((resolve, reject) => {
    queue.delayed((error, ids) => {
      if (error) return reject(error)
      Promise
        .all(ids.map(id => clearDelayedJob(id, user_id)))
        .then(resolve)
    })
  })


const enqueue = (job_name, user_id, payload) => {

}


export default {
  start,
  clear,
  enqueue,
}
