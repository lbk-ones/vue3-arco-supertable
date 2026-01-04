<script setup>
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import { reactive, ref, computed, watch } from "vue";
import { Col, Message } from "@arco-design/web-vue";
import SuperTable from "./Table.vue";
import { del, post, put } from "../request.js";
const tableRef = ref(null);
// 表格加载状态
const loading = ref(false);
const rowKeyName = "id"; // 行唯一标识字段名
// 示例数据
const tableData = ref([
  {
    id: "1",
    name: "Jane Doe",
    department: "技术部",
    salary: 23000,
    email: "jane.doe@example.com",
    status: "active",
    joinDate: "2022-01-15",
    orderDetails: [],
  },
  {
    id: "2",
    name: "Alisa Ross",
    department: "销售部",
    salary: 25000,
    email: "alisa.ross@example.com",
    status: "active",
    joinDate: "2021-06-20",
    orderDetails: [],
  },
  {
    id: "3",
    name: "Kevin Sandra",
    department: "技术部",
    salary: 22000,
    email: "kevin.sandra@example.com",
    status: "inactive",
    joinDate: "2022-03-10",
    orderDetails: [],
  },
  {
    id: "4",
    name: "Ed Hellen",
    department: "人力资源",
    salary: 17000,
    email: "ed.hellen@example.com",
    status: "active",
    joinDate: "2023-01-05",
    orderDetails: [],
  },
  {
    id: "5",
    name: "William Smith",
    department: "财务部",
    salary: 27000,
    email: "william.smith@example.com",
    status: "active",
    joinDate: "2021-09-12",
    orderDetails: [],
  },
  {
    id: "6",
    name: "Emma Johnson",
    department: "市场部",
    salary: 26000,
    email: "emma.johnson@example.com",
    status: "active",
    joinDate: "2022-05-18",
    orderDetails: [],
  },
  {
    id: "7",
    name: "Michael Brown",
    department: "技术部",
    salary: 28000,
    email: "michael.brown@example.com",
    status: "active",
    joinDate: "2020-11-22",
    orderDetails: [],
  },
  {
    id: "8",
    name: "Sarah Davis",
    department: "销售部",
    salary: 24000,
    email: "sarah.davis@example.com",
    status: "inactive",
    joinDate: "2022-07-30",
    orderDetails: [],
  },
  {
    id: "9",
    name: "David Wilson",
    department: "技术部",
    salary: 29000,
    email: "david.wilson@example.com",
    status: "active",
    joinDate: "2021-02-14",
    orderDetails: [],
  },
  {
    id: "10",
    name: "Lisa Anderson",
    department: "人力资源",
    salary: 21000,
    email: "lisa.anderson@example.com",
    status: "active",
    joinDate: "2023-04-08",
    orderDetails: [],
  },
  {
    id: "11",
    name: "Tom Harris",
    department: "财务部",
    salary: 25000,
    email: "tom.harris@example.com",
    status: "active",
    joinDate: "2022-08-03",
    orderDetails: [],
  },
  {
    id: "12",
    name: "Rachel White",
    department: "市场部",
    salary: 23000,
    email: "rachel.white@example.com",
    status: "active",
    joinDate: "2021-10-11",
    orderDetails: [],
  },
]);
// columns 的字段的宽度最好不要每个都写死，留一个自动计算，不然fixed会有问题的
// 表格配置 - 前端分页示例
const tableConfig = reactive({
  // 列配置
  columns: [
    {
      title: "姓名",
      dataIndex: "name",
      width: 160,
      visible: true,
      ellipsis:true,
      fixed: "left",
      sortable: {
        compare: (a, b) => a.localeCompare(b),
      },
      form: {
        type: "input",
        creatable: true,
        editable: true,
        required: true,
        placeholder: "请输入姓名",
        enterNext: "department", // 回车聚焦到部门字段
        attrs: {
          "max-length": 50,
        },
      },
    },
    {
      title: "部门",
      dataIndex: "department",
      width: 120,
      visible: true,
      form: {
        type: "select",
        creatable: true,
        editable: true,
        required: true,
        placeholder: "请选择部门",
        enterNext: "salary", // 回车聚焦到薪资字段
        options: [
          { label: "技术部", value: "技术部" },
          { label: "销售部", value: "销售部" },
          { label: "人力资源", value: "人力资源" },
          { label: "财务部", value: "财务部" },
          { label: "市场部", value: "市场部" },
        ],
      },
    },
    {
      title: "薪资",
      dataIndex: "salary",
      width: 100,
      visible: true,
      align: "right",
      sortable: {
        compare: (a, b) => a - b,
      },
      form: {
        type: "number",
        creatable: true,
        editable: true,
        required: true,
        placeholder: "请输入薪资",
        enterNext: "email", // 回车聚焦到邮箱字段
        attrs: {
          min: 0,
          max: 999999,
        },
      },
    },
    {
      title: "邮箱",
      dataIndex: "email",
      width: 160,
      visible: false,
      form: {
        type: "input",
        creatable: true,
        editable: true,
        required: true,
        placeholder: "请输入邮箱",
        enterNext: "joinDate", // 回车聚焦到加入日期字段
        validator: (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return !emailRegex.test(value) ? "请输入有效的邮箱" : "";
        },
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 200,
      visible: true,
      type: "status",
      slotName: "status-cell",
      statusMap: {
        active: { label: "在职", color: "green" },
        inactive: { label: "离职", color: "red" },
      },
      form: {
        type: "radio",
        creatable: true,
        editable: true,
        required: true,
        options: [
          { label: "在职", value: "active" },
          { label: "离职", value: "inactive" },
        ],
      },
    },
    {
      title: "加入日期",
      dataIndex: "joinDate",
      //width: 120,
      visible: true,
      form: {
        type: "date",
        creatable: true,
        editable: true,
        required: true,
        placeholder: "请选择加入日期",
      },
    },
    {
      title: "订单详情",
      dataIndex: "orderDetails",
      visible: false,

      form: {
        type: "table", // 表格类型
        creatable: true, // 新增时显示
        editable: true, // 编辑时显示
        required: false, // 是否必填
        tableConfig: {
          // 表格配置
          columns: [
            {
              title: "产品名称",
              dataIndex: "productName",
              width: 150,
              form: {
                type: "input",
                creatable: true,
                editable: true,
                required: true,
                placeholder: "请输入产品名称",
                attrs: {
                  "max-length": 50,
                },
              },
            },
            {
              title: "数量",
              dataIndex: "quantity",
              width: 100,
              form: {
                type: "number",
                creatable: true,
                editable: true,
                required: true,
                placeholder: "请输入数量",
                attrs: {
                  min: 0,
                  max: 999999,
                },
              },
            },
            {
              title: "单价",
              dataIndex: "price",
              width: 100,
              form: {
                type: "number",
                creatable: true,
                editable: true,
                required: true,
                placeholder: "请输入单价",
                attrs: {
                  min: 0,
                  max: 999999,
                },
              },
            },
            {
              title: "合计",
              dataIndex: "total",
              width: 100,
              form: {
                type: "input",
                creatable: true,
                editable: true,
                required: true,
                placeholder: "请输入合计",
                attrs: {
                  "max-length": 50,
                },
              },
            },
          ],
          // 分页类型：frontend（前端分页）或 backend（后端分页）
          paginationType: "frontend",
          pageSize: 5,
          pageSizeOptions: [5, 10, 20, 50],

          // 后端分页  配置（如果使用后端分页）
          apiUrl: "/api/employee/list",
          // 操作按钮配置
          actions: [
            {
              key: "edit",
              label: "编辑",
              icon: "edit",
              // 编辑操作在 Table.vue 中自动处理，这里只需配置按钮信息
            },
            {
              key: "delete",
              label: "删除",
              status: "danger",
              type: "confirm",
              confirmMessage: "确定要删除选中的数据吗？",
              message: "删除成功",
              apiUrl: "/api/employee/delete",
              params: (records) => ({ ids: records.map((r) => r.key) }),
            },
          ],

          // 是否显示列配置按钮
          showColumnConfig: false,

          // 是否显示表单（新增/编辑）
          showForm: true,

          // 表格大小
          tableSize: "small",

          // 滚动配置
          scroll: { x: "auto", y: "auto" },

          // 是否显示选择列
          selection: true,
          modalWidth: 900,
          // 表格样式配置
          bordered: { cell: true }, // 边框配置：true=外框，{cell:true}=所有单元格边框
          hoverable: false, // 行悬停效果
          columnResizable: false, // 列宽可拖拽调整
          stripe: true, // 斑马纹背景

          // 行唯一标识字段名
          rowKey: "key", // 对应数据中的唯一标识字段，默认值为 'key'
        },
      },
    },
  ],

  // 搜索字段配置
  searchFields: [
    {
      dataIndex: "name",
      title: "姓名",
      type: "input",
      placeholder: "搜索姓名",
      attrs: {
        "max-length": 50,
      },
    },
    {
      dataIndex: "email",
      title: "邮箱",
      type: "input",
      placeholder: "搜索邮箱",
      attrs: {
        "max-length": 100,
      },
    },
    {
      dataIndex: "department",
      title: "部门",
      type: "select",
      placeholder: "选择部门",
      options: [
        { label: "技术部", value: "技术部" },
        { label: "销售部", value: "销售部" },
        { label: "人力资源", value: "人力资源" },
        { label: "财务部", value: "财务部" },
        { label: "市场部", value: "市场部" },
      ],
      attrs: {
        "allow-clear": true,
      },
    },
    {
      dataIndex: "status",
      title: "状态",
      type: "radio",
      placeholder: "选择状态",
      options: [
        { label: "在职", value: "active" },
        { label: "离职", value: "inactive" },
      ],
    },
    {
      dataIndex: "salary",
      title: "薪资范围",
      type: "number",
      placeholder: "输入薪资",
      attrs: {
        min: 0,
        max: 100000,
        step: 1000,
      },
    },
  ],

  // 分页类型：frontend（前端分页）或 backend（后端分页）
  paginationType: "frontend",
  pageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],

  // 后端分页配置（如果使用后端分页）
  apiUrl: "/pd/employees/pageQueryEmployees",

  // 后端表单新增接口地址
  formAddApiUrl: "/pd/employees/saveEmployees",

  // 后端表单更新的接口地址
  formUpdateApiUrl: "/pd/employees/updateEmployees",

  // 操作按钮配置
  actions: [
    {
      key: "view",
      label: "查看",
      icon: "eye",
      message: "查看成功",
      // 查看操作在 Table.vue 中自动处理，这里只需配置按钮信息 接口在 handleFormSubmit 方法中
    },
    {
      key: "edit",
      label: "编辑",
      icon: "edit",
      // 编辑操作在 Table.vue 中自动处理，这里只需配置按钮信息 接口在 handleFormSubmit 方法中
    },
    {
      key: "delete",
      label: "删除",
      status: "danger",
      type: "confirm",
      confirmMessage: "确定要删除选中的数据吗？",
      message: "删除成功",
      apiUrl: "/pd/employees/deleteEmployees",
      params: (records) => records?.map((r) => r[rowKeyName])?.join(",") ?? [],
    },
  ],
  // 执行操作按钮的回调 edit 和 view 不会进入这个回调 因为它们是弹窗形式的操作
  executeAction: async (action, records, params) => {
    // records: 为选中的数据数组
    // action: 为当前这个操作对应的action对象
    // params: action params 方法 处理过后的参数
    if (action.key == "delete") {
      if (tableConfig.paginationType === "frontend") {
        // 前端分页 删除逻辑
        records.forEach((record) => {
          const index = tableData.value.findIndex(
            (item) => item[rowKeyName] === record[rowKeyName]
          );
          if (index !== -1) {
            tableData.value.splice(index, 1);
          }
        });
      } else {
        // 后端分页 删除逻辑
        await del(action.apiUrl + "/" + params);
      }
    }
  },
  // API 请求（后端分页）
  pageFetchData: async (url, params) => {
    // url 为 apiUrl
    // params 为分页和搜索参数对象
    /**
      params 结构示例
      {
        pageNo: 1,
        pageSize: 10,
        searchValues: [{name:'value'}]
      }
     */
    console.log("后端分页请求参数:", params);
    let keys = [];
    Object.keys(params?.searchValues).forEach((key) => {
      if (
        params.searchValues[key] === null ||
        params.searchValues[key] === undefined ||
        params.searchValues[key] === ""
      ) {
        delete params.searchValues[key];
      } else {
        keys.push([key, "eq", params.searchValues[key]]);
      }
    });
    loading.value = true;
    return post(url, {
      pageQuery: {
        pageNo: params.pageNo,
        pageSize: params.pageSize,
        searchKey: "",
        keys: keys,
      },
    });
  },
  // 表单提交事件 - 处理新增和编辑逻辑
  handleFormSubmit: async ({ config, mode, data, record }) => {
    // config 是这个tableConfig的对象
    // mode 是新增还是编辑或者是其他的 create:新增 edit:编辑
    // data 是表单提交的数据
    // record 是当前编辑的行数据，新增时为 null
    if (mode === "create") {
      // 新增逻辑：调用后端 API 创建数据
      console.log("新增数据:", data);
      if (config.paginationType === "frontend") {
        tableData.value.push({
          [config?.rowKey || "key"]: String(Date.now() + Math.random()),
          ...data,
        });
      } else {
        await post(config.formAddApiUrl, {
          employeesDtos: [data],
        });
      }
      Message.success("新增成功");
    } else if (mode === "edit") {
      // 编辑逻辑：调用后端 API 更新数据
      console.log("编辑数据:", data);
      if (config.paginationType === "frontend") {
        const index = tableData.value.findIndex(
          (item) =>
            item[config?.rowKey || "key"] === data[config?.rowKey || "key"]
        );
        if (index !== -1) {
          tableData.value[index] = {
            ...tableData.value[index],
            ...data,
          };
        }
      } else {
        await put(config.formUpdateApiUrl, {
          employeesDtos: [data],
        });
      }
      Message.success("编辑成功");
    }
  },
  // 搜索条件变更
  handleSearch: (searchValues) => {
    console.log("搜索条件:", searchValues);
    Message.info(`搜索条件: ${JSON.stringify(searchValues)}`);
  },
  // 分页变化
  handlePageChange: (pagination) => {
    console.log("分页信息:", pagination);
  },
  // 列配置变化
  handleColumnConfigChange: (config) => {
    console.log("列配置变化", config);
  },
  // 是否显示列配置按钮
  showColumnConfig: true,

  // 是否显示表单（新增/编辑）
  showForm: true,

  // 表格大小
  tableSize: "small",

  // 滚动配置
  scroll: { x: 1200, y: "auto" },

  // 是否显示选择列
  selection: true,

  // 表格样式配置
  bordered: { cell: true }, // 边框配置：true=外框，{cell:true}=所有单元格边框
  hoverable: true, // 行悬停效果
  columnResizable: true, // 列宽可拖拽调整
  stripe: true, // 斑马纹背景

  // 行唯一标识字段名
  rowKey: rowKeyName, // 对应数据中的唯一标识字段，默认值为 'key'
});

