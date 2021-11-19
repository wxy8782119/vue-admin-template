<template>
  <div style="padding: 10px">
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0" @click="showDialog">添加</el-button>
    <el-table v-loading="listLoading" style="width: 100%" border :data="list" element-loading-text="数据正在加载中...">
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="tmName" label="品牌名称" />
      <el-table-column prop="logoUrl" label="品牌LOGO">
        <template slot-scope="{row}">
          <img :src="row.logoUrl" alt="" style="width: 50px;height: 50px">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作">
        <template slot-scope="{row}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="[10, 20, 30, 40]"
      :current-page="page"
      :total="total"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      style="text-align: center;margin-top:20px"
      @size-change="handleSizeChange"
      @current-change="getPageList"
    />
    <el-dialog :title="tmForm.id?'修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible" @close="resetForm()">
      <el-form ref="ruleForm" style="width: 80%" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Trademark',
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      list: [],
      listLoading: true,
      dialogFormVisible: false,
      tmForm: {
        logoUrl: '',
        tmName: ''
      },
      rules: {
        // required:必须要校验字段，message:提示信息，trigger:触发方式(事件设置：blur、change)
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请上传品牌LOGO' }
        ]
      }
    }
  },
  mounted() {
    this.getPageList()
  },
  methods: {
    handleSizeChange(limit) {
      this.limit = limit
      this.getPageList()
    },
    getPageList(pager = 1) {
      this.page = pager
      this.listLoading = true
      const { page, limit } = this
      this.$API.trademark.reqTradeMarkList(page, limit).then(res => {
        this.total = res.data.total
        this.list = res.data.records
        this.listLoading = false
      })
    },
    showDialog() {
      this.dialogFormVisible = true
      this.tmForm = {
        logoUrl: '',
        tmName: ''
      }
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    updateTradeMark(row) {
      this.dialogFormVisible = true
      // 深拷贝
      this.tmForm = { ...row }
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // res:上传成功之后返回前端数据
      // file:上传成功之后服务器返回前端数据
      // console.log('res:', res)
      // console.log('file:', file)
      if (res.code !== 200) {
        return this.$message.error(res.message)
      }
      this.tmForm.logoUrl = res.data
      // this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 图片上传前
    beforeAvatarUpload(file) {
      // console.log('beforeAvatarUpload:', file)
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 0.5
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 500kb!')
      }
      return isJPG && isLt2M
    },
    addOrUpdateTrademark() {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
        this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm).then(res => {
          this.dialogFormVisible = false
          this.$message.success(this.tmForm.id ? '修改品牌成功' : '添加品牌成功')
          this.getPageList(this.tmForm.id ? this.page : 1)
        })
      })
    },
    deleteTradeMark(row) {
      this.$confirm(`你确定删除${row.tmName}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false
      }).then(() => {
        this.$API.trademark.reqDeleteTradeMark(row.id).then(res => {
          this.$message.success('删除品牌成功')
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
