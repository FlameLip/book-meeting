const Mock = require('mockjs')

const data = Mock.mock({
  'items|10': [
    {
      uname: '@sentence(2, 3)',
      verifyLv: 'verify-lv1',
      isSafety: true,
      manageAreaList: [
        {
          id: 'area1',
          name: '监区1'
        },
        {
          id: 'area2',
          name: '监区2'
        }
      ]
    }
  ]
})

module.exports = [
  {
    url: '/user/list',
    type: 'post',
    response: config => {
      const items = data.items
      return {
        code: 0,
        total: items.length,
        list: items
      }
    }
  }
]
