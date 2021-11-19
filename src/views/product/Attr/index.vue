<template>
  <div style="padding:0 20px">
    <el-card style="margin:20px 0">
      <category-select :show="!isShowTable" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <transition name="breadcrumb">
        <div v-show="isShowTable">
          <el-button type="primary" icon="el-icon-plus" :disabled="disabled" @click="addAttr">添加属性</el-button>
          <el-table v-loading="loading" :data="attrList" border style="width: 100%;margin-top:10px">
            <el-table-column label="序号" type="index" width="80" align="center" />
            <el-table-column label="属性名称" prop="attrName" width="150" />
            <el-table-column label="属性值列表">
              <template slot-scope="{row}">
                <el-tag v-for="item in row.attrValueList" :key="item.id" type="success" style="margin: 2px">
                  {{ item.valueName }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="attrName" width="150">
              <template slot-scope="{row}">
                <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)" />
                <el-button type="danger" icon="el-icon-delete" size="mini" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </transition>
      <transition name="attr-transition">
        <div v-show="!isShowTable">
          <el-form ref="form" :inline="true" label-width="80px" :model="attrInfo" style="margin-bottom: 20px">
            <el-form-item label="属性名">
              <el-input v-model="attrInfo.attrName" placeholder="请输入属性名" />
            </el-form-item>
          </el-form>
          <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName.trim().length" @click="addAttrValue">添加属性值</el-button>
          <el-button @click="isShowTable = true">取消</el-button>
          <el-table border :data="attrInfo.attrValueList" style="width: 100%;margin: 20px 0">
            <el-table-column type="index" label="序号" width="80" align="center" />
            <el-table-column label="属性值名称">
              <template slot-scope="{row,$index}">
                <el-input v-if="row.flag" :ref="$index" v-model="row.valueName" placeholder="请输入属性值名称" size="mini" @blur="toLook(row)" @keyup.native.enter="toLook(row)" />
                <span v-else style="display:block" @click="toEdit(row,$index)">{{ row.valueName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="{row,$index}">
                <el-popconfirm :title="`确定删除${row.valueName}？`" @onConfirm="deleteAttrValue($index)">
                  <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" :disabled="attrInfo.attrValueList.length<1" @click="addOrUpdateAttr">保存</el-button>
          <el-button @click="isShowTable = true">取消</el-button>
        </div>
      </transition>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash当中的深拷贝方法
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      categoryIds: [],
      attrList: [],
      isShowTable: true,
      disabled: true,
      loading: false,
      category3Id: '',
      attrInfo: {
        attrName: '', // 属性名
        attrValueList: [
          // {
          //   attrId: 0, // 属性值id
          //   valueName: '' // 属性值
          // }
        ], // 属性值列表
        categoryId: 0, // 属性所属分类id
        categoryLevel: 3 // 属性所属分类级别
      }
    }
  },
  methods: {
    getCategoryId(ids) {
      if (!ids.category1Id) {
        this.attrList = []
        this.disabled = true
      }
      if (!ids.category2Id) {
        this.attrList = []
        this.disabled = true
      }
      if (ids.category3Id) {
        this.category3Id = ids.category3Id
        this.getAttrList(ids)
      } else {
        this.attrList = []
        this.disabled = true
      }
    },
    getAttrList(ids) {
      this.loading = true
      this.categoryIds = ids
      this.$API.attr.reqAttrList(this.categoryIds.category1Id, this.categoryIds.category2Id, this.categoryIds.category3Id).then(res => {
        this.attrList = res.data
        this.disabled = false
        this.loading = false
        this.isShowTable = true
      })
    },
    addAttrValue() {
      if (this.attrInfo.attrValueList.length !== 0) {
        // eslint-disable-next-line eqeqeq
        if (this.attrInfo.attrValueList[this.attrInfo.attrValueList.length - 1].valueName.trim() == '') {
          return
        }
        const isRepat = this.attrInfo.attrValueList.some(item => {
          if (this.attrInfo.attrValueList[this.attrInfo.attrValueList.length - 1] !== item) {
            // eslint-disable-next-line eqeqeq
            return this.attrInfo.attrValueList[this.attrInfo.attrValueList.length - 1].valueName == item.valueName
          }
        })
        if (isRepat) {
          return
        }
      }
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 目前而言带给服务器的id为undefined
        valueName: '',
        flag: true
      })
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    addAttr() {
      this.isShowTable = false
      this.attrInfo = {
        attrName: '',
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3
      }
    },
    updateAttr(row) {
      this.isShowTable = false
      // 由于数据结构当中存在对象的数组，数组里面有对象，所以需要深拷贝解决这类问题
      this.attrInfo = cloneDeep(row)
      this.attrInfo.attrValueList.forEach(item => {
        // 因为Vue无法探测普通的新增property，这样书写的属性并非响应式属性，所以需要使用$set
        // 第一个参数：对象，第二个参数：属性名，第三个参数：属性值
        this.$set(item, 'flag', false)
      })
    },
    toLook(row) {
      // eslint-disable-next-line eqeqeq
      if (row.valueName.trim() == '') {
        this.$message.warning('请输入属性值')
        return
      }
      const isRepat = this.attrInfo.attrValueList.some(item => {
        if (row !== item) {
          // eslint-disable-next-line eqeqeq
          return row.valueName == item.valueName
        }
      })
      if (isRepat) {
        this.$message.warning('属性值不能重复')
        return
      }
      row.flag = false
    },
    toEdit(row, index) {
      row.flag = true
      this.$nextTick(() => {
        // 获取响应的input表单元素实现聚焦
        this.$refs[index].focus()
      })
    },
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    addOrUpdateAttr() {
      if (this.attrInfo.attrValueList[this.attrInfo.attrValueList.length - 1].valueName.trim() === '') {
        this.$message.error('属性值不能为空')
        return
      }
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        // eslint-disable-next-line eqeqeq
        if (item.valueName != '') {
          delete item.flag
          return true
        }
      })
      this.$API.attr.reqAddOrUpdateAttr(this.attrInfo).then(res => {
        this.$message.success('保存成功')
        this.isShowTable = true
        this.getAttrList(this.categoryIds)
        // this.$emit('update:visible', false)
        // this.$emit('save')
      })
    }
  }
}
</script>

