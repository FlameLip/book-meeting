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
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="囚号" prop="fxId" required>
          <el-input
            style="width: 220px"
            v-model="formData.fxId"
            placeholder="请输入囚号"
          ></el-input>
        </el-form-item>
        <el-form-item label="服刑人员姓名" prop="fxName" required>
          <el-input
            style="width: 220px"
            v-model="formData.fxName"
            placeholder="请输入服刑人员姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="关系类型" prop="relationVal" required>
          <el-cascader
            v-model="formData.relationVal"
            :options="relationList"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="家属姓名" prop="name" required>
          <el-input
            style="width: 220px"
            v-model="formData.name"
            placeholder="请输入家属姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="家属身份证号" prop="pid" required>
          <el-input
            style="width: 220px"
            v-model="formData.pid"
            placeholder="请输入家属身份证号"
          ></el-input>
        </el-form-item>
        <el-form-item label="家属手机号" prop="phoneCode" required>
          <el-input
            style="width: 220px"
            v-model="formData.phoneCode"
            placeholder="请输入家属手机号"
          ></el-input>
        </el-form-item>

        <el-form-item label="家属性别" prop="gender" required>
          <el-select
            v-model="formData.gender"
            placeholder="请选择家属性别"
            style="width: 220px"
          >
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="户籍所在地" prop="censusRegister" required>
          <el-input
            style="width: 220px"
            v-model="formData.censusRegister"
            placeholder="请输入户籍所在地"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证签发机关" prop="issuingAuthority" required>
          <el-input
            style="width: 220px"
            v-model="formData.issuingAuthority"
            placeholder="请输入身份证签发机关"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="身份证有效期开始时间"
          prop="validPeriodStart"
          required
        >
          <el-date-picker
            v-model="formData.validPeriodStart"
            type="dates"
            style="width: 220px"
            format="yyyy.MM.dd"
            value-format="yyyy.MM.dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="身份证有效期结束时间"
          prop="validPeriodEnd"
          required
        >
          <el-date-picker
            v-model="formData.validPeriodEnd"
            type="dates"
            style="width: 220px"
            format="yyyy.MM.dd"
            value-format="yyyy.MM.dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="家庭住址" prop="address" required>
          <el-input
            v-model="formData.address"
            placeholder="请输入家庭住址"
          ></el-input>
        </el-form-item>
        <el-form-item label="运营商" prop="operator" required>
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
        <el-form-item label="客户经理" prop="manager" required>
          <el-input
            v-model="formData.manager"
            placeholder="请输入客户经理"
          ></el-input>
        </el-form-item>
        <el-form-item label="家属头像" prop="profilePhotoImgId" required>
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
              v-if="profilePhotoImgUrl"
              :src="profilePhotoImgUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="身份证正面" prop="pidZImgId" required>
          <el-upload
            class="avatar-box"
            style="width: 224px; height: 125px"
            :action="uploadUrl"
            :show-file-list="false"
            :headers="uploadHeader"
            :on-success="(res, file) => handleAvatarSuccess(res, file, 'pidZ')"
          >
            <img v-if="pidZImgUrl" :src="pidZImgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="身份证反面" prop="pidBImgId">
          <el-upload
            class="avatar-box"
            style="width: 224px; height: 125px"
            :action="uploadUrl"
            :show-file-list="false"
            :headers="uploadHeader"
            :on-success="(res, file) => handleAvatarSuccess(res, file, 'pidB')"
          >
            <img v-if="pidBImgUrl" :src="pidBImgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="辅助证明" prop="assistImgId">
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
            <img v-if="assistImgUrl" :src="assistImgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
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
export default {
  data() {
    return {
      rules: {
        uname: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        passwd: [
          { required: true, message: '请填写登录密码', trigger: 'blur' }
        ],
        verifyLv: [
          { required: true, message: '请选择审核权限', trigger: 'change' }
        ],
        isSafety: [
          {
            required: true,
            message: '请选择是否控制安全级别',
            trigger: 'change'
          }
        ],
        manageAreaList: [
          {
            type: 'array',
            required: true,
            message: '请至少选择管理区域',
            trigger: 'change'
          }
        ]
      },
      formData: {},
      dialogVisible: false,
      profilePhotoImgUrl: '',
      pidZImgUrl: '',
      pidBImgUrl: '',
      assistImgUrl: '',
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
      this[type + 'ImgUrl'] = URL.createObjectURL(file.raw)
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
        relationVal: [],
        fxId: 'pr-id-0004', // 囚号
        fxName: '赵六', //  囚犯姓名
        relationLv1: '兄弟姐妹', // 家属关系类型
        relationLv2: '弟弟', // 家属关系
        pid: 'pr-4-pid-0005', // 家属身份证号
        name: '赵七', // 家属姓名
        phoneCode: '13800138005', //手机号
        gender: '男', // 性别
        censusRegister: '广东深圳', // 户籍所在地
        issuingAuthority: '广东省深圳市', // "身份证签发机关"
        validPeriodStart: '2020.10.10', // "身份证有效期开始时间" 2020.10.10
        validPeriodEnd: '2020.10.10', // "身份证有效期开始时间" 2020.10.10
        address: '广东省深圳市福田区', // "家庭住址"
        operator: '移动', // "运营商"
        manager: '客户经理1', // "客户经理"
        profilePhotoImgId: '', // 家属头像图片Id
        pidZImgId: '', // 身份证正面图片Id
        pidBImgId: '', // 身份证反面图片Id
        assistImgId: '' // 辅助证明图片Id
      }
    },
    submit() {
      this.$refs.add.validate(async valid => {
        if (!valid) return
        this.formData.relationLv1 = this.formData.relationVal[0]
        this.formData.relationLv2 = this.formData.relationVal[1]
        await this.$api.addPhoneCodeWhite(this.formData)
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
