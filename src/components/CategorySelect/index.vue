<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select v-model="cForm.category1Id" placeholder="请选择" :disabled="show" :loading="loading" @change="handler1" @visible-change="visibleChange">
          <el-option v-for="item in category1List" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.category2Id" placeholder="请选择" :disabled="show" @change="handler2">
          <el-option v-for="item in category2List" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.category3Id" placeholder="请选择" :disabled="show" @change="handler3">
          <el-option v-for="item in category3List" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  // eslint-disable-next-line vue/require-prop-types
  props: ['show'],
  data() {
    return {
      category1List: [],
      category2List: [],
      category3List: [],
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      },
      loading: true
    }
  },
  methods: {
    visibleChange(e) {
      if (e) {
        if (this.category1List.length === 0) {
          this.getCategory1List()
        }
      }
    },
    getCategory1List() {
      this.$API.attr.reqCategory1List().then(res => {
        this.loading = false
        this.category1List = res.data
      })
    },
    handler1(e) {
      this.category2List = []
      this.category3List = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      this.$emit('getCategoryId', this.cForm)
      this.$API.attr.reqCategory2List(e).then(res => {
        this.category2List = res.data
      })
    },
    handler2(e) {
      this.category3List = []
      this.cForm.category3Id = ''
      this.$emit('getCategoryId', this.cForm)
      this.$API.attr.reqCategory3List(e).then(res => {
        this.category3List = res.data
      })
    },
    handler3() {
      this.$emit('getCategoryId', this.cForm)
    }
  }
}
</script>

<style scoped>
.el-form-item{
    margin-bottom: 0;
}
</style>
