<template>
  <div class="mod-config" style="padding: 10px">
    <el-button type="primary" @click="add">新增</el-button>
    <el-dialog title="天车配置" :visible.sync="dialogVisible" width="18%">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="天车名" prop="craneName">
          <el-input v-model="form.craneName" style="width: 95%"></el-input>
        </el-form-item>
        <el-form-item label="跨号" prop="crossId">
          <el-select v-model="form.crossId" placeholder="请选择跨号">
            <el-option label="1" value=1></el-option>
            <el-option label="2" value=2></el-option>
            <el-option label="3" value=3></el-option>
            <el-option label="4" value=4></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跨名" prop="crossName">
          <el-select v-model="form.crossName" placeholder="请选择跨名">
            <el-option label="C21/1" value="C21/1"></el-option>
            <el-option label="C21/2" value="C21/2"></el-option>
            <el-option label="C21/3" value="C21/3"></el-option>
            <el-option label="C21/4" value="C21/4"></el-option>
            <el-option label="ZH01" value="ZH01"></el-option>
            <el-option label="ZH02" value="ZH02"></el-option>
          </el-select>
<!--          顺义扎后库-->
<!--          <el-select v-model="form.crossName" placeholder="请选择跨名">-->
<!--            <el-option label="ZH01" value="ZH01"></el-option>-->
<!--            <el-option label="ZH02" value="ZH02"></el-option>-->
<!--          </el-select>-->
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="addUseState"></el-switch>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
    </el-dialog>
<!--    搜索区-->
    <div style="margin: 10px 0">
      <el-input v-model="search" placeholder="请输入搜索内容" style="width: 20%" clearable></el-input>
      <el-button style="margin-left: 5px" @click="load">查询</el-button>
    </div>
<!--    列表显示区-->
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%"
      @row-dblclick="rowHandleClick">
      <el-table-column
        prop="id"
        label="id">
      </el-table-column>
      <el-table-column
        prop="craneName"
        label="天车名">
      </el-table-column>
      <el-table-column
        prop="crossId"
        label="跨号">
      </el-table-column>
      <el-table-column
        prop="crossName"
        label="跨名">
      </el-table-column>
      <el-table-column
        prop="conditionId"
        label="条件id">
      </el-table-column>
      <el-table-column
        prop="enabled"
        label="是否启用">
        <template #default="scope">
          <el-switch v-model="scope.row.enabled"
                     :active-value="1"
                     :inactive-value="0"
                     @change = "changeUseState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click.stop="handleEdit(scope.row)">修改</el-button>
            <el-popconfirm title="确认删除吗？" @confirm="handleDelete(scope.row.id)">
              <el-button slot="reference" size="small" type="danger">删除</el-button>
            </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
<!--    分页-->
    <div style="margin: 10px 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios"

export default {
  data() {
    return {
      dialogVisible: false, //新建或修改页面显示状态
      addUseState :true,    //新建时启用状态
      form: {
        crossId: '',
        crossName: '',
        craneName: '',
        enable: 1
      },
      // 天车配置插入要求
      rules: {
        craneName: [
          { required: true, message: '请输入天车名', trigger: 'blur' },
          { min: 1, message: '天车名为空', trigger: 'blur' }
        ],
        crossId: [
          { required: true, message: '请选择跨号', trigger: 'blur' },
          { min: 1, message: '请选择跨号', trigger: 'blur' }
        ],
        crossName: [
          { required: true, message: '请选择跨名', trigger: 'blur' },
          { min: 1, message: '请选择跨名', trigger: 'blur' }
        ]
      },
      search: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: []
    }
  },
  created() {
    this.load()
  },
  methods: {
    load(){
      axios.get("/craneConfig",{
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search: this.search
        }
      }).then(res =>{
        this.tableData = res.data.records
        this.tableData.enabled = true
        this.total = res.data.total
      })
    },
    rowHandleClick(row){ //点击表格行
      this.$router.push(
      {
        path: '/condition',
        query: {
          craneName: row.craneName,
          conditionId: row.conditionId
        }
      })
    },
    changeUseState(row){
      this.form = JSON.parse(JSON.stringify(row))
      axios.put("/craneConfig",this.form).then(res =>{
        if (res.code === '0') {
          this.$message({
            type: "success",
            message: "更新成功"
          })
          this.load()
        }else{
          this.$message({
            type: "error",
            message: res.msg
          })
        }
      })
    },
    add(){
      this.dialogVisible = true
      this.form = {}
      this.addUseState = true
    },
    save(){
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.enabled = this.addUseState ? 1 : 0
          if (this.form.id) //更新
          {
            axios.put("/craneConfig",this.form).then(res =>{
              if (res.code === '0') {
                this.$message({
                  type: "success",
                  message: "更新成功"
                })
                this.load()
              }else{
                this.$message({
                  type: "error",
                  message: res.msg
                })
              }
            })
          }else{  //新增
            axios.post("/craneConfig",this.form).then(res =>{
              if (res.code === '0') {
                this.$message({
                  type: "success",
                  message: "创建成功"
                })
                this.load()
              }else{
                this.$message({
                  type: "error",
                  message: res.msg
                })
              }
            })
          }
          this.dialogVisible = false
        } else {
          return false;
        }
      });
    },
    handleEdit(row){
      this.addUseState = row.enabled === 1
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    handleDelete(id) {
      axios.delete("/craneConfig/" + id).then(res =>{
        if (res.code === '0') {
          this.$message({
            type: "success",
            message: "删除成功"
          })
          this.load()
        }else{
          this.$message({
            type: "error",
            message: res.msg
          })
        }
      })
    },
    handleSizeChange(pageSize) {  //改变当前页面个数触发
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) { //改变当前页码触发
      this.currentPage = pageNum
      this.load()
    }
  }
}
</script>
