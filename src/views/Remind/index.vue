<template>
  <a-card
    title="提醒工具"
    :bordered="false"
  >
    <a-row style="margin-bottom: 16px;margin-top: -8px">
      <a-button
        style="margin-left:8px"
        @click="addTask"
      >+ 添加</a-button>
    </a-row>
    <a-table
      :columns="columns"
      :dataSource="data"
      :rowKey="record=>record.id"
      :pagination="pagination"
      :loading="isLoading"
    >
      <template v-slot:action="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm
          placement="topRight"
          @confirm="handleDelete(record.id)"
        >
          <template slot="title">
            <div>是否确定要删除当前提醒？</div>
          </template>
          <a>删除</a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a-popconfirm
          placement="topRight"
          @confirm="handlePause(record.id,record.status)"
        >
          <template slot="title">
            <div>是否确定要{{record.status === '1' ? '暂停' :'启动'}}当前提醒？</div> 
          </template>
          <a>{{record.status === '1' ? '暂停' :'启动'}}</a> 
        </a-popconfirm>
      </template>
    </a-table>
    <AddModal @ok="handleEditOk" ref="addModal" />
  </a-card>

</template>
<script>
import { queryTask,pauseTask } from '../../api'  
import AddModal from './AddModal/index'
import { columns } from './columns'
import { deleteTask } from '../../api/index'
export default {
  name: 'Remind',
  components: {
    AddModal
  },
  data () {
    return {
      columns,
      data: [],
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '20', '50'],
        pageSize: 10,
        showTotal: total => `共 ${total} 条`
      },
      isLoading: false
    }
  },
  async mounted () {
    this.loadData()
  },
  methods: {
    async loadData(){
      this.isLoading = true
      const res = await queryTask()
      this.data = res.data
      this.isLoading = false
    },
    // 新增
    addTask () {
      this.$refs.addModal.edit({})
    },
    handleEditOk () {
      this.loadData()
    },
    // 编辑
    handleEdit (record) {
      this.$refs.addModal.edit({ record })
    },
    // 暂停
    async handlePause (id, status) {
      const res = await pauseTask({ id,status:status === '1' ? '-1' : '1' })
      if(res.code === 0){
        this.$message.success(`${status === '1' ? '已暂停' : '已启动'}`)
        this.loadData()
      }
    },
    // 删除
    async handleDelete (id) {
      console.log(id)
      const res = await deleteTask({ id })
      if(res.code === 0){
        this.$message.success('删除成功')
        this.loadData()
      }
    }
  },
}
</script>

<style scoped>
</style>
