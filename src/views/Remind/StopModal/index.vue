<template>
  <a-modal
    v-model="visible"
    :maskClosable="false"
    :destroyOnClose="true"
    title="暂停提醒"
  >
    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button
        type="primary"
        @click="handleOk"
      >确定</a-button>
    </template>
    <a-form-model
      :label-col="{span: 7}"
      :wrapper-col="{span: 13}"
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
    >
      <a-form-model-item
        label="暂停天数"
        prop="pauseDay"
      >
        <a-input
          placeholder="请输入天数"
          v-model="ruleForm.pauseDay"
        ></a-input>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
// import { pauseTask } from '../../../api'
export default {
  name: 'StopModal',
  data () {
    return {
      id: '',
      visible: false,
      ruleForm: {
        pauseDay: ''
      },
      rules: {
        'pauseDay': [
          { required: true, message: '请输入暂停天数' },
          { pattern: /^[1-9]\d*$/, message: '请填写数字' }
        ]
      }
    }
  },
  methods: {
    edit (id) {
      this.visible = true
      this.id = id
    },
    handleCancel () {
      this.visible = false
      this.$refs.ruleForm.resetFields()
    },
    handleOk () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          console.log({ id: this.id, ...this.ruleForm })
          // await pauseTask({ id: this.id, ...this.ruleForm })
          this.$message.success('暂停成功')
        } else {
          alert('error submit!!');
          return false;
        }
        this.visible = false
      })
    },
  }
}
</script>
<style scoped>
</style>