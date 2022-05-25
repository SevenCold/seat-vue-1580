<template>
  <div class="mod-config" style="padding: 10px">
    <div>
      <div id="condition" style="width: 49%; float: left">
      <!--    功能区-->
      <el-dialog title="现场条件配置" v-model="dialogVisible" width="15%">
        <!--      创建或修改天车配置信息内容-->
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
          <el-form-item label="顺序号" style="width: 85%" prop="sequence">
            <el-input v-model="form.sequence" oninput="value=value.replace(/[^\d]/g,'')"/>
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
        <el-tag type="danger">{{craneName}}天车</el-tag>
        <el-tag type="warning" size="100px">条件配置</el-tag>
        <el-button type="primary" @click="add">新增</el-button>
        <el-input v-model="search" placeholder="请输入搜索内容" style="width: 20%" clearable></el-input>
        <el-button style="margin-left: 5px" @click="load">查询</el-button>
      </div>
      <!--    列表显示区-->
      <el-table
        :data="tableData"
        height="170"
        highlight-current-row
        border
        stripe
        style="width: 100%"
        @row-click="rowHandleClick">
        <el-table-column
          sortable
          prop="id"
          label="id">
        </el-table-column>
        <el-table-column
          prop="parentId"
          label="对应天车表conditionId">
        </el-table-column>
        <el-table-column
          sortable
          prop="sequence"
          label="筛选顺序">
        </el-table-column>
        <el-table-column
          prop="detailId"
          label="条件详情id">
        </el-table-column>
        <el-table-column
          prop="ruleId"
          label="规则id">
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
            <el-popconfirm title="确认删除吗？" @confirm="handleDelete(scope.row)">
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
      <div style="float: left;"><el-divider direction="vertical"/></div>
      <div id="detail" style="width: 49%; float: left">
        <!--    功能区-->
        <el-dialog title="条件详情配置" :visible.sync="detailDialogVisible" width="18%">
          <!--      创建或修改天车配置信息内容-->
          <el-form ref="detailForm" :model="detailForm" label-width="80px" :rules="detailRules">
            <el-form-item label="设备类型" prop="deviceType">
              <el-select v-model="detailForm.deviceType" placeholder="设备类型">
                <el-option label="天车" value=2></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="detailForm.deviceName" style="width: 95%"></el-input>
            </el-form-item>
            <el-form-item label="比较类型" prop="compareType">
              <el-select v-model="detailForm.compareType" placeholder="请选择比较类型">
                <el-option label="驻车" value=0></el-option>
                <el-option label="非驻车" value=1></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否启用">
              <el-switch v-model="addDetailUseState"></el-switch>
            </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
          <el-button @click="detailDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveDetail">确 定</el-button>
        </span>
        </el-dialog>
        <!--    搜索区-->
        <div style="margin: 10px 0">
          <el-tag type="warning" size="100px">条件详情配置</el-tag>
          <el-button type="primary" @click="addDetail">新增</el-button>
          <el-input v-model="searchDetail" placeholder="请输入搜索内容" style="width: 20%" clearable></el-input>
          <el-button style="margin-left: 5px" @click="loadDetail">查询</el-button>
        </div>
        <!--    列表显示区-->
        <el-table
          :data="detailData"
          height="170"
          border
          stripe
          style="width: 100%">
          <el-table-column
            sortable
            prop="id"
            label="id">
          </el-table-column>
          <el-table-column
            prop="parentId"
            label="对应条件表条件详情id">
          </el-table-column>
          <el-table-column
            prop="deviceType"
            label="设备类型">
            <template #default="scope">
              <span v-if="scope.row.deviceType === 2">天车</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="deviceName"
            label="设备名称">
          </el-table-column>
          <el-table-column
            prop="compareType"
            label="比较类型">
            <template #default="scope">
              <span v-if="scope.row.compareType === 1">非驻车</span>
              <span v-if="scope.row.compareType === 0">驻车</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="enabled"
            label="是否启用">
            <template #default="scopeDetail">
              <el-switch v-model="scopeDetail.row.enabled"
                         :active-value="1"
                         :inactive-value="0"
                         @change = "changeDetailUseState(scopeDetail.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scopeDetail">
              <el-button size="small" @click.stop="handleDetailEdit(scopeDetail.row)">修改</el-button>
              <el-popconfirm title="确认删除吗？" @confirm="handleDetailDelete(scopeDetail.row.id)">
                <el-button slot="reference" size="small" type="danger">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!--    分页-->
        <div style="margin: 10px 0">
          <el-pagination
            @size-change="handleDetailSizeChange"
            @current-change="handleDetailCurrentChange"
            :current-page="detailCurrentPage"
            :page-sizes="[5, 10, 20]"
            :page-size="detailPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="detailTotal">
          </el-pagination>
        </div>
      </div>
    </div>
    <div>
      <div id="rule" style="width: 49%; float: left">
        <!--    功能区-->
        <el-dialog title="规则配置" :visible.sync="ruleDialogVisible" width="18%">
          <!--      创建或修改天车配置信息内容-->
          <el-form ref="ruleForm" :model="ruleForm" label-width="125px" :rules="ruleRules">
            <el-form-item label="任务类型" prop="taskType">
              <el-select v-model="ruleForm.taskType" placeholder="任务类型">
                <el-option label="上线" value=11></el-option>
                <el-option label="下线" value=12></el-option>
                <el-option label="装车" value=31></el-option>
                <el-option label="卸车" value=32></el-option>
                <el-option label="装火车" value=33></el-option>
                <el-option label="上过跨车或运输小车" value=21></el-option>
                <el-option label="下过跨车或运输小车" value=22></el-option>
                <el-option label="所有自动生成的计划" value=40></el-option>
                <el-option label="上线够不到的卷的跨内倒垛" value=41></el-option>
                <el-option label="二层跨内倒垛" value=42></el-option>
                <el-option label="公共区域倒出倒垛" value=43></el-option>
                <el-option label="倒垛到可以进缓冷坑的区域" value=44></el-option>
                <el-option label="公共区域倒出倒垛任务" value=45></el-option>
                <el-option label="步进梁退卷" value=51></el-option>
                <el-option label="运输小车退卷" value=61></el-option>
                <el-option label="入手包区" value=71></el-option>
                <el-option label="出手包区" value=72></el-option>
                <el-option label="入打磨区" value=81></el-option>
                <el-option label="出打磨区" value=82></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="顺序号" v-show="seqShow" prop="sequence">
              <el-input v-model="ruleForm.sequence" oninput="value=value.replace(/[^\d]/g,'')"/>
            </el-form-item>
            <el-form-item label="比较类型" prop="compareType">
              <el-select v-model="ruleForm.compareType" placeholder="比较类型">
                <el-option label="按设备名" value=1></el-option>
                <el-option label="按范围" value=2></el-option>
                <el-option label="按天车优先范围" value=3></el-option>
                <el-option label="按天车极限范围" value=4></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备类型" prop="deviceType">
              <el-select v-model="ruleForm.deviceType" placeholder="设备类型">
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
            <el-form-item label="设备名称或范围" prop="deviceName">
              <el-input v-model="ruleForm.deviceName"></el-input>
            </el-form-item>
            <el-form-item label="主要负责设备">
              <el-switch v-model="addIsMainState"></el-switch>
            </el-form-item>
            <el-form-item label="是否启用">
              <el-switch v-model="addRuleUseState"></el-switch>
            </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
          <el-button @click="ruleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRule">确 定</el-button>
        </span>
        </el-dialog>
        <!--    搜索区-->
        <div style="margin: 10px 0">
          <el-tag type="warning" size="100px">规则配置</el-tag>
          <el-button type="primary" @click="addRule">新增</el-button>
          <el-input v-model="searchRule" placeholder="请输入搜索内容" style="width: 20%" clearable></el-input>
          <el-button style="margin-left: 5px" @click="loadRule">查询</el-button>
        </div>
        <!--    列表显示区-->
        <el-table
          :data="ruleData"
          height="500"
          highlight-current-row
          border
          stripe
          style="width: 100%"
          @row-click="ruleRowHandleClick">
          <el-table-column
            width="60"
            sortable
            prop="id"
            label="id">
          </el-table-column>
          <el-table-column
            width="50"
            prop="parentId"
            label="对应条件表规则id">
          </el-table-column>
          <el-table-column
            width="50"
            prop="sequence"
            label="筛选顺序">
          </el-table-column>
          <el-table-column
            width="50"
            prop="taskType"
            label="任务类型">
            <template #default="scope">
              <span v-if="scope.row.taskType === 11">上线</span>
              <span v-if="scope.row.taskType === 12">下线</span>
              <span v-if="scope.row.taskType === 31">装车</span>
              <span v-if="scope.row.taskType === 32">卸车</span>
              <span v-if="scope.row.taskType === 33">装火车</span>
              <span v-if="scope.row.taskType === 21">上过跨车或运输小车</span>
              <span v-if="scope.row.taskType === 22">下过跨车或运输小车</span>