const selectedKeys = ref([]);

// 事件处理
watch(
  () => selectedKeys.value,
  (newVal) => {
    console.log("选中行Key:", newVal);
  }
);

/**
 * 切换分页类型（演示）
 */
const paginationType = ref("frontend");

const switchPaginationType = () => {
  paginationType.value =
    paginationType.value === "frontend" ? "backend" : "frontend";
  tableConfig.paginationType = paginationType.value;
  if (tableConfig.paginationType === "backend") {
    // 如果切换到后端分页，清空表格数据，模拟重新从后端获取数据
    tableData.value = [];
    selectedKeys.value = [];
    console.log("tableRef.value", tableRef.value);

    if (tableRef.value) {
      // 触发表格重新加载数据
      tableRef.value.fetchData && tableRef.value.fetchData();
    }
  } else {
    window.location.reload();
  }
  Message.info(
    `已切换到${paginationType.value === "frontend" ? "前端" : "后端"}分页`
  );
};
const textareaValue = computed(() => {
  return JSON.parse(JSON.stringify(tableConfig, null, 8));
});
</script>

<template>
  <a-row >
      <a-col :span="16">
        <div class="example-container">
          <h1
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
            "
          >
            基于Arco的超级表格组件示例
            <a-button type="outline" size="large" @click="switchPaginationType"
              >切换分页模式（当前：{{ paginationType }}）</a-button
            >
          </h1>
          <!-- 使用通用表格组件 -->
          <SuperTable
            :ref="(ref) => (tableRef = ref)"
            :config="tableConfig"
            v-model:data="tableData"
            v-model:loading="loading"
            v-model:selectedKeys="selectedKeys"
          >
            <template #toolbar>
              <a-button type="secondary"> 导出 Excel </a-button>
            </template>
          </SuperTable>
        </div>
      </a-col>
      <a-col :span="8">
        <div style="display: flex; flex: auto; height: 100vh; overflow: auto">
          <VueJsonPretty
            showLineNumber
            editable
            showIcon
            selectOnClickNode
            :data="textareaValue"
          />
        </div>
      </a-col>
    </a-row>
</template>

<style scoped>
.example-container {
  padding: 20px;
  background: #f5f5f5;
  /* min-height: 100vh; */
  display: flex;
  flex-flow: column nowrap;
  width:100%;
}

.example-container h2 {
  margin: 0 0 16px 0;
  color: #333;
}

.config-docs h3 {
  margin-top: 0;
}

.config-docs ul {
  margin: 8px 0;
  padding-left: 20px;
}

.config-docs li {
  margin: 6px 0;
}

.config-docs code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 2px;
  font-family: "Courier New", monospace;
}
</style>
