<script setup>
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import { reactive, ref, computed } from "vue";
import { Message } from "@arco-design/web-vue";
import SuperTable from "./Table.vue";

// 表格加载状态
const loading = ref(false);

// 示例数据
const tableData = ref([
  {
    key: "1",
    name: "Jane Doe",
    department: "技术部",
    salary: 23000,
    email: "jane.doe@example.com",
    status: "active",
    joinDate: "2022-01-15",
    orderDetails: [],
  },
  {
    key: "2",
    name: "Alisa Ross",
    department: "销售部",
    salary: 25000,
    email: "alisa.ross@example.com",
    status: "active",
    joinDate: "2021-06-20",
    orderDetails: [],
  },
  {
    key: "3",
    name: "Kevin Sandra",
    department: "技术部",
    salary: 22000,
    email: "kevin.sandra@example.com",
    status: "inactive",
    joinDate: "2022-03-10",
    orderDetails: [],
  },
  {
    key: "4",
    name: "Ed Hellen",
    department: "人力资源",
    salary: 17000,
    email: "ed.hellen@example.com",
    status: "active",
    joinDate: "2023-01-05",
    orderDetails: [],
  },
  {
    key: "5",
    name: "William Smith",
    department: "财务部",
    salary: 27000,
    email: "william.smith@example.com",
    status: "active",
    joinDate: "2021-09-12",
    orderDetails: [],
  },
  {
    key: "6",
    name: "Emma Johnson",
    department: "市场部",
    salary: 26000,
    email: "emma.johnson@example.com",
    status: "active",
    joinDate: "2022-05-18",
    orderDetails: [],
  },
  {
    key: "7",
    name: "Michael Brown",
    department: "技术部",
    salary: 28000,
    email: "michael.brown@example.com",
    status: "active",
    joinDate: "2020-11-22",
    orderDetails: [],
  },
  {
    key: "8",
    name: "Sarah Davis",
    department: "销售部",
    salary: 24000,
    email: "sarah.davis@example.com",
    status: "inactive",
    joinDate: "2022-07-30",
    orderDetails: [],
  },
  {
    key: "9",
    name: "David Wilson",
    department: "技术部",
    salary: 29000,
    email: "david.wilson@example.com",
    status: "active",
    joinDate: "2021-02-14",
    orderDetails: [],
  },
  {
    key: "10",
    name: "Lisa Anderson",
    department: "人力资源",
    salary: 21000,
    email: "lisa.anderson@example.com",
    status: "active",
    joinDate: "2023-04-08",
    orderDetails: [],
  },
  {
    key: "11",
    name: "Tom Harris",
    department: "财务部",
    salary: 25000,
    email: "tom.harris@example.com",
    status: "active",
    joinDate: "2022-08-03",
    orderDetails: [],
  },
  {
    key: "12",
    name: "Rachel White",
    department: "市场部",
    salary: 23000,
    email: "rachel.white@example.com",
    status: "active",
    joinDate: "2021-10-11",
    orderDetails: [],
  },
]);

