export const columns = [
  {
    title: '定时任务名称',
    dataIndex: 'taskName',
    align: 'center',
    width: '100'
  },
  {
    title: '发送时间',
    dataIndex: 'cron',
    align: 'center',
    width: '100'
  },
  {
    title: '消息类型',
    dataIndex: 'msgType',
    align: 'center',
    width: '100',
    customRender (text) {
      return showText(text)
    }
  },
  {
    title: '当前要提醒对象',
    dataIndex: 'currentMember',
    align: 'center',
    width: '100',
    customRender (text) {
      return text ? text : '-'
    }
  },
  {
    title: '消息内容',
    dataIndex: 'msgContent',
    align: 'center',
    width: '100',
    customRender (text) {
      return text ? text : '-'
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 180,
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
function showText (text) {
  const msgTypeList = [
    { id: 1, value: '仅发送消息' },
    { id: 2, value: '@所有人' },
    { id: 3, value: '@指定人' },
    { id: 4, value: '轮流@成员' },
  ]
  const msgType = msgTypeList.find(item => item.id === text)
  return msgType.value
}