<!--              所有倒垛计划有个PROC_CD字段，根据这个PROC_CD找到Config_Device_Range获取到的设备信息中找到对应的name的device_x_l_limit\device_x_r_limit，根据这两个坐标值调用procssByLimit进行垛位预约（除二层倒垛就近倒垛外）-->
              <span v-if="scope.row.taskType === 40">所有自动生成的计划</span>
              <span v-if="scope.row.taskType === 41">上线够不到的卷的跨内倒垛</span>
              <span v-if="scope.row.taskType === 42">二层跨内倒垛</span>
              <span v-if="scope.row.taskType === 43">公共区域倒出倒垛</span>
              <span v-if="scope.row.taskType === 44">倒垛到可以进缓冷坑的区域</span>
              <span v-if="scope.row.taskType === 45">公共区域倒出倒垛任务</span>
              <span v-if="scope.row.taskType === 51">步进梁退卷</span>
              <span v-if="scope.row.taskType === 61">运输小车退卷</span>
              <span v-if="scope.row.taskType === 71">入手包区</span>
              <span v-if="scope.row.taskType === 72">出手包区</span>
              <span v-if="scope.row.taskType === 81">入打磨区</span>
              <span v-if="scope.row.taskType === 82">出打磨区</span>
            </template>
          </el-table-column>
          <el-table-column
            width="80"
            prop="compareType"
            label="比较类型">
            <template #default="scope">
              <span v-if="scope.row.compareType === 1">按设备名</span>
              <span v-if="scope.row.compareType === 2">按范围</span>
              <span v-if="scope.row.compareType === 3">按天车优先范围</span>
              <span v-if="scope.row.compareType === 4">按天车极限范围</span>
            </template>
          </el-table-column>
          <el-table-column
            width="100"
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
            prop="deviceName"
            label="设备名称或范围">
          </el-table-column>
          <el-table-column
            prop="detailId"
            label="规则详情id">
          </el-table-column>
          <el-table-column
            prop="isMain"
            label="是否是主要负责设备">
            <template #default="scope">
              <el-switch v-model="scope.row.isMain"
                         :active-value="1"
                         :inactive-value="0"
                         @change = "changeRuleUseState(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="enabled"
            label="是否启用">
            <template #default="scope">
              <el-switch v-model="scope.row.enabled"
                         :active-value="1"
                         :inactive-value="0"
                         @change = "changeRuleUseState(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button size="small" @click.stop="handleRuleEdit(scope.row)">修改</el-button>
              <el-popconfirm title="确认删除吗？" @confirm="handleRuleDelete(scope.row)">
                <el-button slot="reference" size="small" type="danger">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!--    分页-->
        <div style="margin: 10px 0">
          <el-pagination
            @size-change="handleRuleSizeChange"
            @current-change="handleRuleCurrentChange"
            :current-page="ruleCurrentPage"
            :page-sizes="[5, 10, 20]"
            :page-size="rulePageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="ruleTotal">
          </el-pagination>
        </div>
      </div>
      <div style="float: left;"><el-divider direction="vertical"/></div>
      <div id="ruleDetail" style="width: 49%; float: left">
        <!--    功能区-->
        <el-dialog title="添加选中规则的规则详情" :visible.sync="ruleDetailDialogVisible" width="50%">
          <!--      创建或修改天车配置信息内容-->
          <div style="margin: 10px 0">
            <el-input v-model="searchAllRuleDetail" placeholder="请输入搜索内容" style="width: 20%" clearable></el-input>
            <el-button style="margin-left: 5px" @click="loadAllRuleDetail">查询</el-button>
          </div>
          <el-table
            :data="allRuleDetailTable"
            ref="allRuleDetailTable"
            height="400"
            border
            stripe
            style="width: 100%">
            <el-table-column
              type="selection"
              width="40">
            </el-table-column>
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
              <template #default="scope">
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
          </el-table>
          <!--    分页-->
          <div style="margin: 10px 0">
            <el-pagination
              @size-change="handleAllRuleDetailSizeChange"
              @current-change="handleAllRuleDetailCurrentChange"
              :current-page="allRuleDetailCurrentPage"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="allRuleDetailPageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="allRuleDetailTotal">
            </el-pagination>
          </div>

          <span slot="footer" class="dialog-footer">
          <el-button @click="ruleDetailDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveDetailToRule">确 定</el-button>
        </span>
        </el-dialog>
        <!--    搜索区-->
        <div style="margin: 10px 0">
          <el-tag type="warning" size="100px">规则详情配置</el-tag>
          <el-button type="primary" @click="addDetailToRule">修改规则详情</el-button>
        </div>
        <!--    列表显示区-->
        <el-table
          :data="ruleDetailTable"
          height="500"
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
            <template #default="scope">
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
        </el-table>
        <!--    分页-->
        <div style="margin: 10px 0">
          <el-pagination
            @size-change="handleRuleDetailSizeChange"
            @current-change="handleRuleDetailCurrentChange"
            :current-page="ruleDetailCurrentPage"
            :page-sizes="[5, 10, 20]"
            :page-size="ruleDetailPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="ruleDetailTotal">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"

