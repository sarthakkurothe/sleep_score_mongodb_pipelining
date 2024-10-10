async function getPerceivedEnergyScores(db, date) {
  return db.collection('users').aggregate([
    {
      $lookup: {
        from: 'moods',
        let: { userId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$user', '$$userId'] },
                  { $gte: ['$createdAt', new Date(date)] },
                  { $lt: ['$createdAt', new Date(new Date(date).setDate(new Date(date).getDate() + 1))] }
                ]
              }
            }
          }
        ],
        as: 'mood_data'
      }
    },
    {
      $lookup: {
        from: 'activities',
        let: { userId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$user', '$$userId'] },
                  { $eq: ['$date', new Date(date)] }
                ]
              }
            }
          }
        ],
        as: 'activity_data'
      }
    },
    {
      $lookup: {
        from: 'sleep',
        let: { userId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$user', '$$userId'] },
                  { $eq: ['$date', new Date(date)] }
                ]
              }
            }
          }
        ],
        as: 'sleep_data'
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        date: new Date(date),
        mood_score: { $avg: '$mood_data.value' },
        activity: {
          $map: {
            input: '$activity_data',
            as: 'activity',
            in: {
              activity: '$$activity.activity',
              steps: '$$activity.steps',
              distance: '$$activity.distance',
              duration: '$$activity.duration',
              calories: '$$activity.calories'
            }
          }
        },
        sleep: {
          $arrayElemAt: [
            {
              $map: {
                input: '$sleep_data',
                as: 'sleep',
                in: {
                  sleep_score: '$$sleep.sleep_score',
                  hours_of_sleep: '$$sleep.hours_of_sleep',
                  hours_in_bed: '$$sleep.hours_in_bed'
                }
              }
            },
            0
          ]
        }
      }
    }
  ]).toArray();
}

module.exports = { getPerceivedEnergyScores };

