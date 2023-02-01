<template>
  <div class="dialog-container">
    <el-dialog
      title="添加身份认证SIM卡"
      :visible.sync="dialogVisible"
      width="600px"
      center
      :show-close="false"
    >
      <el-form
        :model="formData"
        ref="add"
        :rules="rules"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="囚号" prop="fxId">
          <el-input
            style="width: 220px"
            v-model="formData.fxId"
            placeholder="请输入囚号"
          ></el-input>
        </el-form-item>
        <el-form-item label="服刑人员姓名" prop="fxName">
          <el-input
            style="width: 220px"
            v-model="formData.fxName"
            placeholder="请输入服刑人员姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="关系类型" prop="relationLv2">
          <el-cascader
            v-model="relationVal"
            :options="relationList"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="家属姓名" prop="name">
          <el-input
            style="width: 220px"
            v-model="formData.name"
            placeholder="请输入家属姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="家属身份证号" prop="pid">
          <el-input
            style="width: 220px"
            v-model="formData.pid"
            placeholder="请输入家属身份证号"
          ></el-input>
        </el-form-item>
        <el-form-item label="家属手机号" prop="phoneCode">
          <el-input
            style="width: 220px"
            v-model="formData.phoneCode"
            placeholder="请输入家属手机号"
          ></el-input>
        </el-form-item>

        <el-form-item label="运营商" prop="operator">
          <el-select
            v-model="formData.operator"
            placeholder="请选择运营商"
            style="width: 220px"
          >
            <el-option label="移动" value="移动"></el-option>
            <el-option label="电信" value="电信"></el-option>
            <el-option label="联通" value="联通"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户经理" prop="manager">
          <el-input
            v-model="formData.manager"
            placeholder="请输入客户经理"
          ></el-input>
        </el-form-item>
        <el-form-item label="家属头像" prop="imgProfilePhotoUrl">
          <el-upload
            :action="uploadUrl"
            class="avatar-box"
            :show-file-list="false"
            :headers="uploadHeader"
            :on-success="
              (res, file) => handleAvatarSuccess(res, file, 'profilePhoto')
            "
          >
            <img
              v-if="formData.imgProfilePhotoUrl"
              :src="formData.imgProfilePhotoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="身份证正面" prop="imgPidZUrl">
          <el-upload
            class="avatar-box"
            style="width: 224px; height: 125px"
            :action="uploadUrl"
            :show-file-list="false"
            :headers="uploadHeader"
            :on-success="(res, file) => handleAvatarSuccess(res, file, 'pidZ')"
          >
            <img
              v-if="formData.imgPidZUrl"
              :src="formData.imgPidZUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="身份证反面" prop="imgPidBUrl">
          <el-upload
            class="avatar-box"
            style="width: 224px; height: 125px"
            :action="uploadUrl"
            :show-file-list="false"
            :headers="uploadHeader"
            :on-success="(res, file) => handleAvatarSuccess(res, file, 'pidB')"
          >
            <img
              v-if="formData.imgPidBUrl"
              :src="formData.imgPidBUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="辅助证明" prop="imgAssistUrl">
          <el-upload
            class="avatar-box"
            style="width: 224px; height: 125px"
            :action="uploadUrl"
            :headers="uploadHeader"
            :show-file-list="false"
            :on-success="
              (res, file) => handleAvatarSuccess(res, file, 'assist')
            "
          >
            <img
              v-if="formData.imgAssistUrl"
              :src="formData.imgAssistUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { cloneDeep } from 'lodash'
