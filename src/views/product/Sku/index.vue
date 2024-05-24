<template>
  <div style="padding:0 20px">
    <el-card style="margin:20px 0">
      <el-table v-loading="loading" border style="width: 100%" :data="records">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="skuName" label="名称" />
        <el-table-column prop="skuDesc" label="描述" />
        <el-table-column prop="address" label="默认图片" width="110">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" alt="" style="width:80%;height:80%">
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="80" />
        <el-table-column prop="price" label="价格" width="80" />
        <el-table-column prop="address" label="操作" width="240">
          <template slot-scope="{row}">
            <el-button v-if="row.isSale === 0" title="上架" type="success" icon="el-icon-top" size="mini" @click="sale(row)" />
            <el-button v-else type="info" title="下架" icon="el-icon-bottom" size="mini" @click="cancel(row)" />
            <el-button type="primary" title="编辑" icon="el-icon-edit" size="mini" @click="edit" />
            <el-button type="info" title="查看sku详情" icon="el-icon-info" size="mini" @click="getSkuInfo(row)" />
            <el-button type="danger" title="删除" icon="el-icon-delete" size="mini" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align: center;margin-top:10px"
        :current-page="page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="limit"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @current-change="getSkuList"
        @size-change="handleSizeChange"
      />
      <el-drawer :visible.sync="show" :show-close="false" size="50%" @close="close">
        <el-row>
          <el-col :span="5">名称</el-col>
          <el-col :span="16">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">描述</el-col>
          <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">价格</el-col>
          <el-col :span="16">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">平台属性</el-col>
          <el-col :span="16">
            <el-tag v-for="attr in skuInfo.skuAttrValueList" :key="attr.id" style="margin: 5px" type="success">{{ attr.attrName }}</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">商品图片</el-col>
          <el-col :span="16">
            <el-carousel height="400px" style="border: 1px solid #ccc">
              <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item">
                <img :src="item.imgUrl" alt="" style="width: 100%;height: 100%">
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>

      </el-drawer>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      page: 1,
      limit: 10,
      records: [],
      total: 0,
      loading: true,
      skuInfo: {},
      show: false
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    getSkuList(page = 1) {
      this.loading = true
      this.page = page
      this.$API.sku.reqSkuList(this.page, this.limit).then(res => {
        this.records = res.data.records
        this.total = res.data.total
        this.loading = false
      })
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    },
    sale(row) {
      this.$API.sku.reqSale(row.id).then(res => {
        this.$message.success('上架成功')
        this.getSkuList(this.page)
      })
    },
    cancel(row) {
      this.$API.sku.reqCancel(row.id).then(res => {
        this.$message.success('下架成功')
        this.getSkuList(this.page)
      })
    },
    edit() {
      this.$message('暂未开发')
    },
    getSkuInfo(row) {
      this.show = true
      this.$API.sku.reqSkuById(row.id).then(res => {
        this.skuInfo = res.data
      })
    },
    close() {
      this.skuInfo = {}
    }
  }
}
</script>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
  font-weight: bold;
}
.el-col {
  margin: 10px;
}
</style>
