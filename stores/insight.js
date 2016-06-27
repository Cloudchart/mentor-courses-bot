import Model from './model'


const Insight = new Model({
  name: 'Insight',
  tableName: 'insights',

  queries: {

    newForUser: (r, models) =>
      ({ limit }) => {
        Insight.table.filter((insight) => true).limit(limit || 0)
      }

  },

})


export default Insight