export default {
  data() {
    return {
      rules: {
        fxId: [{ required: true, message: '请填写囚号', trigger: 'blur' }],
        fxName: [
          { required: true, message: '请输入服刑人员姓名', trigger: 'blur' }
        ],
        relationVal: [
          {
            required: true,
            message: '请选择关系类型',
            trigger: 'change'
          }
        ],
        name: [{ required: true, message: '请输入家属姓名', trigger: 'blur' }],
        pid: [
          { required: true, message: '请输入家属身份证号', trigger: 'blur' }
        ],
        phoneCode: [
          { required: true, message: '请输入家属手机号', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择家属性别', trigger: 'change' }
        ],
        censusRegister: [
          { required: true, message: '请输入户籍所在地', trigger: 'blur' }
        ],
        issuingAuthority: [
          { required: true, message: '请输入身份证签发机关', trigger: 'blur' }
        ],
        validPeriodStart: [
          {
            required: true,
            message: '请选择身份证有效期开始时间',
            trigger: 'change'
          }
        ],
        validPeriodEnd: [
          {
            required: true,
            message: '请选择身份证有效期结束时间',
            trigger: 'change'
          }
        ],
        address: [
          { required: true, message: '请输入家庭住址', trigger: 'blur' }
        ],
        operator: [
          { required: true, message: '请选择运营商', trigger: 'change' }
        ],
        manager: [
          { required: true, message: '请输入客户经理', trigger: 'blur' }
        ],
        profilePhotoImgId: [
          { required: true, message: '请上传家属头像', trigger: 'blur' }
        ],
        pidZImgId: [
          { required: true, message: '请上传身份证正面', trigger: 'blur' }
        ],
        pidBImgId: [
          { required: true, message: '请上传身份证反面', trigger: 'blur' }
        ]
        // assistImgId: [
        //   { required: true, message: '请上传辅助正证明', trigger: 'change' }
        // ],
      },
      formData: {},
      relationVal: [],
      dialogVisible: false,
      relationList: [],
      uploadHeader: {
        Authorization: 'Bearer ' + getToken()
      },
      uploadUrl: process.env.VUE_APP_BASE_API + '/upload/upload-image'
    }
  },
  props: ['rowData'],
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.initData()
        this.formData = Object.assign(this.formData, cloneDeep(this.rowData))
        this.$refs.add && this.$refs.add.resetFields()
      }
    }
  },
  mounted() {
    this.getRalationList()
  },
  methods: {
    handleAvatarSuccess(res, file, type) {
      if (res.code !== 0) return this.$message.warning('服务器出错，请稍后再试')
      this.formData[
        'img' + type.slice(0, 1).toUpperCase() + type.slice(1) + 'Url'
      ] = URL.createObjectURL(file.raw)
      this.formData[type + 'ImgId'] = res.result.imgId
    },
    async getRalationList() {
      const res = await this.$api.getRelationList()
      this.relationList = res.map(item => {
        const obj = {
          label: item.lv1,
          value: item.lv1,
          children: []
        }
        obj.children = item.lv2.map(_item => {
          return {
            label: _item,
            value: _item
          }
        })
        return obj
      })
    },
    initData() {
      this.formData = {
        prisonId: sessionStorage.getItem('prisonId'),
        fxId: '', // 囚号
        fxName: '', //  囚犯姓名
        relationLv1: '', // 家属关系类型
        relationLv2: '', // 家属关系
        pid: '', // 家属身份证号
        name: '', // 家属姓名
        phoneCode: '', //手机号
        operator: '', // "运营商"
        manager: '', // "客户经理"
        profilePhotoImgId: '', // 家属头像图片Id
        pidZImgId: '', // 身份证正面图片Id
        pidBImgId: '', // 身份证反面图片Id
        assistImgId: '', // 辅助证明图片Id
        imgProfilePhotoUrl: '',
        imgPidZUrl: '',
        imgPidBUrl: ''
      }
      this.relationVal = [this.rowData.relationLv1, this.rowData.relationLv2]
    },
    handleChange(value) {
      this.formData.relationLv1 = val[0]
      this.formData.relationLv2 = val[1]
    },
    submit() {
      this.$refs.add.validate(async valid => {
        if (!valid) return
        const params = {
          orgPid: this.rowData.pid,
          orgPhoneCode: this.rowData.phoneCode,
          ...this.formData
        }
        await this.$api.modifyPhoneCodeWhite(params)
        this.$message.success('新增成功')
        this.dialogVisible = false
        this.$emit('reload')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container {
  ::v-deep .el-dialog {
    border-radius: 6px;
    .el-dialog__header {
      font-size: 18px;
      text-align: center;
      font-weight: 500;
      background: #3182ff;
      padding: 0;
      line-height: 54px;
      border-radius: 4px 4px 0px 0px;
      .el-dialog__title {
        color: #ffffff;
      }
    }
  }
  .dialog-footer {
    button {
      width: 100px;
      &:nth-of-type(1) {
        margin-right: 20px;
      }
    }
  }
}
.avatar-box {
  width: 160px;
  height: 160px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  ::v-deep .el-upload {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .avatar-uploader-icon {
    font-size: 24px;
    color: #8c939d;
  }
}
.manage-area {
  .el-checkbox-group {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 10px 0 10px 30px;
    background: #fafafa;
    margin-top: -5px;
    .el-checkbox {
      width: 80px;
    }
  }
}
</style>
