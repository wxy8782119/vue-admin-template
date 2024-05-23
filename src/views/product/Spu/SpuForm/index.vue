<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option
            v-for="tm in tradeMarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" type="textarea" rows="4" placeholder="SPU描述" />
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="attrIdAndAttrName" :placeholder="`还有${unSelectSaleAttrs.length}未选择`">
          <el-option v-for="unselect in unSelectSaleAttrs" :key="unselect.id" :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" />
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <el-table style="width: 100%;margin-top:10px" border :data="spu.spuSaleAttrList">
          <el-table-column label="序号" type="index" width="80" align="center" />
          <el-table-column label="属性名" prop="saleAttrName" width="100" />
          <el-table-column label="属性值名称列表">
            <template slot-scope="{row}">
              <el-tag
                v-for="(tag,index) in row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- @keyup.enter.native="handleInputConfirm"
                 -->
              <el-input
                v-if="row.inputVisible"
                ref="saveTagInput"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @keyup.enter.native="$event.target.blur"
                @blur="handleInputConfirm(row)"
              />
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="{$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      spu: {
        // 三级分类的id
        category3Id: 0,
        // 描述
        description: '',
        // spu名称
        spuName: '',
        // 平台的id
        tmId: '',
        // spu图片信息
        spuImageList: [],
        // 平台属性与属性值
        spuSaleAttrList: []
      },
      tradeMarkList: [],
      spuImageList: [],
      saleAttrList: [],
      // 收集为选择的销售属性的id
      attrIdAndAttrName: ''
    }
  },
  computed: {
    unSelectSaleAttrs() {
      return this.saleAttrList.filter(item => {
        // every数据的方法，会返回一个布尔值（真假）
        // eslint-disable-next-line eqeqeq
        return this.spu.spuSaleAttrList.every(item2 => item2.saleAttrName != item.name)
      })
    }
  },
  methods: {
    // 照片墙删除某一个图片时会触发
    handleRemove(file, fileList) {
      // file:删除的图片对象,fileList:删除某一张图片后，剩余的其他图片
      this.spuImageList = fileList
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleSuccess(response, file, fileList) {
      this.spuImageList = fileList
    },
    initSpuData(spu) {
      // 获取SPU信息的数据
      this.$API.spu.reqSpu(spu.id).then(res => {
        this.spu = res.data
      })
      // 获取品牌的信息
      this.$API.spu.reqTradeMarkList().then(res => {
        this.tradeMarkList = res.data
      })
      // 获取SPU图片数据
      this.$API.spu.reqSpuImageList(spu.id).then(res => {
        const listArr = res.data
        listArr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = listArr
      })
      // 获取销售属性的数据
      this.$API.spu.reqBaseSaleAttrList().then(res => {
        this.saleAttrList = res.data
      })
    },
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
      const newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      }
      this.spu.spuSaleAttrList.push(newSaleAttr)
      this.attrIdAndAttrName = ''
    },
    addSaleAttrValue(row) {
      // 挂载在销售属性上的响应式拘束inputVisible，控制button与input切换
      this.$set(row, 'inputVisible', true)
      this.$set(row, 'inputValue', '')
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row
      if (inputValue.trim() === '') {
        this.$message.warning('属性值不能为空')
        return
      }
      // 属性值不能重复
      const isRepeat = row.spuSaleAttrValueList.every(item => item.saleAttrValueName !== inputValue)
      if (!isRepeat) {
        this.$message.warning('属性值不能重复')
        return
      }
      const newSaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: inputValue
      }
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      row.inputVisible = false
    },
    addOrUpdateSpu() {
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url
        }
      })
      this.$API.spu.reqAddOrUpdateSpu(this.spu).then(res => {
        this.$message.success('保存成功')
        this.$emit('changeScene', { scene: 0, type: 'save', flag: this.spu.id ? 'update' : 'add' })
        Object.assign(this._data, this.$options.data())
      })
    },
    cancel() {
      this.$emit('changeScene', { scene: 0, type: 'cancel' })
      // 清理数据
      // Object.assign:es6中新增的方式可以合并对象
      // 组件实例this._data:可以操作data当中响应式数据
      // this.$options.data:保存了组件的data的初始值
      Object.assign(this._data, this.$options.data())
    },
    addSpuData(category3Id) {
      this.spu.category3Id = category3Id
      this.$API.spu.reqTradeMarkList().then(res => {
        this.tradeMarkList = res.data
      })
      this.$API.spu.reqBaseSaleAttrList().then(res => {
        this.saleAttrList = res.data
      })
    }
  }
}
</script>

<style scoped>
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>
