<template>
  <div style="padding:0 20px">
    <el-card style="margin:20px 0">
      <category-select :show="scene != 0" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <transition name="breadcrumb">
        <div v-show="scene == 0">
          <el-button type="primary" icon="el-icon-plus" :disabled="disabled" @click="addSpu">添加SPU</el-button>
          <el-table v-loading="loading" style="width: 100%;margin-top:10px" border :data="records">
            <el-table-column type="index" label="序号" width="80" align="center" />
            <el-table-column label="SPU名称" prop="spuName" />
            <el-table-column label="SPU描述" prop="description" />
            <el-table-column label="操作">
              <template slot-scope="{row}">
                <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)" />
                <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="undateSpu(row)" />
                <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="hander(row)" />
                <el-popconfirm :title="`确定删除${row.spuName}吗？`" @onConfirm="deleteSpu(row)">
                  <hint-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu" />
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="text-align:center"
            :current-page="page"
            :page-sizes="[3, 5, 10, 20]"
            :page-size="limit"
            layout="prev, pager, next, jumper, ->, sizes, total"
            :total="total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </div>
      </transition>
      <transition name="attr-transition">
        <spu-form v-show="scene == 1" ref="spu" @changeScene="changeScene" />
      </transition>
      <transition name="attr-transition">
        <sku-form v-show="scene == 2" ref="sku" @changeScene="changeScene" />
      </transition>
    </el-card>
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible">
      <el-table v-loading="skuLoading" :data="skuList" style="width: 100%" border>
        <el-table-column prop="skuName" label="名称" width="150" />
        <el-table-column prop="price" label="价格" width="200" />
        <el-table-column prop="weight" label="重量" />
        <el-table-column label="默认图片">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" alt="" style="width: 100px;height: 100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuForm from './SkuForm'
import SpuForm from './SpuForm'
export default {
  name: 'Spu',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    SpuForm,
    // eslint-disable-next-line vue/no-unused-components
    SkuForm
  },
  data() {
    return {
      categoryIds: [],
      disabled: true,
      loading: false,
      category3Id: '',
      page: 1,
      limit: 5,
      records: [],
      total: 0,
      scene: 0, // 0:列表数据 1:添加/修改数据spu 2:添加sku
      dialogTableVisible: false,
      spu: {},
      skuList: [],
      skuLoading: false
    }
  },
  methods: {
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList(this.categoryIds)
    },
    handleCurrentChange(page) {
      this.page = page
      this.getSpuList(this.categoryIds)
    },
    getCategoryId(ids) {
      if (!ids.category1Id) {
        this.records = []
        this.total = 0
        this.disabled = true
      }
      if (!ids.category2Id) {
        this.records = []
        this.total = 0
        this.disabled = true
      }
      if (ids.category3Id) {
        this.category3Id = ids.category3Id
        this.page = 1
        this.getSpuList(ids)
      } else {
        this.records = []
        this.total = 0
        this.disabled = true
      }
    },
    getSpuList(ids) {
      this.loading = true
      this.categoryIds = ids
      this.$API.spu.reqSpuList(this.page, this.limit, ids.category3Id).then(res => {
        this.records = res.data.records
        this.total = res.data.total
        this.disabled = false
        this.loading = false
        this.scene = 0
      })
    },
    addSpu() {
      this.scene = 1
      this.$refs.spu.addSpuData(this.category3Id)
    },
    undateSpu(row) {
      this.scene = 1
      this.$refs.spu.initSpuData(row)
    },
    changeScene(code) {
      this.scene = code.scene
      // eslint-disable-next-line eqeqeq
      if (code.type == 'save') {
        // eslint-disable-next-line eqeqeq
        if (code.flag == 'add') this.page = 1
        this.getSpuList(this.categoryIds)
      }
    },
    deleteSpu(row) {
      this.$API.spu.reqDeleteSpu(row.id).then(res => {
        this.$message.success('删除成功')
        this.page = this.records.length > 1 ? this.page : this.page - 1
        this.getSpuList(this.categoryIds)
      })
    },
    addSku(row) {
      this.scene = 2
      this.$refs.sku.getData(this.categoryIds, row)
    },
    hander(row) {
      this.skuList = []
      this.skuLoading = true
      this.dialogTableVisible = true
      this.spu = row
      this.$API.spu.reqSkuList(row.id).then(res => {
        this.skuList = res.data
        this.skuLoading = false
      })
    }
  }
}
</script>

<style>

</style>