// 表格配置 - 前端分页示例
const tableConfig = reactive({
  // 列配置
  columns: [
    {
      title: "姓名",
      dataIndex: "name",
      width: 120,
      visible: true,
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
      width: 120,
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
        required: true,
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
                placeholder: "请输入姓名",
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
              callback: (records) => {
                console.log("删除:", records);
              },
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
  pageSize: 5,
  pageSizeOptions: [5, 10, 20, 50],

  // 后端分页配置（如果使用后端分页）
  apiUrl: "/api/employee/list",

  // 操作按钮配置
  actions: [
    {
      key: "view",
      label: "查看",
      icon: "eye",
      message: "查看成功",
      callback: (records) => {
        console.log("查看:", records);
      },
    },
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
      callback: (records) => {
        console.log("删除:", records);
      },
    },
  ],

  // 是否显示列配置按钮
  showColumnConfig: true,

  // 是否显示表单（新增/编辑）
  showForm: true,

  // 表格大小
  tableSize: "small",

  // 滚动配置
  scroll: { x: 1200, y: "100%" },

  // 是否显示选择列
  selection: true,

  // 表格样式配置
  bordered: { cell: true }, // 边框配置：true=外框，{cell:true}=所有单元格边框
  hoverable: true, // 行悬停效果
  columnResizable: true, // 列宽可拖拽调整
  stripe: true, // 斑马纹背景

  // 行唯一标识字段名
  rowKey: "key", // 对应数据中的唯一标识字段，默认值为 'key'
});

const selectedKeys = ref([]);
// 事件处理

/**
 * 操作按钮点击
 */
const handleActionClick = (data) => {
  const { actionKey, records, callback, apiUrl, params } = data;

  console.log("操作点击:", { actionKey, records, apiUrl });

  if (callback && typeof callback === "function") {
    callback(records);
  }

  // 如果有 API 地址，可以在这里发送请求
  if (apiUrl) {
    simulateApiRequest(apiUrl, params, records);
  }
};

/**
 * 搜索事件
 */
const handleSearch = (searchValues) => {
  console.log("搜索条件:", searchValues);
  Message.info(`搜索条件: ${JSON.stringify(searchValues)}`);
};

/**
 * 分页变化
 */
const handlePageChange = (pagination) => {
  console.log("分页信息:", pagination);
};

/**
 * 列配置变化
 */
const handleColumnConfigChange = (config) => {
  console.log("列配置已改变:", config);
};

/** * 表单提交
 */
const handleFormSubmit = (data) => {
  console.log("表单提交:", data);

  if (data.mode === "create") {
    // 新增逻辑：调用后端 API 创建数据
    console.log("新增数据:", data.data);
    Message.success("新增成功");
    // tableData.value.push({ ...data.data, key: String(tableData.value.length + 1) });
  } else {
    // 编辑逻辑：调用后端 API 更新数据
    console.log("编辑数据:", data.data);
    const index = tableData.value.findIndex((item) => item.key === data.data.key);
    if (index !== -1) {
      tableData.value[index] = { ...tableData.value[index], ...data.data };
    }
    Message.success("编辑成功");
  }
};

/** * API 请求（后端分页）
 */
const handleApiRequest = async (params) => {
  console.log("后端分页请求参数:", params);
  // 这里可以发送真实的 API 请求
  // const response = await fetch('/api/employee/list', { body: JSON.stringify(params) })
};

/**
 * 模拟 API 请求
 */
const simulateApiRequest = (apiUrl, paramsFunc, records) => {
  loading.value = true;
  setTimeout(() => {
    const params = typeof paramsFunc === "function" ? paramsFunc(records) : paramsFunc;
    console.log("API 请求:", { apiUrl, params });
    Message.success(`已发送请求到 ${apiUrl}`);
    loading.value = false;
  }, 500);
};

/**
 * 切换分页类型（演示）
 */
const paginationType = ref("frontend");

const switchPaginationType = () => {
  paginationType.value = paginationType.value === "frontend" ? "backend" : "frontend";
  tableConfig.paginationType = paginationType.value;
  Message.info(`已切换到${paginationType.value === "frontend" ? "前端" : "后端"}分页`);
};
const textareaValue = computed(() => {
  return JSON.parse(JSON.stringify(tableConfig, null, 8));
});
</script>

<template>
  <div style="display: flex; justify-content: space-between">
    <div class="example-container">
      <h1>基于Acro的超级表格组件示例</h1>
      <!-- 使用通用表格组件 -->
      <SuperTable
        :config="tableConfig"
        :data="tableData"
        :loading="loading"
        v-model:selectedKeys="selectedKeys"
        @action-click="handleActionClick"
        @search="handleSearch"
        @page-change="handlePageChange"
        @column-config-change="handleColumnConfigChange"
        @form-submit="handleFormSubmit"
        @api-request="handleApiRequest"
      >
        <template #toolbar>
          <a-button type="secondary"> 导出 Excel </a-button>
        </template>
      </SuperTable>
    </div>
    <div style="display: flex; flex: auto; height: 100vh; overflow: auto">
      <VueJsonPretty
        showLineNumber
        editable
        showIcon
        selectOnClickNode
        :data="textareaValue"
      />
    </div>
  </div>
</template>

<style scoped>
.example-container {
  padding: 20px;
  background: #f5f5f5;
  /* min-height: 100vh; */
  display: flex;
  flex-flow: column nowrap;
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
