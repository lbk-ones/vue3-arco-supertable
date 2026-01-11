<script setup>
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import { reactive, ref, computed, watch, h } from "vue";
import { Message } from "@arco-design/web-vue";
import TableConfigEditor from "./TableConfigEditor.vue";
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
    enable: "false",
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
    enable: true,
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
    enable: true,
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
    enable: true,
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
    enable: true,
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
    enable: true,
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
    enable: true,
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
    enable: true,
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
    enable: true,
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
    enable: true,
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
    enable: true,
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
    enable: true,
  },
]);
const expandRowKeys = ref([]);
// columns 的字段的宽度最好不要每个都写死，留一个自动计算，不然fixed会有问题的
// 表格配置 - 前端分页示例
const tableConfig = reactive({
  // 列配置
  columns: [
    {
      title: "序号",
      dataIndex: "_rowIndex",
      width: 70,
      visible: true,
      fixed: "left",
      align: "left",
    },
    {
      title: "姓名",
      dataIndex: "name",
      width: 160,
      visible: true,
      ellipsis: true,
      fixed: "left",
      align: "left",
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
      align: "left",
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
      //type: "status",
      slotName: "status-cell", // 预留插槽 写死
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
      ellipsis: true,
      visible: true,
      form: {
        type: "date",
        creatable: true,
        editable: true,
        required: true,
        enterNext: "phone", // 回车聚焦到电话字段
        placeholder: "请选择加入日期",
      },
    },
    {
      title: "电话",
      dataIndex: "phone",
      width: 160,
      visible: true,
      ellipsis: true,
      sortable: {
        compare: (a, b) => a.localeCompare(b),
      },
      form: {
        type: "slot",
        slotName: "phone-input",
        creatable: true,
        columns: 1, // 占两列
        editable: true,
        required: true,
        oneRow: false,
        placeholder: "我是个插槽",
        enterNext: "remark", // 回车聚焦到电话字段
      },
    },
    {
      title: "是否启用",
      dataIndex: "enable",
      width: 160,
      visible: true,
      ellipsis: true,
      sortable: {
        compare: (a, b) => a.localeCompare(b),
      },
      //type: "enable", // 预留的写死
      slotName: "status-cell", // 预留插槽 写死
      statusMap: {
        true: { label: "启用", color: "green" },
        false: { label: "禁用", color: "red" },
      },
      form: {
        type: "slot",
        slotName: "enable-switch",
        creatable: true,
        //columns: 2, // 占两列
        editable: true,
        required: true,
        placeholder: "我是个插槽",
        enterNext: "remark", // 回车聚焦到电话字段
      },
    },
    {
      title: "备注",
      dataIndex: "remark",
      // width: 160,
      visible: true,
      ellipsis: true,
      sortable: {
        compare: (a, b) => a.localeCompare(b),
      },
      form: {
        type: "textarea",
        creatable: true,
        editable: true,
        required: true,
        oneRow: true,
        placeholder: "输入备注",
        attrs: {
          "auto-size": { minRows: 2, maxRows: 4 },
          rows: 4,
        },
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
      condition: "eq",
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
      condition: "le",
      attrs: {
        min: 0,
        max: 100000,
        step: 1000,
      },
    },
    {
      dataIndex: "joinDate",
      title: "加入时间",
      type: "date-range",
      //placeholder: "选择加入时间",
    },
    {
      dataIndex: "salary",
      title: "测试slot",
      type: "slot",
      slotName: "slot-test",
      placeholder: "输入薪资",
    },
  ],

  // 分页类型：frontend（前端分页）或 backend（后端分页）
  paginationType: "frontend",
  pageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],

  // 后端分页配置（如果使用后端分页）
  pageApiUrl: "/pd/employees/pageQueryEmployees",

  // 后端表单新增接口地址
  formAddApiUrl: "/pd/employees/saveEmployees",

  // 后端表单更新的接口地址
  formUpdateApiUrl: "/pd/employees/updateEmployees",

  // 后端表格删除接口
  formDeleteApiUrl: "/pd/employees/deleteEmployees",

  // 操作按钮配置
  actions: [
    {
      key: "view",
      label: "查看",
      icon: "eye",
      message: "查看成功",
      type: "outline",
      // 查看操作在 Table.vue 中自动处理，这里只需配置按钮信息 接口在 handleFormSubmit 方法中
    },
    {
      key: "edit",
      label: "编辑",
      icon: "edit",
      type: "outline",
      // 编辑操作在 Table.vue 中自动处理，这里只需配置按钮信息 接口在 handleFormSubmit 方法中
    },
    {
      key: "delete",
      label: "删除",
      status: "danger", // 按钮成红色危险状态 normal - 正常（默认）、success - 成功、warning - 警告、danger - 危险
      type: "confirm", // 弹出提示框 confirm === 次级按钮  主要按钮、次级按钮、虚框按钮、文字按钮、线性按钮，default 为次级按钮。
      confirmMessage: "确定要删除选中的数据吗？", // type === confirm 的提示语
      message: "删除成功",
      apiUrl: null, // 当前这个操作要调用的api 会进入executeAction回调中的第一个参数action的apiUrl
      params: null, // 处理之后进入executeAction处理,可以是函数|对象
      attrs: null, // 透传属性或者事件可以写到一起
    },
    {
      key: "other",
      label: "其他",
      icon: "edit",
      type: "outline",
      needSelect: false,
      isFetchData: false,
      // 编辑操作在 Table.vue 中自动处理，这里只需配置按钮信息 接口在 handleFormSubmit 方法中
    },
  ],

  // 是否显示列配置按钮
  showColumnConfig: true,

  // 表描述
  cnDesc: "员工信息",

  // 是否显示表单（新增/编辑）
  showForm: true,

  // 表格大小
  tableSize: "small",

  // 弹窗宽度
  modalWidth: 1000,

  // 表单布局
  formLayout: "horizontal", // 表单布局 horizontal vertical

  // 表单列数，4代表一行4列
  formColumns: 4,

  // 表格滚动配置
  scroll: { x: 1200, y: "auto" },

  // 是否显示选择列
  selection: true,

  // 表格样式配置
  bordered: { cell: true }, // 边框配置：true=外框，{cell:true}=所有单元格边框

  // 行悬停效果
  hoverable: true,

  // 列宽可拖拽调整
  columnResizable: true,

  // 斑马纹背景
  stripe: false,

  // 行唯一标识字段名
  rowKey: rowKeyName, // 对应数据中的唯一标识字段，默认值为 'key'

  // 显示表头
  showHeader: true,

  // 表格透传属性|事件
  tableAttrs: {},

  // hover 行背景颜色
  hoverColor: "#eef5f8",

  // hover 字体颜色
  hoverFontColor: "",

  // 表头字体颜色 （表头字体默认加粗 不做更改）
  // headerFontColor:'#7f70a0',
  headerFontColor: "",

  // 表头背景颜色
  headerBgColor: "#eef5f8",

  // 是否显示多选框
  selection: true,

  // 分页透传属性|事件
  tablePaginationAttrs: {
    "hide-on-single-page": true,
  },

  // 表格唯一标识 (必填，开启本地存储时需要)
  uniqueId: "personal_info",

  // 用户自定义代码 (可选，用于区分不同用户配置)
  userCode: "",

  // 是否启用本地存储
  enableLocalStorage: true,

  // 是否启用右键菜单
  contextMenuEnabled: true,

  // 是否直接显示搜索条件,true代表直接显示搜索条件（移除掉搜索按钮和关闭按钮）,false代表点击搜索按钮才显示
  showSearchBar: false,

  // 执行操作按钮的回调 edit 和 view 不会进入这个回调 因为它们是弹窗形式的操作
  executeAction: async (config, action, records, params) => {
    // records: 为选中的数据数组
    // action: 为当前这个操作对应的action对象
    // params: action params 方法 处理过后的参数
    if (action.key == "delete") {
      if (config.paginationType === "frontend") {
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
        await del(
          (action.apiUrl || config.formDeleteApiUrl) +
            "/" +
            records?.map((r) => r[rowKeyName])?.join(",")
        );
      }
    } else if (action.key === "expand") {
      console.log("records--->", records);

      expandRowKeys.value = records.map((record) => record[rowKeyName]);
    }
  },
  // API 请求（后端分页）
  pageFetchData: async (url, params, searchFields) => {
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
        let findItem = searchFields?.find((item) => item.dataIndex === key);
        keys.push([key, findItem?.condition || "eq", params.searchValues[key]]);
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
          (item) => item[config?.rowKey || "key"] === data[config?.rowKey || "key"]
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
});

const selectedKeys = ref([]);

// 事件处理
watch(
  () => selectedKeys.value,
  (newVal) => {
    console.log("选中行Key:", newVal);
  }
);

const showConfig = ref(false);
/**
 * 切换分页类型（演示）
 */
const paginationType = ref("frontend");

const switchPaginationType = () => {
  paginationType.value = paginationType.value === "frontend" ? "backend" : "frontend";
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
  Message.info(`已切换到${paginationType.value === "frontend" ? "前端" : "后端"}分页`);
};
const inputNum = ref(0);
const textareaValue = computed(() => {
  return JSON.parse(JSON.stringify(tableConfig, null, 8));
});
const handleAddPhone = () => {
  let index = tableConfig.columns.findIndex((it) => {
    return it.dataIndex === "phone" + (inputNum.value == 0 ? "" : inputNum.value);
  });
  inputNum.value++;
  tableConfig.columns.splice(index + 1, 0, {
    title: "电话" + inputNum.value,
    dataIndex: "phone" + inputNum.value,
    visible: true,
    form: {
      type: "input",
      //slotName: "phone-input",
      creatable: true,
      editable: true,
      required: true,
      oneRow: false,
      placeholder: "我是电话" + inputNum.value,
      enterNext: "remark", // 回车聚焦到电话字段
    },
  });
};
</script>

<template>
  <a-row>
    <a-col :span="16">
      <div class="example-container">
        <h1
          style="display: flex; align-items: center; justify-content: center; gap: 10px"
        >
          基于Arco的超级表格组件示例
          <a-button type="outline" size="large" @click="switchPaginationType"
            >切换分页模式（当前：{{ paginationType }}）</a-button
          >

          <a-button type="outline" size="large" @click="() => (showConfig = true)"
            >配置编辑</a-button
          >
        </h1>
        <!-- 使用通用表格组件 :config="tableConfig" v-model:data="tableData" -->

        <SuperTable
          :config="tableConfig"
          v-model:data="tableData"
          :ref="(ref) => (tableRef = ref)"
          v-model:loading="loading"
          v-model:selectedKeys="selectedKeys"
        >
          <template #table-top>
            <a-alert>这是一个表格上方插槽示例</a-alert>
          </template>
          <template #table-bottom>
            <a-alert>这是一个表格下方插槽示例</a-alert>
          </template>
          <!-- <template #actions-right="{ size }">
            <a-button type="secondary" :size="size"> 导入 </a-button>
            <a-button type="secondary" :size="size"> 导出 </a-button>
          </template> -->

          <template
            #phone-input="{ domRef, field, formData, disabled, attrs, handleEnter }"
          >
            <!-- 注意要绑定enter事件用来聚焦到下一个控件 -->
            <a-space :size="8">
              <a-input
                :ref="(ref) => domRef(ref)"
                v-model="formData[field.dataIndex]"
                v-bind="attrs"
                :disabled="disabled"
                :placeholder="field.form.placeholder"
                @keydown.enter="handleEnter"
              />
              <a-button @click="handleAddPhone">+</a-button>
            </a-space>
          </template>

          <!-- 其实预留了这个组件的 这里只是做个测试而已 -->
          <template #enable-switch="{ field, formData, disabled, attrs, handleUpdate }">
            <a-space :size="8">
              <a-switch
                :model-value="formData[field.dataIndex]"
                @update:model-value="handleUpdate"
                :disabled="disabled"
                v-bind="attrs"
              />
            </a-space>
          </template>
          <template #slot-test="{ field, state, config, handleSearch }">
            <a-input-search
              v-model="state.searchValues[field.dataIndex]"
              :placeholder="field.placeholder || `搜索${field.title}`"
              allow-clear
              :size="config.tableSize || 'small'"
              @search="handleSearch"
              v-bind="field.attrs || {}"
              v-on="field.attrs || {}"
            />
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

  <a-drawer
    :width="'50%'"
    v-model:visible="showConfig"
    title="表格配置编辑器"
    :footer="false"
  >
    <TableConfigEditor :config="tableConfig" />
  </a-drawer>
</template>

<style scoped>
.example-container {
  padding: 20px;
  background: #f5f5f5;
  /* min-height: 100vh; */
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
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