export default {
  data() {
    return {
      seqShow :true,
      clickCondition: '',   //记录点击的第几行现场条件信息
      clickRule: '',        //记录点击的第几行规则
      conditionId: 1,
      craneName: '2-1',
      dialogVisible: false, //新建或修改条件页面显示状态
      detailDialogVisible: false, //新建或修改条件详情页面显示状态
      ruleDialogVisible: false, //新建或修改规则页面显示状态
      ruleDetailDialogVisible: false,//向一条规则添加一条规则详情
      addUseState :true,    //新建或修改条件时启用状态
      addDetailUseState: true,//新建或修改条件详情时启用状态
      addIsMainState: true, //是否是主要负责设备标识
      addRuleUseState: true,//新建或修改规则时启用状态
      form: {},
      detailForm: {},
      ruleForm: {},
      // 条件配置要求
      rules: {
        sequence: [
          { required: true, message: '请输入顺序号', trigger: 'blur' },
          { min: 1, message: '请输入顺序号', trigger: 'blur' }
        ]
      },
      detailRules: {
        compareType: [
          { required: true, message: '请选择比较类型', trigger: 'blur' },
          { min: 1, message: '请选择比较类型', trigger: 'blur' }
        ],
        deviceType: [
          { required: true, message: '请选择设备类型', trigger: 'blur' },
          { min: 1, message: '请选择设备类型', trigger: 'blur' }
        ],
        deviceName: [
          { required: true, message: '请输入设备名', trigger: 'blur' },
          { min: 1, message: '请输入设备名', trigger: 'blur' }
        ]
      },
      ruleRules: {
        taskType: [
          { required: true, message: '请选择任务类型', trigger: 'blur' },
          { min: 1, message: '请选择任务类型', trigger: 'blur' }
        ],
        deviceType: [
          { required: true, message: '请选择设备类型', trigger: 'blur' },
          { min: 1, message: '请选择设备类型', trigger: 'blur' }
        ],
        compareType: [
          { required: true, message: '请选择比较类型', trigger: 'blur' },
          { min: 1, message: '请选择比较类型', trigger: 'blur' }
        ],
        // deviceName: [
        //   { required: true, message: '请输入设备名', trigger: 'blur' },
        //   { min: 1, message: '请输入设备名', trigger: 'blur' }
        // ]
      },
      search: '',       //条件搜索框内容
      searchDetail: '', //条件详情搜索框内容
      searchRule: '',   //规则搜索框内容
      searchAllRuleDetail: '',//所有规则详情搜索框内容
      currentPage: 1,   //条件当前页
      detailCurrentPage: 1, //条件详情当前页
      ruleCurrentPage: 1,   //规则当前页
      ruleDetailCurrentPage: 1,//规则详情当前页
      allRuleDetailCurrentPage: 1,//向规则添加详情时当前页
      pageSize: 10,         //条件每页多少条
      detailPageSize :10,   //条件详情每页多少条
      rulePageSize :10,     //规则每页多少条
      ruleDetailPageSize :10,//规则每页多少条
      allRuleDetailPageSize: 10,//向规则添加详情时每页多少条
      total: 0,         //条件共多少条
      detailTotal: 0,   //条件详情共多少条
      ruleTotal: 0,     //规则共多少条
      ruleDetailTotal: 0,//此条规则的规则详情共多少条
      allRuleDetailTotal: 0,//向规则添加详情时可选详情共多少条
      tableData: [],    //条件显示列表
      detailData: [],   //条件详情列表
      ruleData: []  ,    //规则显示列表
      ruleDetailTable: [],//规则详情列表
      allRuleDetailTable: []//向规则添加详情时显示的所有规则列表
    }
  },
  created() {
    this.load()
  },
  methods: {
    //加载现场条件信息
    load(){
      axios.get("/condition",{
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          conditionId: this.conditionId
        }
      }).then(res =>{
        this.tableData = res.data.records
        this.tableData.enabled = true
        this.total = res.data.total
      })
    },
    //加载条件详情信息
    loadDetail(){
      axios.get("/conditionDetail",{
        params: {
          pageNum: this.detailCurrentPage,
          pageSize: this.detailPageSize,
          detailId: this.clickCondition.detailId
        }
      }).then(res =>{
        this.detailData = res.data.records
        this.detailData.enabled = true
        this.detailTotal = res.data.total
      })
    },
    //加载规则信息
    loadRule(){
      axios.get("/rule",{
        params: {
          pageNum: this.ruleCurrentPage,
          pageSize: this.rulePageSize,
          detailId: this.clickCondition.ruleId
        }
      }).then(res =>{
        this.ruleData = res.data.records
        this.ruleData.enabled = true
        this.ruleTotal = res.data.total
      })
    },
    //加载规则详情信息
    loadRuleDetail() {
      axios.get("/ruleDetail/getByIdArr",{
        params: {
          pageNum: this.ruleDetailCurrentPage,
          pageSize: this.ruleDetailPageSize,
          idArr: this.clickRule.detailId
        }
      }).then(res =>{
        this.ruleDetailTable = res.data.records
        this.ruleDetailTotal = res.data.total
      })
    },
    //加载全部规则详情
    loadAllRuleDetail() {
      axios.get("/ruleDetail/getByEnabled",{
        params: {
          pageNum: this.allRuleDetailCurrentPage,
          pageSize: this.allRuleDetailPageSize,
          search: this.searchAllRuleDetail
        }
      }).then(res =>{
        this.allRuleDetailTable = res.data.records
        this.allRuleDetailTotal = res.data.total
      })
    },
    //点击条件表格一行加载条件详情和规则
    rowHandleClick(row){
      if (row === this.clickCondition)
        return false
      this.clickCondition = row
      this.clickRule = ''
      this.ruleDetailTable = []
      this.ruleDetailCurrentPage = 1
      this.ruleDetailPageSize = 10
      this.ruleDetailTotal = 0
      this.loadDetail()
      this.loadRule()
    },
    //点击规则表一行加载规则详情列表
    ruleRowHandleClick(row){
      this.clickRule = row
      this.loadRuleDetail()
    },
    //改变现场条件可用状态
    changeUseState(row){
      this.form = JSON.parse(JSON.stringify(row))
      axios.put("/condition",this.form).then(res =>{
        if (res.code === '0') {
          this.$message({
            type: "success",
            message: "更新现场条件可应状态成功"
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
    //改变条件详情信息可用状态
    changeDetailUseState(row){
      this.detailForm = JSON.parse(JSON.stringify(row))
      axios.put("/conditionDetail",this.detailForm).then(res =>{
        if (res.code === '0') {
          this.$message({
            type: "success",
            message: "更新条件详情可用状态成功"
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
    //改变规则可用状态
    changeRuleUseState(row){
      this.ruleForm = JSON.parse(JSON.stringify(row))
      axios.put("/rule",this.ruleForm).then(res =>{
        if (res.code === '0') {
          this.$message({
            type: "success",
            message: "更新规则成功"
          })
          this.loadRule()
        }else{
          this.$message({
            type: "error",
            message: res.msg
          })
        }
      })
    },
    //点击添加一条现场条件
    add(){
      this.form = {}
      this.addUseState = true
      this.form.parentId = this.conditionId
      this.save()
    },
    //点击弹出添加条件详情页
    addDetail(){
      if (this.clickCondition === ''){
        this.$message({
          type: "error",
          message: "请选择一条现场条件"
        })
        return false
      }
      this.detailDialogVisible = true
      this.detailForm = {}
      this.addDetailUseState = true
    },
    //点击弹出添加规则页
    addRule(){
      if (this.clickCondition === ''){
        this.$message({
          type: "error",
          message: "请选择一条现场条件"
        })
        return false
      }
      this.seqShow = false
      this.ruleDialogVisible = true
      this.ruleForm = {}
      this.addIsMainState = true
      this.addRuleUseState = true
    },
    //向规则添加规则详情
    addDetailToRule(){
      if (this.clickRule === ''){
        this.$message({
          type: "error",
          message: "请选择一条规则"
        })
        return false
      }
      this.ruleDetailDialogVisible = true
      this.loadAllRuleDetail()
    },
    //保存添加或更改的现场条件信息
    save(){
      this.form.enabled = this.addUseState ? 1 : 0
      if (this.form.id) //更新
      {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            axios.put("/condition", this.form).then(res => {
              if (res.code === '0') {
                this.$message({
                  type: "success",
                  message: "更新现场条件信息成功"
                })
                this.load()
              } else {
                this.$message({
                  type: "error",
                  message: res.msg
                })
              }
            })
            this.dialogVisible = false
          } else {
            return false;
          }
        });
      }else{  //新增
        axios.post("/condition", this.form).then(res =>{
          if (res.code === '0') {
            this.$message({
              type: "success",
              message: "创建现场条件信息成功"
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
    },
    //保存条件详情信息
    saveDetail(){
      this.$refs["detailForm"].validate((valid) => {
        if (valid) {
          this.detailForm.enabled = this.addDetailUseState ? 1 : 0
          if (this.detailForm.id) //更新
          {
            axios.put("/conditionDetail",this.detailForm).then(res =>{
              if (res.code === '0') {
                this.$message({
                  type: "success",
                  message: "更新条件详情信息成功"
                })
                this.loadDetail()
              }else{
                this.$message({
                  type: "error",
                  message: res.msg
                })
              }
            })
          }else{  //新增
            this.detailForm.parentId = this.clickCondition.detailId
            axios.post("/conditionDetail",this.detailForm).then(res =>{
              if (res.code === '0') {
                this.$message({
                  type: "success",
                  message: "创建条件详情信息成功"
                })
                this.loadDetail()
              }else{
                this.$message({
                  type: "error",
                  message: res.msg
                })
              }
            })
          }
          this.detailDialogVisible = false
        } else {
          return false;
        }
      });

    },
    //保存规则信息
    saveRule(){
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.ruleForm.isMain = this.addIsMainState ? 1 : 0
          this.ruleForm.enabled = this.addRuleUseState ? 1 : 0
          if (this.ruleForm.id) //更新
          {
            axios.put("/rule",this.ruleForm).then(res =>{
              if (res.code === '0') {
                this.$message({
                  type: "success",
                  message: "更新规则成功"
                })
                this.loadRule()
              }else{
                this.$message({
                  type: "error",
                  message: res.msg
                })
              }
            })
          }else{  //新增
            this.ruleForm.parentId = this.clickCondition.ruleId
            axios.post("/rule",this.ruleForm).then(res =>{
              if (res.code === '0') {
                this.$message({
                  type: "success",
                  message: "创建规则成功"
                })
                this.loadRule()
              }else{
                this.$message({
                  type: "error",
                  message: res.msg
                })
              }
            })
          }
          this.ruleDialogVisible = false
        } else {
          return false;
        }
      });
    },
    saveDetailToRule(){
      let detailId = '';
      this.$refs.allRuleDetailTable.selection.forEach(e => {
        detailId += '、' + e.id;
      })
      this.clickRule.detailId = detailId.slice(1)
      axios.put("/rule",this.clickRule).then(res =>{
        if (res.code === '0') {
          this.$message({
            type: "success",
            message: "更新条件详情信息成功"
          })
          this.loadRule()
          this.loadRuleDetail()
        }else{
          this.$message({
            type: "error",
            message: res.msg
          })
        }
        this.ruleDetailDialogVisible = false
      })
    },
    handleEdit(row){
      this.addUseState = row.enabled === 1
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    handleDetailEdit(row){
      this.addDetailUseState = row.enabled === 1
      this.detailForm = JSON.parse(JSON.stringify(row))
      this.detailDialogVisible = true
    },
    handleRuleEdit(row){
      this.addIsMainState = row.isMain === 1
      this.addRuleUseState = row.enabled === 1
      this.ruleForm = JSON.parse(JSON.stringify(row))
      this.seqShow = true
      this.ruleDialogVisible = true
    },
    handleDelete(row) {
      axios.delete("/condition/" + row.id + "/" + row.detailId + "/" + row.ruleId).then(res =>{
        if (res.code === '0') {
          this.$message({
            type: "success",
            message: "删除现场条件信息成功"
          })
          this.load()
          if (row === this.clickCondition){
            this.loadDetail()
            this.loadRule()
            this.clickCondition = ''
            this.ruleDetailTable = []
          }
        }else{
          this.$message({
            type: "error",
            message: res.msg
          })
        }
      })
    },
    handleDetailDelete(id) {
      axios.delete("/conditionDetail/" + id).then(res =>{
        if (res.code === '0') {
          this.$message({
            type: "success",
            message: "删除条件详情信息成功"
          })
          this.loadDetail()
        }else{
          this.$message({
            type: "error",
            message: res.msg
          })
        }
      })
    },
    handleRuleDelete(row) {
      axios.delete("/rule/" + row.id).then(res =>{
        if (res.code === '0') {
          this.$message({
            type: "success",
            message: "删除规则成功"
          })
          this.loadRule()
          if (row === this.clickRule){
            this.clickRule = ''
            this.ruleDetailTable = []
          }
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
    handleDetailSizeChange(pageSize) {  //改变当前页面个数触发
      this.detailPageSize = pageSize
      this.loadDetail()
    },
    handleRuleSizeChange(pageSize) {  //改变当前页面个数触发
      this.rulePageSize = pageSize
      this.loadRule()
    },
    handleRuleDetailSizeChange(pageSize) {  //改变当前页面个数触发
      this.ruleDetailPageSize = pageSize
      this.loadRuleDetail()
    },
    handleAllRuleDetailSizeChange(pageSize) {  //改变当前页面个数触发
      this.allRuleDetailPageSize = pageSize
      this.loadAllRuleDetail()
    },

    handleCurrentChange(pageNum) { //改变当前页码触发
      this.currentPage = pageNum
      this.load()
    },
    handleDetailCurrentChange(pageNum) { //改变当前页码触发
      this.detailCurrentPage = pageNum
      this.loadDetail()
    },
    handleRuleCurrentChange(pageNum) { //改变当前页码触发
      this.ruleCurrentPage = pageNum
      this.loadRule()
    },
    handleRuleDetailCurrentChange(pageNum) { //改变当前页码触发
      this.ruleDetailCurrentPage = pageNum
      this.loadRuleDetail()
    },
    handleAllRuleDetailCurrentChange(pageNum) { //改变当前页码触发
      this.allRuleDetailCurrentPage = pageNum
      this.loadAllRuleDetail()
    }
  }
}
</script>
