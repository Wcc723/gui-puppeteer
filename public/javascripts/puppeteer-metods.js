
export default {
  waitForTimeout: {
    name: 'waitForTimeout',
    description: '等待時間',
    parameterType: 'number',
    parameterDescription: '毫秒'
  },
  waitForSelector: {
    name: 'waitForSelector',
    description: '等待特定元素出現',
    parameterType: 'string',
    parameterDescription: '元素 DOM'
  },
  click: {
    name: 'click',
    description: '點擊一個目標',
    parameterType: 'string',
    parameterDescription: '元素 DOM'
  },
  type: {
    name: 'type',
    description: '針對一個 input 輸入內容',
    parameterType: 'array',
    parameterDescription: ['元素 DOM', '輸入的內容']
  },
}