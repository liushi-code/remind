<template>
  <a-modal
    v-model="visible"
    :title="isAdd ? '添加' : '编辑'"
    :maskClosable="false"
    :destroyOnClose="true"
    centered
    @cancel="handleCancel"
  >
    <template slot="footer">
      <a-button
        key="back"
        @click="handleCancel"
      >取消</a-button>
      <a-button
        key="submit"
        type="primary"
        @click="handleOk"
      >确定</a-button>
    </template>
    <a-form-model
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      :label-col="{span: 7}"
      :wrapper-col="{span: 13}"
    >
      <a-form-model-item
        label="Webhook地址"
        prop="robotUrl"
      >
        <a-input
          placeholder="请输入"
          v-model.trim="ruleForm.robotUrl"
        ></a-input>
      </a-form-model-item>
      <a-form-model-item
        label="定时任务名称"
        prop="taskName"
      >
        <a-input
          placeholder="请以群名+任务名命名"
          v-model="ruleForm.taskName"
        ></a-input>
      </a-form-model-item>
      <a-form-model-item label="仅工作日提醒" prop="isWorkday">
        <a-radio-group
          v-model="ruleForm.isWorkday"
          :defaultValue="0"  
          button-style="solid"
          @change="isWorkdayChange"
        >
          <a-radio-button :value="1">
            开启
          </a-radio-button>
          <a-radio-button :value="0">
            关闭
          </a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item
        label="发送时间"
        prop="cron"
        v-if="ruleForm.isWorkday !== 1"
      >
        <a-input
          placeholder="请使用corn格式"
          v-model="ruleForm.cron"
        ></a-input>
      </a-form-model-item>
      <a-form-model-item
        label="发送时间"
        prop="sendTime"
        v-if="ruleForm.isWorkday === 1"
      >
        <a-time-picker
          v-model="ruleForm.sendTime"
          placeholder="选择时间"
        ></a-time-picker>
      </a-form-model-item>
      <a-form-model-item
        label="消息类型"
        prop="msgType"
      >
        <a-select
          v-model="ruleForm.msgType"
          @change="msgTypeChange"
        >
          <a-select-option :value="1">仅发送消息</a-select-option>
          <a-select-option :value="2">@所有人</a-select-option>
          <a-select-option :value="3">@指定人</a-select-option>
          <a-select-option :value="4">轮流@成员</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        label="提醒对象名单"
        v-if="ruleForm.msgType >= 3"
        prop="memberList"
      >
        <a-input
          placeholder="请用英文逗号隔开"
          v-model="ruleForm.memberList"
        ></a-input>
      </a-form-model-item>
      <a-form-model-item
        label="当前要提醒对象"
        prop="currentMember"
        v-if="ruleForm.msgType === 4 && ruleForm.memberList"
      >
        <a-select
          placeholder="请选择当前要提醒对象"
          v-model="ruleForm.currentMember"
        >
          <a-select-option
            v-for="item in JSON.parse(JSON.stringify(ruleForm.memberList)).split(',')"  
            :key="item"
            :value="item"
          >
            {{ item }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        label="消息内容"
        prop="msgContent"
      >
        <a-input
          placeholder="请输入消息内容"
          v-model="ruleForm.msgContent"
        ></a-input>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
import moment from 'moment'
import { addTask, editTask } from '../../../api'
export default {
  name: 'AddModal',
  data () {
    return {
      visible: false,
      isAdd: false,
      ruleForm: {
        robotUrl: '',
        taskName: '',
        cron: '',
        isWorkday: 0,
        sendTime: moment(), 
        msgType: 1,
        memberList: '',
        currentMember: '',
        msgContent: ''
      },
      rules: {
        'robotUrl': [{ required: true, message: "请先输入webhook地址" }],
        'taskName': [{ required: true, message: "请先输入定时任务名称" }],
        'msgType': [{ required: true, message: "请先选择消息类型" }],
        'msgContent': [{ required: true, message: "请输入消息内容" }],
        'memberList': [{ required: true, message: "请输入提醒成员名单" }],
        'cron': [{ required: true, message: "请输入cron格式时间" }],
        'sendTime': [{ required: true, message: "请先选择发送时间" }],
      }
    }
  },
  methods: {
    handleCancel () {
       this.ruleForm = {
        robotUrl: '',
        taskName: '',
        cron: '',
        isWorkday: 0,
        sendTime: moment(), 
        msgType: '',
        memberList: '',
        currentMember: '',
        msgContent: ''
      }
      this.visible = false
    },
    msgTypeChange(){
      if(this.ruleForm.memberList === '@all'){
        this.ruleForm.memberList = ''
      }
    },
    handleOk () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          if (this.isAdd) {
            await addTask({
              ...this.ruleForm,
              cron: this.ruleForm.isWorkday ? this.ruleForm.sendTime.format('ss mm HH * * *') : this.ruleForm.cron,
              memberList: this.handleMemberList,
              sendTime: undefined,
            }).then(res=>{
              if(res.code === 0){
                this.$message.success('定时提醒添加成功')
                this.handleCancel()
                this.$emit('ok')
              }
            })
          } else {
            await editTask({
              ...this.ruleForm,
              cron: this.ruleForm.isWorkday ? this.ruleForm.sendTime.format('ss mm HH * * *') : this.ruleForm.cron,
              memberList: this.handleMemberList,
              sendTime: undefined,
            }).then(res=>{
              if(res.code === 0){
                this.$message.success('定时提醒编辑成功')
                this.handleCancel()
                this.$emit('ok')
              }
            })
          }
        } 
      })
    },
    edit ({ record }) {
      this.isAdd = !record
      this.visible = true
      if (record) {
        if(record.isWorkday === 1){
          const [h, m, s] = record.cron.split(' ').slice(0, 3).reverse()
          const time = moment().hour(h).minute(m).second(s) 
          this.ruleForm = { ...record, sendTime: time,memberList:record.memberList.join(',') }
        }else {
          this.ruleForm = {...record,memberList:record.memberList.join(',')}   
        }
      }
    },
    async isWorkdayChange(){
      // 移除之前校验结果
      await this.$refs.ruleForm.clearValidate(['cron','sendTime'])
    }
  },
  computed: {
    handleMemberList () {
      if(this.ruleForm.msgType === 1){
        return []
      }
      return this.ruleForm.msgType === 2 ? ['@all'] : this.ruleForm.memberList.split(',')
    }
  }
}
</script>
<style scoped>
</style>