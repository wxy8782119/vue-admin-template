<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        {{ spu.spuName }}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="sku名称" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" placeholder="价格(元)" type="number" />
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)" />
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" placeholder="规格描述" type="textarea" rows="4" />
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form" :inline="true" label-width="100px">
          <el-form-item v-for="attr in attrInfoList" :key="attr.id" :label="attr.attrName">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="attrValue in attr.attrValueList" :key="attrValue.id" :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" :inline="true" label-width="100px">
          <el-form-item v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id" :label="saleAttr.saleAttrName">
            <el-select v-model="saleAttr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id" :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" />
          <el-table-column label="图片" width="200">
            <template slot-scope="{row}">
              <img :src="row.imgUrl" alt="" style="width: 100px;height: 100px">
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName" />
          <el-table-column label="操作" width="100">
            <template slot-scope="{row}">
              <el-button v-if="row.isDefault == 0" type="primary" size="mini" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else size="mini">默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      skuInfo: {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        skuName: '',
        price: 0,
        weight: 0,
        skuDesc: '',
        skuDefaultImg: '',
        skuImageList: [],
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // }
        ],
        skuSaleAttrValueList: []
      },
      spu: {},
      imageList: []
    }
  },
  methods: {
    getData(categoryIds, row) {
      this.skuInfo.category3Id = categoryIds.category3Id
      this.skuInfo.spuId = row.id
      this.skuInfo.tmId = row.tmId
      this.spu = row
      // 获取spu图片的数据
      this.$API.spu.reqSpuImageList(row.id).then(res => {
        const list = res.data
        list.forEach(item => {
          item.isDefault = 0
        })
        this.spuImageList = list
      })
      // 获取销售属性的数据
      this.$API.spu.reqSpuSaleAttrList(row.id).then(res => {
        this.spuSaleAttrList = res.data
      })
      // 获取平台属性的数据
      this.$API.spu.reqAttrInfoList(categoryIds.category1Id, categoryIds.category2Id, categoryIds.category3Id).then(res => {
        this.attrInfoList = res.data
      })
    },
    handleSelectionChange(val) {
      this.imageList = val
    },
    changeDefault(row) {
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      row.isDefault = 1
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    cancel() {
      this.$emit('changeScene', { scene: 0, type: 'cancel' })
      Object.assign(this._data, this.$options.data())
    },
    save() {
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      // const arr = []
      // attrInfoList.forEach(item => {
      //   if (item.attrIdAndValueId) {
      //     const [attrId, valueId] = item.attrIdAndValueId.split(':')
      //     const obj = { valueId, attrId }
      //     arr.push(obj)
      //   }
      // })
      // 整理平台属性的数据
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          prev.push({ valueId, attrId })
        }
        return prev
      }, [])
      // 整理销售属性的数据
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])
      // 整理图片的数据
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      this.$API.spu.reqAddSku(skuInfo).then(res => {
        this.$message.success('添加成功')
        this.cancel()
      })
    }
  }
}
</script>

<style>

</style>
