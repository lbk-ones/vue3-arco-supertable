// 整理所有属性到一个对象
const wt = {
  // Column Configuration
  columns: [
    {
      title: "姓名",
      dataIndex: "name",
      width: 160,
      visible: true,
      ellipsis: true,
      fixed: "left",
      align: "left",
      slotName: "status-cell",
      // Merged sortable config
      sortable: {
        compare: "(a, b) => a.localeCompare(b)"
      },
      // Merged statusMap from different columns
      statusMap: {
        active: { label: "在职", color: "green" },
        inactive: { label: "离职", color: "red" },
        true: { label: "启用", color: "green" },
        false: { label: "禁用", color: "red" }
      },
      // Merged form configuration (superset of all form props)
      form: {
        type: "input",
        creatable: true,
        editable: true,
        required: true,
        placeholder: "请输入姓名",
        enterNext: "department",
        oneRow: true,
        columns: 1,
        // Merged attributes from input, number, textarea, etc.
        attrs: {
          "max-length": 50,
          min: 0,
          max: 999999,
          "auto-size": { minRows: 2, maxRows: 4 },
          rows: 4
        },
        // Merged options (one representative object)
        options: [
          { label: "技术部", value: "技术部" }
        ],
        validator: "(value) => { ... }",
        slotName: "phone-input",
        // Nested table configuration (for 'orderDetails')
        tableConfig: {
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
                  min: 0,
                  max: 999999
                }
              }
            }
          ],
          paginationType: "frontend",
          pageSize: 5,
          pageSizeOptions: [5],
          apiUrl: "/api/employee/list",
          actions: [
            {
              key: "delete",
              label: "删除",
              icon: "edit",
              status: "danger",
              type: "confirm",
              confirmMessage: "确定要删除选中的数据吗？",
              message: "删除成功",
              apiUrl: "/api/employee/delete",
              params: "(records) => ({ ids: records.map((r) => r.key) })"
            }
          ],
          showColumnConfig: false,
          showForm: true,
          tableSize: "small",
          scroll: { x: "auto", y: "auto" },
          selection: true,
          modalWidth: 900,
          bordered: { cell: true },
          hoverable: false,
          columnResizable: false,
          stripe: true,
          rowKey: "key"
        }
      }
    }
  ],

  // Search Fields Configuration
  searchFields: [
    {
      dataIndex: "name",
      title: "姓名",
      type: "input",
      placeholder: "搜索姓名",
      slotName: "slot-test",
      attrs: {
        "max-length": 50,
        "allow-clear": true,
        min: 0,
        max: 100000,
        step: 1000
      },
      options: [
        { label: "技术部", value: "技术部" }
      ]
    }
  ],

  // Main Table Settings
  paginationType: "frontend",
  pageSize: 10,
  pageSizeOptions: [5],
  pageApiUrl: "/pd/employees/pageQueryEmployees",
  formAddApiUrl: "/pd/employees/saveEmployees",
  formUpdateApiUrl: "/pd/employees/updateEmployees",
  formDeleteApiUrl: "/pd/employees/deleteEmployees",

  // Actions (Merged view, edit, delete, other)
  actions: [
    {
      key: "view",
      label: "查看",
      icon: "eye",
      message: "查看成功",
      type: "outline",
      status: "danger",
      confirmMessage: "确定要删除选中的数据吗？",
      apiUrl: null,
      params: null,
      attrs: null,
      needSelect: true,
      isFetchData: false
    }
  ],

  showColumnConfig: true,
  cnDesc: "员工信息",
  showForm: true,
  tableSize: "small",
  modalWidth: 1000,
  formLayout: "horizontal",
  formColumns: 4,
  scroll: { x: 1200, y: "auto" },
  selection: true,
  bordered: { cell: true },
  hoverable: true,
  columnResizable: true,
  stripe: false,
  rowKey: "id", // Resolved from rowKeyName variable
  showHeader: true,
  tableAttrs: {},
  hoverColor: "#eef5f8",
  hoverFontColor: "",
  headerFontColor: "",
  headerBgColor: "#eef5f8",
  tablePaginationAttrs: {},
  uniqueId: "personal_info",
  userCode: "",
  enableLocalStorage: true,
  contextMenuEnabled: true,
  showSearchBar: false,
}

export default wt;
