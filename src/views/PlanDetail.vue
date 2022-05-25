<template>
  <div class="mod-config" style="padding: 10px">
    <!--    功能区-->
    <el-button type="primary" @click="add">新增</el-button>
    <el-dialog title="规则详情配置" v-model="dialogVisible" width="18%">
      <!--      创建或修改天车配置信息内容-->
      <el-form ref="ruleDetailForm" :model="ruleDetailForm" label-width="150px" :rules="ruleDetailRules">
        <el-form-item label="设备类型" prop="deviceType">
          <el-select v-model="ruleDetailForm.deviceType" placeholder="设备类型">
            <el-option label="无" value =-1></el-option>
            <el-option label="上线梁" value=6></el-option>
            <el-option label="上线点" value=4></el-option>
            <el-option label="下线梁" value=7></el-option>
            <el-option label="下线点" value=5></el-option>
            <el-option label="手包点" value=9></el-option>
            <el-option label="手包点对应的鞍座" value=10></el-option>
            <el-option label="打磨点" value=13></el-option>
            <el-option label="打磨点对应的鞍座" value=14></el-option>
            <el-option label="汽车停车位" value=3></el-option>
            <el-option label="汽车停车位上对应的鞍座" value=11></el-option>
            <el-option label="过跨车" value=15></el-option>
            <el-option label="过跨车上对应的鞍座" value=16></el-option>
            <el-option label="火车停车位" value=8></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称或任务类型" prop="deviceName">
          <el-input v-model="ruleDetailForm.deviceName"></el-input>
        </el-form-item>
        <el-form-item label="比较类型" prop="compareType">
          <el-select v-model="ruleDetailForm.compareType" placeholder="请选择比较类型">
            <el-option label="计划数量" value=0></el-option>
            <el-option label="空梁数" value=1></el-option>
            <el-option label="下线梁有几卷" value=2></el-option>
            <el-option label="单天车单任务类型任务数量比较" value=4></el-option>
            <el-option label="所有天车单任务类型任务数量比较" value=5></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="比较符号" prop="compareSign">
          <el-select v-model="ruleDetailForm.compareSign" placeholder="请选择比较符号">
            <el-option label=">" value=">"></el-option>
            <el-option label="<" value="<"></el-option>
            <el-option label="=" value="="></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="比较内容" prop="content">
          <el-input v-model="ruleDetailForm.content"></el-input>
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
      :data="ruleDetailTable"
      border
      stripe
      style="width: 100%">
      <el-table-column
        sortable
        prop="id"
        label="id">
      </el-table-column>
      <el-table-column
        sortable
        prop="deviceType"
        label="设备类型">
        <template #default="scope">
          <span v-if="scope.row.deviceType === -1">无</span>
          <span v-if="scope.row.deviceType === 6">上线梁</span>
          <span v-if="scope.row.deviceType === 4">上线点</span>
          <span v-if="scope.row.deviceType === 7">下线梁</span>
          <span v-if="scope.row.deviceType === 5">下线点</span>
          <span v-if="scope.row.deviceType === 9">手包点</span>
          <span v-if="scope.row.deviceType === 10">手包点对应的鞍座</span>
          <span v-if="scope.row.deviceType === 13">打磨点</span>
          <span v-if="scope.row.deviceType === 14">打磨点对应的鞍座</span>
          <span v-if="scope.row.deviceType === 3">汽车停车位</span>
          <span v-if="scope.row.deviceType === 11">汽车停车位上对应的鞍座</span>
          <span v-if="scope.row.deviceType === 15">过跨车</span>
          <span v-if="scope.row.deviceType === 16">过跨车上对应的鞍座</span>
          <span v-if="scope.row.deviceType === 8">火车停车位</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="deviceName"
        label="设备名称或任务类型">
      </el-table-column>
      <el-table-column
        sortable
        prop="compareType"
        label="比较类型">
        <template  #default="scope">
          <span v-if="scope.row.compareType === '0'">计划数量</span>
          <span v-if="scope.row.compareType === '1'">上线点空梁数</span>
          <span v-if="scope.row.compareType === '2'">下线梁有几卷</span>
          <span v-if="scope.row.compareType === '4'">单天车单任务类型任务数量比较</span>
          <span v-if="scope.row.compareType === '5'">所有天车单任务类型任务数量比较</span>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="compareSign"
        label="比较符号">
      </el-table-column>
      <el-table-column
        prop="content"
        label="比较内容">
      </el-table-column>
      <el-table-column
        prop="enabled"
        label="是否启用">
        <template  #default="scope">
          <el-switch v-model="scope.row.enabled"
                     :active-value="1"
                     :inactive-value="0"
                     @change = "changeUseState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template  #default="scope">
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
      ruleDetailForm: {},
      // 天车配置插入要求
      ruleDetailRules: {
        deviceType: [
          { required: true, message: '请选择设备类型', trigger: 'blur' },
          { min: 1, message: '请选择设备类型', trigger: 'blur' }
        ],
        deviceName: [
          { required: true, message: '请输入设备名', trigger: 'blur' },
          { min: 1, message: '请输入设备名', trigger: 'blur' }
        ],
        compareType: [
          { required: true, message: '请选择比较类型', trigger: 'blur' },
          { min: 1, message: '请选择比较类型', trigger: 'blur' }
        ],
        compareSign: [
          { required: true, message: '请选择比较符号', trigger: 'blur' },
          { min: 1, message: '请选择比较符号', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入比较内容', trigger: 'blur' },
          { min: 1, message: '请输入比较内容', trigger: 'blur' }
        ]
      },
      search: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      ruleDetailTable: []
    }
  },
  created() {
    this.load()
  },
  methods: {
    load(){
      let _this = this
      axios.get("/ruleDetail",{
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search: this.search
        }
      }).then(res =>{
        _this.ruleDetailTable = res.data.records
        _this.ruleDetailTable.enabled = true
        _this.total = res.data.total
      })
    },
    changeUseState(row){
      this.ruleDetailForm = JSON.parse(JSON.stringify(row))
      axios.put("/ruleDetail",this.ruleDetailForm).then(res =>{
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
      this.ruleDetailForm = {}
      this.addUseState = true
    },
    save(){
      this.$refs["ruleDetailForm"].validate((valid) => {
        if (valid) {
          this.ruleDetailForm.enabled = this.addUseState ? 1 : 0
          // switch (this.ruleDetailForm.deviceType){
          //   case '上线梁':
          //     this.ruleDetailForm.deviceType = 6
          //     break
          //   case '上线点':
          //     this.ruleDetailForm.deviceType = 4
          //     break
          //   case '下线梁':
          //     this.ruleDetailForm.deviceType = 7
          //     break
          //   case '下线点':
          //     this.ruleDetailForm.deviceType = 5
          //     break
          //   case '火车停车位':
          //     this.ruleDetailForm.deviceType = 8
          //     break
          //   case '手包点':
          //     this.ruleDetailForm.deviceType = 9
          //     break
          //   case '汽车停车位':
          //     this.ruleDetailForm.deviceType = 3
          //     break
          // }
          if (this.ruleDetailForm.id) //更新
          {
            axios.put("/ruleDetail",this.ruleDetailForm).then(res =>{
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
            axios.post("/ruleDetail",this.ruleDetailForm).then(res =>{
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
      // switch (row.deviceType){
      //   case 6:
      //     row.deviceType = '上线梁'
      //     break
      //   case 4:
      //     row.deviceType = '上线点'
      //     break
      //   case 7:
      //     row.deviceType = '下线梁'
      //     break
      //   case 5:
      //     row.deviceType = '下线点'
      //     break
      //   case 8:
      //     row.deviceType = '火车停车位'
      //     break
      //   case 9:
      //     row.deviceType = '手包点'
      //     break
      //   case 3:
      //     row.deviceType = '汽车停车位'
      //     break
      // }
      this.ruleDetailForm = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    handleDelete(id) {
      axios.delete("/ruleDetail/" + id).then(res =>{
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
