<script setup>
import {
  reactive,
  computed,
  onUnmounted,
  onMounted,
  watch,
  ref,
  onBeforeUpdate,
  readonly,
} from "vue";
import { Message, Modal } from "@arco-design/web-vue";
import TableForm from "./TableForm.vue";
import TableInfo from "./TableInfo.vue";

// Props 定义
const props = defineProps({
  // 表格配置
  config: {
    type: Object,
    required: true,
    // 示例配置结构：
    // {
    //   columns: [],                    // 列配置
    //   searchFields: [],               // 搜索字段
    //   paginationType: 'backend' | 'frontend',  // 分页类型
    //   pageSize: 10,
    //   pageApiUrl: '/api/list',            // 后端分页接口
    //   actions: [],                    // 操作按钮配置
    //   showColumnConfig: true,         // 是否显示列配置
    //   showForm: true,                 // 是否显示新增/编辑表单
    //   tableSize: 'small|medium|large',// 表格大小
    //   rowKey: 'key',                  // 行唯一标识字段名
    //   scroll: { x: 1200, y: ... },    // 滚动配置
    //   selection: true,                // 是否显示选择列
    //   bordered: true|{cell:true},     // 边框配置，true=显示外框，{cell:true}=显示所有边框
    //   hoverable: true,                // 是否显示行悬停效果
    //   columnResizable: true,          // 列是否可拖拽调整宽度
    //   stripe: false,                  // 是否显示斑马纹
    //   pageSizeOptions: [10,20,50,100],// 分页选项
    //   uniqueId: 'uid',                // 表格唯一标识 (必填，开启本地存储时需要)
    //   userCode: 'user1',              // 用户自定义代码 (可选，用于区分不同用户配置)
    //   enableLocalStorage: true,       // 是否启用本地存储
    // }
    default: () => {
      return {
        // 列配置
        columns: [],
        // 搜索字段配置
        searchFields: [],
        // 分页类型：frontend（前端分页）或 backend（后端分页）
        paginationType: "frontend",
        pageSize: 10,
        pageSizeOptions: [5, 10, 20, 50],

        // 后端分页配置（如果使用后端分页）
        pageApiUrl: "",

        // 后端表单新增接口地址
        formAddApiUrl: "",

        // 后端表单更新的接口地址
        formUpdateApiUrl: "",

        // 后端表格删除接口
        formDeleteApiUrl: "",

        // 操作按钮配置
        actions: [],

        // 是否显示列配置按钮
        showColumnConfig: true,

        // 表描述
        cnDesc: "超级表格",

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
        rowKey: "key", // 对应数据中的唯一标识字段，默认值为 'key'

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
        uniqueId: "",

        // 用户自定义代码 (可选，用于区分不同用户配置)
        userCode: "",

        // 是否启用本地存储
        enableLocalStorage: false,

        // 是否启用右键菜单
        contextMenuEnabled: true,

        // 是否直接显示搜索条件
        showSearchBar: false,
      };
    },
  },
  // 表格数据（前端分页或初始数据）
  data: {
    type: Array,
    default: () => [],
  },
  // 是否加载中
  loading: {
    type: Boolean,
    default: false,
  },
  // 是否表单项
  isFormItem: {
    type: Boolean,
    default: false,
  },
  // 选中行数组，由外部传进来
  selectedKeys: {
    type: Array,
    default: () => [],
  },
  // 表单禁用状态
  tableDisabled: {
    type: Boolean,
    default: false,
  },
});

// Emits 定义
const emit = defineEmits([
  // "action-click", // 操作按钮点击
  // "search", // 搜索事件
  //"page-change", // 分页变化
  //"column-config-change", // 列配置变化
  // "api-request", // API 请求（后端分页）
  // "form-submit", // 表单提交
  "update:selectedKeys", // 选中行变化
  "update:data", // 表格数据集合变化
  "update:loading", // 表格数据集合变化
]);

// 状态管理
const state = reactive({
  //selectedKeys: [],
  searchValues: {}, // 搜索值对象
  currentPage: 1,
  pageSize: props.config.pageSize || 10,
  columnConfig: [], // 当前列配置
  totalCount: 0, // 总数据条数
  //apiData: [], // API 返回的数据
  visibleColumnModal: false, // 列配置弹窗
  columnOrder: [], // 列顺序
  columnVisibility: {}, // 列显示状态
  visibleSearchBar: false, // 搜索条件展开状态
  columnSearchValue: "", // 列配置搜索值
  highlightedColumns: new Set(), // 高亮的列名集合
  formVisible: false, // 表单弹窗
  formMode: "create", // 表单模式：create、edit 或 readonly
  formRecord: null, // 编辑的记录
  viewListVisible: false, // 多条记录选择列表弹窗
  viewListRecords: [], // 要查看/编辑的多条记录
  viewListMode: "view", // 列表模式：view 或 edit
  currentViewRecord: null, // 当前查看的单条记录
  contextMenuVisible: false, // 右键菜单显示状态
  contextMenuPosition: { x: 0, y: 0 }, // 右键菜单位置
  contextMenuRecord: null, // 右键点击的行数据
});

const visibleTableInfo = ref(false); // 表格信息弹窗

// 表格表单引用
const tableFormRef = ref(null);

// 环境检查
const isBrowser = typeof window !== "undefined";

// --- LocalStorage Logic ---

// 获取存储Key
const getStorageKey = () => {
  const { uniqueId, userCode, enableLocalStorage } = props.config;
  if (!enableLocalStorage || !uniqueId) return null;
  return userCode ? `${uniqueId}_${userCode}` : `${uniqueId}`;
};

// 安全解析JSON
const safeParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error("Table Config Parse Error:", e);
    return null;
  }
};

// 合并配置（保留本地存储的顺序和宽度，合并代码中的新列）
const mergeConfig = (defaultCols, storedCols) => {
  const merged = [];
  const defaultMap = new Map(defaultCols.map((col) => [col.dataIndex, col]));

  // 1. 优先使用存储中的列配置（保持顺序）
  storedCols.forEach((sc) => {
    if (defaultMap.has(sc.dataIndex)) {
      const col = defaultMap.get(sc.dataIndex);
      // 应用存储的宽度
      if (sc.width) col.width = sc.width;
      if (sc.fixed) col.fixed = sc.fixed;
      if (sc.ellipsis !== undefined) col.ellipsis = sc.ellipsis;
      // 暂存存储的可见性状态
      if (sc.visible !== undefined) col._storedVisible = sc.visible;
      merged.push(col);
      defaultMap.delete(sc.dataIndex);
    }
  });

  // 2. 追加代码中新增的列
  defaultCols.forEach((col) => {
    if (defaultMap.has(col.dataIndex)) {
      merged.push(col);
    }
  });

  return merged;
};

// 保存配置到本地存储
const saveConfigToStorage = (field, columns) => {
  if (!props.config.enableLocalStorage || !isBrowser) return;
  const key = getStorageKey();
  if (!key) return;

  try {
    const simpleConfig = columns.map((col) => ({
      dataIndex: col.dataIndex,
      width: col.width,
      fixed: col.fixed,
      ellipsis: col.ellipsis,
      // 如果是保存 initialValue，直接用 visible 属性
      // 如果是保存 latestValue，检查 columnVisibility 状态
      visible:
        field === "initialValue"
          ? col.visible !== false
          : state.columnVisibility[col.dataIndex] !== false,
    }));

    const storedStr = localStorage.getItem(key);
    const existing = safeParse(storedStr) || {};
    existing[field] = simpleConfig;

    // 如果是首次保存 initialValue，且没有 latestValue，则同步初始化 latestValue
    if (field === "initialValue" && !existing.latestValue) {
      existing.latestValue = simpleConfig;
    }

    localStorage.setItem(key, JSON.stringify(existing));
  } catch (e) {
    console.error("Save config failed", e);
  }
};

// 重置列配置
const handleResetColumnConfig = () => {
  let targetConfig = null;
  const key = getStorageKey();

  // 尝试从 storage 获取 initialValue
  if (props.config.enableLocalStorage && isBrowser && key) {
    try {
      const stored = safeParse(localStorage.getItem(key));
      if (stored && stored.initialValue) {
        targetConfig = mergeConfig(
          JSON.parse(JSON.stringify(props.config.columns)),
          stored.initialValue
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 如果没有获取到（或未启用 storage），直接使用 props 配置
  if (!targetConfig) {
    targetConfig = JSON.parse(JSON.stringify(props.config.columns));
  }

  // 更新状态
  updateStateColumns(targetConfig);

  // 同步更新 latestValue
  if (props.config.enableLocalStorage) {
    saveConfigToStorage("latestValue", state.columnConfig);
  }

  Message.success("已重置为初始配置");
};

// 统一更新列状态的辅助函数
const updateStateColumns = (columns) => {
  state.columnConfig = columns;
  state.columnOrder = [];
  //state.columnVisibility = {}; // 不直接重置对象，而是更新属性，保持响应性
  // 清理旧的可见性状态? 还是直接覆盖? 直接覆盖即可。
  const newVisibility = {};

  state.columnConfig.forEach((col, index) => {
    // 确定可见性
    let isVisible = true;
    if (col._storedVisible !== undefined) {
      isVisible = col._storedVisible;
      delete col._storedVisible;
    } else {
      isVisible = col.visible !== false;
    }

    newVisibility[col.dataIndex] = isVisible;
    state.columnOrder.push({
      index,
      dataIndex: col.dataIndex,
      title: col.title,
    });

    if (!col.slotName) {
      col.slotName = `${col.dataIndex}-cell`;
    }
    // 初始化 fixed 属性，如果没有则默认为 false (即不固定)
    if (!col.fixed) {
      col.fixed = false;
    }
  });

  // 更新 visibility 对象
  state.columnVisibility = newVisibility;
};

// 初始化列配置
const initializeColumns = () => {
  if (!props.config.columns) return;
  let finalColumns = JSON.parse(JSON.stringify(props.config.columns));

  // 尝试加载本地存储
  if (props.config.enableLocalStorage && isBrowser) {
    const key = getStorageKey();
    if (key) {
      try {
        const storedData = safeParse(localStorage.getItem(key));
        if (storedData) {
          // 优先加载 latestValue，其次 initialValue
          const configToLoad = storedData.latestValue || storedData.initialValue;
          if (configToLoad && Array.isArray(configToLoad)) {
            finalColumns = mergeConfig(finalColumns, configToLoad);
          }
        } else {
          // 首次加载，保存 initialValue
          saveConfigToStorage("initialValue", finalColumns);
        }
      } catch (e) {
        console.error("Load config failed", e);
      }
    }
  }

  updateStateColumns(finalColumns);
};

// 监听配置变化自动保存
watch(
  [() => state.columnConfig, () => state.columnVisibility],
  () => {
    if (props.config.enableLocalStorage && state.columnConfig.length > 0) {
      saveConfigToStorage("latestValue", state.columnConfig);
    }
  },
  { deep: true }
);
const columnLength = computed(() => props.config?.columns?.length ?? 0);
// 监听 columns 变化，初始化列配置 只有长度变化才重新初始化
watch(columnLength, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    initializeColumns();
  }
});

// 获取显示的列（不包括操作列）
const visibleColumns = computed(() => {
  return state.columnConfig.filter(
    (col) => state.columnVisibility[col.dataIndex] !== false
  );
});

// 获取表格数据
const tableData = computed(() => {
  if (props.config.paginationType === "backend") {
    return props.data || [];
  } else {
    // 前端分页
    const filtered = getFilteredData();
    const start = (state.currentPage - 1) * state.pageSize;
    const end = start + state.pageSize;
    return filtered.slice(start, end);
  }
});

// 获取筛选后的数据
const getFilteredData = () => {
  let result = props.data;

  // 应用搜索过滤
  if (props.config.searchFields && Object.keys(state.searchValues).length > 0) {
    result = result.filter((item) => {
      return Object.entries(state.searchValues).every(([field, value]) => {
        if (value === null || value === undefined || value === "") return true;

        const searchField = props.config.searchFields.find((f) => f.dataIndex === field);
        const fieldValue = item[field];
        const fieldType = searchField?.type || "input";

        // 根据搜索字段类型处理搜索逻辑
        switch (fieldType) {
          case "checkbox": // 复选框：数组类型，检查是否有交集
            if (Array.isArray(value) && value.length > 0) {
              const itemValue = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
              return value.some((v) => itemValue.includes(v));
            }
            return true;

          case "date-range": // 日期范围：检查是否在范围内
            if (Array.isArray(value) && value.length === 2) {
              const [startDate, endDate] = value;
              const itemDate = new Date(fieldValue);
              return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
            }
            return true;

          case "number": // 数字：精确匹配
            return Number(fieldValue) === Number(value);

          case "switch": // 开关：布尔值匹配
            return Boolean(fieldValue) === Boolean(value);

          default:
            // 默认：文本模糊匹配
            const searchStr = String(value || "").toLowerCase();
            const itemStr = String(fieldValue || "").toLowerCase();
            return itemStr.includes(searchStr);
        }
      });
    });
  }

  state.totalCount = result.length;
  return result;
};

// 获取总数
const totalCount = computed(() => {
  if (props.config.paginationType === "backend") {
    return state.totalCount;
  } else {
    return getFilteredData().length;
  }
});

// 获取搜索字段的选项
const getSearchOptions = (field) => {
  if (!field.options) return [];

  // 如果是函数，则调用函数获取选项
  if (typeof field.options === "function") {
    return field.options(state.searchValues, field);
  }

  return field.options || [];
};

// 搜索处理
const handleSearch = () => {
  state.currentPage = 1;
  if (props.config.paginationType === "backend") {
    fetchData();
  }
  props.config?.handlerSearch?.(state.searchValues);
};

// 重置搜索
const handleResetSearch = () => {
  state.searchValues = {};
  state.currentPage = 1;
  if (props.config.paginationType === "backend") {
    fetchData();
  }
};

// 获取后端数据
const fetchData = async () => {
  if (props.config.paginationType !== "backend" || !props.config.pageApiUrl) return;
  let loading = false;
  try {
    let data = await props.config?.pageFetchData?.(
      props.config.pageApiUrl,
      {
        pageNo: state.currentPage,
        pageSize: state.pageSize,
        searchValues: state.searchValues,
      },
      props.config.searchFields || []
    );
    loading = true;
    emit("update:loading", false);
    let records = data?.records || [];
    emit("update:data", records);
    //state.apiData = records || [];
    state.totalCount = parseInt(data?.total || 0);
  } catch (error) {
    console.error("数据加载失败:", error);
    Message.error("数据加载失败");
  } finally {
    if (loading === false) emit("update:loading", false);
  }
};

// 分页变化
const handlePageChange = (page) => {
  state.currentPage = page;
  if (props.config.paginationType === "backend") {
    fetchData();
  }
  props.config?.handlePageChange?.({ page, pageSize: state.pageSize });
};

const handlePageSizeChange = (pageSize) => {
  state.pageSize = pageSize;
  state.currentPage = 1;
  if (props.config.paginationType === "backend") {
    fetchData();
  }
  props.config?.handlePageChange?.({ page, pageSize: state.pageSize });
};

// 行选择
const handleSelectionChange = (keys) => {
  emit("update:selectedKeys", keys);
};

// 兼容获取唯一值的方法
const getKeyName = () => {
  return props.config.rowKey || "key";
};

// 行点击事件
const handleRowClick = (record) => {
  if (props.config.selection === false) return;
  const key = record[getKeyName()];
  let selectKeys = [...props.selectedKeys];
  const index = selectKeys.findIndex((e) => e === key);

  if (index > -1) {
    // 如果已选中，则取消选中
    selectKeys.splice(index, 1);
  } else {
    // 如果未选中，则添加到选中列表
    selectKeys.push(key);
  }
  emit("update:selectedKeys", selectKeys);
};

// 右键菜单处理
const handleRowContextMenu = (record, event) => {
  if (props.config.contextMenuEnabled === false) return;

  event.preventDefault();

  // 选中当前行
  const key = record[getKeyName()];
  emit("update:selectedKeys", [key]);

  // 设置菜单位置和显示
  state.contextMenuPosition = {
    x: event.clientX,
    y: event.clientY,
  };
  state.contextMenuRecord = record;
  state.contextMenuVisible = true;
};

// 关闭右键菜单
const closeContextMenu = () => {
  state.contextMenuVisible = false;
};

// 监听全局点击关闭菜单
const handleGlobalClick = () => closeContextMenu();
const handleGlobalContextMenu = (e) => {
  if (!e.target.closest(".arco-table-tr")) {
    closeContextMenu();
  }
};

onMounted(() => {
  window.addEventListener("click", handleGlobalClick);
  window.addEventListener("contextmenu", handleGlobalContextMenu);
});

onUnmounted(() => {
  window.removeEventListener("click", handleGlobalClick);
  window.removeEventListener("contextmenu", handleGlobalContextMenu);
});

// 获取右键菜单可用的操作
const contextMenuActions = computed(() => {
  return (props.config.actions || []).filter(
    (action) => action.showInContextMenu !== false
  );
});

// 是否需要选择数据默认为true
const isNeedSelect = (action) => {
  return action.needSelect !== void 0 ? action.needSelect : true;
};

// 操作按钮点击（传递选中的行数组）
const handleActionClick = (action) => {
  // 获取选中行对应的记录 - 从完整数据中查找
  const sourceData = props.data;

  const selectedRecords = props.selectedKeys
    .map((key) => sourceData.find((item) => item[getKeyName()] === key))
    .filter(Boolean);

  let needSelect = isNeedSelect(action);
  if (selectedRecords.length === 0 && needSelect) {
    Message.warning("请先选择数据");
    return;
  }

  // 编辑操作特殊处理
  if (action.key === "edit" && needSelect) {
    if (selectedRecords.length === 1) {
      // 单条记录直接打开编辑表单
      openEditForm(selectedRecords[0]);
    } else {
      // 多条记录显示选择弹窗
      showSelectListModal(selectedRecords, "edit");
    }
    return;
  }

  // 查看操作特殊处理
  if (action.key === "view" && needSelect) {
    if (selectedRecords.length === 1) {
      // 单条记录直接打开只读表单
      openViewForm(selectedRecords[0]);
    } else {
      // 多条记录显示选择弹窗
      showSelectListModal(selectedRecords, "view");
    }
    return;
  }

  if (action.type === "confirm") {
    if (needSelect) {
      Modal.confirm({
        title: "确认操作",
        content:
          action.confirmMessage ||
          `确定要对 ${selectedRecords.length} 条数据执行此操作吗？`,
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          executeAction(action, selectedRecords);
        },
      });
    } else {
      Modal.confirm({
        title: "确认操作",
        content: action.confirmMessage || `确定要执行此操作吗？`,
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          executeAction(action, selectedRecords);
        },
      });
    }
  } else {
    executeAction(action, selectedRecords);
  }
};
// 执行callback回调
const executeAction = async (action, records) => {
  if (props.config.executeAction) {
    let params = records;
    if (action.params) {
      if (typeof action.params === "function") {
        params = action.params(records);
      } else {
        params = action.params;
      }
    }
    let config = {};
    try {
      config = JSON.parse(JSON.stringify(props.config));
    } catch (error) {
      console.error("配置解析错误:", error);
      return;
    }
    try {
      await props.config.executeAction(config, action, records, params);
    } catch (error) {
      console.error("操作执行错误:", error);
      return;
    }
    let isFetchData = action.isFetchData !== void 0 ? action.isFetchData : true;
    let isClearSelect =
      isNeedSelect(action) && action.isClearSelect !== void 0
        ? action.isClearSelect
        : true;
    if (isFetchData) await fetchData();
    if (isClearSelect) emit("update:selectedKeys", []);

    if (action.message) {
      Message.success(action.message);
    }
  }
};

// 列配置弹窗
const handleColumnConfigChange = () => {
  props.config?.handleColumnConfigChange?.({
    visibility: state.columnVisibility,
    order: state.columnOrder,
  });
};

// 上移列
const moveColumnUp = (index) => {
  if (index === 0) return;
  const temp = state.columnConfig[index];
  state.columnConfig[index] = state.columnConfig[index - 1];
  state.columnConfig[index - 1] = temp;
};

// 下移列
const moveColumnDown = (index) => {
  if (index === state.columnConfig.length - 1) return;
  const temp = state.columnConfig[index];
  state.columnConfig[index] = state.columnConfig[index + 1];
  state.columnConfig[index + 1] = temp;
};

const saveColumnConfig = () => {
  handleColumnConfigChange();
  state.visibleColumnModal = false;
  Message.success("列配置已保存");
};
// 监听搜索值变化，实时更新高亮
watch(
  () => state.columnSearchValue,
  (newVal) => {
    if (!newVal) {
      // 搜索框为空时清除高亮
      state.highlightedColumns.clear();
      return;
    }

    // 实时更新高亮
    state.highlightedColumns.clear();
    const matchingIndices = [];
    state.columnConfig.forEach((col, index) => {
      if (col?.title?.toLowerCase()?.includes(newVal?.toLowerCase())) {
        state.highlightedColumns.add(col.dataIndex);
        matchingIndices.push(index);
      }
    });

    // 自动滚动到第一个匹配项
    if (matchingIndices.length > 0) {
      setTimeout(() => {
        const container = document.querySelector(".column-config-grid");
        const rows = container?.querySelectorAll(".column-row");
        if (rows && rows[matchingIndices[0]]) {
          rows[matchingIndices[0]].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }, 50);
    }
  }
);

// 初始化
onMounted(() => {
  initializeColumns();
  fetchData();
});
// 打开新增表单
const openCreateForm = () => {
  state.formMode = "create";
  state.formRecord = null;
  state.formVisible = true;
};

// 打开编辑表单
const openEditForm = (record) => {
  state.formMode = "edit";
  state.formRecord = JSON.parse(JSON.stringify(record));
  state.formVisible = true;
};

// 打开只读查看表单
const openViewForm = (record) => {
  state.formMode = "readonly";
  state.formRecord = JSON.parse(JSON.stringify(record));
  state.currentViewRecord = record;
  state.formVisible = true;
};

// 显示多条记录选择列表（通用）
const showSelectListModal = (records, mode = "view") => {
  state.viewListRecords = records;
  state.viewListMode = mode;
  state.viewListVisible = true;
};

// 从列表中选择一条记录进行操作
const selectRecord = (record) => {
  state.viewListVisible = false;

  if (state.viewListMode === "edit") {
    openEditForm(record);
  } else {
    openViewForm(record);
  }
};

// 处理表单提交
const handleFormSubmit = async (formData) => {
  if (props?.config?.handleFormSubmit) {
    await props.config.handleFormSubmit({
      config: JSON.parse(JSON.stringify(props.config)),
      mode: formData.mode,
      data: formData.data,
      record: formData.record,
    });
    await fetchData();
    return;
  }
  // emit("form-submit", {
  //   config: JSON.parse(JSON.stringify(props.config)),
  //   mode: formData.mode,
  //   data: formData.data,
  //   record: formData.record,
  // });
};

// 表单提交成功
const handleFormSuccess = (data) => {
  Message.success(state.formMode === "create" ? "新增成功" : "修改成功");
  state.formVisible = false;
  // 刷新表格数据
  if (props.config.paginationType === "backend") {
    fetchData();
  }
};

// 弹窗状态变化
const formModalChangeVisible = (val) => {
  state.formVisible = val;
};

// 检查字段是否禁用
const isDisabled = (field) => {
  if (!field) return false;
  const disabled = field.disabled;
  if (typeof disabled === "function") {
    return disabled(field);
  }
  return disabled === true;
};
const getPrepend = (field) => {
  if (field.condition === "lt") {
    return "<";
  }
  if (field.condition === "le") {
    return "<=";
  } else if (field.condition === "gt") {
    return ">";
  } else if (field.condition === "ge") {
    return ">=";
  } else {
    return "";
  }
};
defineExpose({
  fetchData,
  closeForm: () => tableFormRef.value?.closeForm?.(),
  getFormData: () => tableFormRef.value?.getFormData?.(),
  // 提交表单
  handleSubmit: () => tableFormRef.value?.handleSubmit?.(),
  // 初始化表单数据
  initializeFormData: () => tableFormRef.value?.initializeFormData?.(),
  // 初始化表格列配置
  initializeColumns: () => initializeColumns(),
});
</script>

<template>
  <div
    :class="
      isFormItem
        ? 'bk-supertable arco-table-container-form-item'
        : 'bk-supertable arco-table-container'
    "
  >
    <!-- 操作工具栏 -->
    <div class="table-toolbar" style="margin-bottom: 10px">
      <!-- 左侧：操作按钮 -->
      <div class="action-area">
        <span style="font-weight: 700; font-size: 1rem" v-if="!!config.cnDesc">{{
          config.cnDesc || ""
        }}</span>
        <!-- 新增按钮 -->
        <a-button
          v-if="config.showForm"
          type="outline"
          @click="openCreateForm"
          style="margin-right: 8px"
          :size="config.tableSize || 'small'"
          :disabled="props.tableDisabled"
        >
          + 新增
        </a-button>

        <!-- 操作按钮 -->
        <a-button-group v-if="config.actions && config.actions.length > 0">
          <a-button
            v-for="action in config.actions"
            :key="action.key"
            :type="
              action.type === 'confirm'
                ? 'outline'
                : action.type
                ? action.type
                : 'secondary'
            "
            :status="action.status"
            :disabled="
              (props.selectedKeys.length === 0 || props.tableDisabled) &&
              isNeedSelect(action)
            "
            :size="config.tableSize || 'small'"
            @click="handleActionClick(action)"
            style="margin-right: 8px"
            v-bind="action.attrs || {}"
            v-on="action.attrs || {}"
          >
            {{ action.label }}
          </a-button>
        </a-button-group>
        <slot name="actions-left" :size="config.tableSize || 'small'" />
      </div>

      <!-- 右侧：搜索、列配置和导出按钮 -->
      <div class="tools-area">
        <a-button
          v-if="config.searchFields"
          type="outline"
          @click="fetchData"
          :size="config.tableSize || 'small'"
        >
          <icon-refresh :spin="loading" />
        </a-button>

        <!-- 搜索按钮 🔍 -->
        <a-button
          v-if="
            config.searchFields && config.searchFields.length > 0 && !config.showSearchBar
          "
          type="outline"
          @click="state.visibleSearchBar = !state.visibleSearchBar"
          :size="config.tableSize || 'small'"
        >
          <IconSearch />
        </a-button>

        <!-- 列配置按钮 -->
        <a-button
          v-if="config.showColumnConfig"
          type="outline"
          @click="state.visibleColumnModal = true"
          :size="config.tableSize || 'small'"
        >
          <IconSettings />
        </a-button>

        <a-button
          type="outline"
          @click="visibleTableInfo = true"
          :size="config.tableSize || 'small'"
        >
          <icon-info-circle />
        </a-button>

        <slot name="actions-right" :size="config.tableSize || 'small'" />
      </div>
    </div>

    <!-- 搜索条件展开区域 -->
    <div
      v-if="
        (config.searchFields && state.visibleSearchBar) ||
        (config.searchFields && config.showSearchBar === true)
      "
      class="search-bar-expanded"
      style="margin-bottom: 10px"
    >
      <div class="search-wrapper">
        <div class="search-area">
          <!-- 搜索字段 -->
          <div
            v-for="field in config.searchFields"
            :key="field.dataIndex"
            class="search-item"
          >
            <!-- 搜索字段标签 -->
            <span class="search-label">{{ field.title }}:</span>

            <!-- 输入框搜索 -->
            <template v-if="!field.type || field.type === 'input'">
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

            <!-- slot -->
            <template v-if="field.type === 'slot' && field.slotName">
              <slot
                :name="field.slotName"
                :field="field"
                :state="state"
                :config="config"
                :handleSearch="handleSearch"
              >
                <div style="color: red">请提供 {{ field.slotName }} 插槽</div>
              </slot>
            </template>

            <!-- 数字输入框搜索 -->
            <template v-else-if="field.type === 'number'">
              <a-input-number
                :prepend="getPrepend(field)"
                v-model="state.searchValues[field.dataIndex]"
                :placeholder="field.placeholder || `搜索${field.title}`"
                allow-clear
                :size="config.tableSize || 'small'"
                @change="handleSearch"
                v-bind="field.attrs || {}"
                v-on="field.attrs || {}"
              />
            </template>

            <!-- 下拉框搜索 -->
            <template v-else-if="field.type === 'select'">
              <a-select
                v-model="state.searchValues[field.dataIndex]"
                :placeholder="field.placeholder || `选择${field.title}`"
                :options="getSearchOptions(field)"
                allow-clear
                allow-search
                :size="config.tableSize || 'small'"
                @change="handleSearch"
                v-bind="field.attrs || {}"
                v-on="field.attrs || {}"
              />
            </template>

            <!-- 单选框搜索 -->
            <template v-else-if="field.type === 'radio'">
              <a-radio-group
                type="button"
                v-model="state.searchValues[field.dataIndex]"
                :options="getSearchOptions(field)"
                :size="config.tableSize || 'small'"
                @change="handleSearch"
                v-bind="field.attrs || {}"
                v-on="field.attrs || {}"
              />
            </template>

            <!-- 复选框搜索 -->
            <template v-else-if="field.type === 'checkbox'">
              <a-checkbox-group
                v-model="state.searchValues[field.dataIndex]"
                :options="getSearchOptions(field)"
                :size="config.tableSize || 'small'"
                @change="handleSearch"
                v-bind="field.attrs || {}"
                v-on="field.attrs || {}"
              />
            </template>

            <!-- 日期选择搜索 -->
            <template v-else-if="field.type === 'date'">
              <a-date-picker
                v-model="state.searchValues[field.dataIndex]"
                :placeholder="field.placeholder || `选择${field.title}`"
                :size="config.tableSize || 'small'"
                @change="handleSearch"
                v-bind="field.attrs || {}"
                v-on="field.attrs || {}"
              />
            </template>

            <!-- 日期范围搜索 -->
            <template v-else-if="field.type === 'date-range'">
              <a-range-picker
                v-model="state.searchValues[field.dataIndex]"
                :placeholder="
                  field.placeholder
                    ? [field.placeholder, field.placeholder]
                    : [`${field.title}开始`, `${field.title}结束`]
                "
                value-format="YYYY-MM-DD HH:mm:ss"
                :size="config.tableSize || 'small'"
                @change="handleSearch"
                v-bind="field.attrs || {}"
                v-on="field.attrs || {}"
              />
            </template>

            <!-- 开关搜索 -->
            <template v-else-if="field.type === 'switch'">
              <a-switch
                v-model="state.searchValues[field.dataIndex]"
                :size="config.tableSize || 'small'"
                @change="handleSearch"
                v-bind="field.attrs || {}"
                v-on="field.attrs || {}"
              />
            </template>
          </div>
          <div class="search-buttons">
            <a-button
              :size="config.tableSize || 'small'"
              type="outline"
              @click="handleSearch"
            >
              搜索
            </a-button>
            <a-button
              type="outline"
              :size="config.tableSize || 'small'"
              @click="handleResetSearch"
            >
              重置
            </a-button>
            <a-button
              v-if="config.showSearchBar !== true"
              type="outline"
              :size="config.tableSize || 'small'"
              @click="() => (state.visibleSearchBar = false)"
            >
              关闭
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 表格上方插槽 -->
    <slot name="table-top" />

    <!-- 表格 -->
    <a-table
      :columns="visibleColumns"
      :data="tableData"
      :bordered="config.bordered !== false ? config.bordered : { cell: true }"
      :hoverable="config.hoverable !== false"
      :size="config.tableSize || 'large'"
      :row-key="getKeyName()"
      :row-selection="
        config.selection !== false
          ? { type: 'checkbox', showCheckedAll: true, width: 40, fixed: true }
          : undefined
      "
      :selected-keys="props.selectedKeys"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      @row-contextmenu="handleRowContextMenu"
      :scroll="config.scroll || { x: 1200 }"
      :pagination="false"
      :loading="loading"
      :column-resizable="config.columnResizable !== false"
      :stripe="config.stripe !== false"
      :show-header="config.showHeader !== false"
      v-bind="config.tableAttrs || {}"
      v-on="config.tableAttrs || {}"
      :style="{
        '--color-fill-1': config.hoverColor || '#F2F3F5',
        '--hover-font-color': config.hoverFontColor || 'rgb(var(--gray-10))',
        '--header-bg-color': config.headerBgColor || 'var(--color-neutral-2)',
        '--header-font-color': config.headerFontColor || 'rgb(var(--gray-10))',
      }"
    >
      <!-- 状态列插槽 -->
      <template #status-cell="{ record, column }">
        <a-tag
          :color="
            visibleColumns.find((c) => c.dataIndex === column.dataIndex)?.statusMap?.[
              record[column.dataIndex]
            ]?.color || 'blue'
          "
        >
          {{
            visibleColumns.find((c) => c.dataIndex === column.dataIndex)?.statusMap?.[
              record[column.dataIndex]
            ]?.label || record.status
          }}
        </a-tag>
      </template>
      <!-- 序号列 -->
      <template #_rowIndex-cell="{ rowIndex }">
        <span>{{ rowIndex + 1 }}</span>
      </template>
      <!-- 操作列 -->
      <template #operations-cell="{ record }" v-if="config.showForm">
        <a-button-group size="small">
          <a-button
            type="text"
            status="success"
            :disabled="props.tableDisabled"
            @click="openEditForm(record)"
            >编辑</a-button
          >
        </a-button-group>
      </template>
    </a-table>

    <!-- 表格下方插槽 -->
    <slot name="table-bottom" />

    <!-- 分页 -->
    <div v-if="config.paginationType !== 'none'" class="table-pagination">
      <span>共 {{ totalCount }} 条数据，已选择 {{ props.selectedKeys.length }} 条</span>
      <a-pagination
        :current="state.currentPage"
        :page-size="state.pageSize"
        :total="totalCount"
        :page-size-options="config.pageSizeOptions || [10, 20, 50, 100]"
        show-total
        show-page-size
        @change="handlePageChange"
        @page-size-change="handlePageSizeChange"
        :hide-on-single-page="true"
        v-bind="config.tablePaginationAttrs || {}"
        v-on="config.tablePaginationAttrs || {}"
      />
    </div>

    <!-- 列配置弹窗 -->
    <a-modal
      v-model:visible="state.visibleColumnModal"
      title="表格列配置"
      @ok="saveColumnConfig"
      width="800px"
    >
      <!-- 搜索框 -->
      <div
        style="
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          gap: 8px;
        "
      >
        <a-input-search
          v-model="state.columnSearchValue"
          placeholder="搜索列名..."
          allow-clear
          style="flex: 1; max-width: 300px"
        />
        <a-button type="secondary" @click="handleResetColumnConfig">配置还原</a-button>
      </div>

      <div class="column-config-grid">
        <!-- 表头 -->
        <div class="column-header">
          <div class="col-name">列名</div>
          <div class="col-visibility">显示</div>
          <div class="col-width">宽度 (px)</div>
          <div class="col-fixed">固定</div>
          <div class="col-ellipsis">超长省略</div>
          <div class="col-actions">操作</div>
        </div>

        <!-- 列项 -->
        <div
          v-for="(col, index) in state.columnConfig"
          :key="col.dataIndex"
          class="column-row"
        >
          <div
            class="col-name"
            :class="{
              'col-name-highlighted': state.highlightedColumns.has(col.dataIndex),
            }"
            :title="col.title"
          >
            {{ col.title }}
          </div>
          <div class="col-visibility">
            <a-checkbox v-model="state.columnVisibility[col.dataIndex]" />
          </div>
          <div class="col-width">
            <a-input-number
              v-model="col.width"
              placeholder="宽度"
              :min="50"
              :max="500"
              hide-button
            />
          </div>
          <div class="col-fixed">
            <a-select v-model="col.fixed" :style="{ width: '90px' }">
              <a-option :value="false">不固定</a-option>
              <a-option value="left">左固定</a-option>
              <a-option value="right">右固定</a-option>
            </a-select>
          </div>
          <div class="col-ellipsis">
            <a-checkbox v-model="col.ellipsis" />
          </div>
          <div class="col-actions">
            <a-button-group size="small">
              <a-button
                type="text"
                status="normal"
                :disabled="index === 0"
                @click="moveColumnUp(index)"
                title="上移"
              >
                ↑
              </a-button>
              <a-button
                type="text"
                status="normal"
                :disabled="index === state.columnConfig.length - 1"
                @click="moveColumnDown(index)"
                title="下移"
              >
                ↓
              </a-button>
            </a-button-group>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 多条记录选择弹窗 -->
    <a-modal
      :visible="state.viewListVisible"
      :title="state.viewListMode === 'edit' ? '选择要编辑的记录' : '选择要查看的记录'"
      @update:visible="(val) => (state.viewListVisible = val)"
      :ok-text="null"
      :cancel-text="null"
      hide-cancel
      width="600"
    >
      <a-list :data="state.viewListRecords" bordered hoverable>
        <template #item="{ item, index }">
          <a-list-item>
            <template #extra>
              <a-button
                type="outline"
                :size="config.tableSize || 'small'"
                @click="selectRecord(item)"
              >
                {{ state.viewListMode === "edit" ? "编辑" : "查看" }}
              </a-button>
            </template>
            <a-list-item-meta :title="`记录 ${index + 1}`">
              <template #description>
                <div style="display: flex; gap: 16px; flex-wrap: wrap">
                  <template
                    v-for="field in config.columns.slice(0, 3)"
                    :key="field.dataIndex"
                  >
                    <span v-if="item[field.dataIndex]">
                      <strong>{{ field.title }}:</strong>
                      {{ item[field.dataIndex] }}
                    </span>
                  </template>
                </div>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-modal>

    <!-- 表单弹窗 -->
    <TableForm
      :ref="(ref) => (tableFormRef = ref)"
      v-if="config.showForm"
      :visible="state.formVisible"
      :modalWidth="config.modalWidth"
      :mode="state.formMode"
      :formLayout="config.formLayout || 'horizontal'"
      :formColumns="config.formColumns || 3"
      :formColGap="config.formColGap || 10"
      :formRowGap="config.formRowGap || 10"
      :record="state.formRecord"
      :columns="config.columns"
      :config="config"
      :selected-keys="readonly(props.selectedKeys)"
      @update:visible="formModalChangeVisible"
      @update:selected-keys="(val) => emit('update:selectedKeys', val)"
      @submit="handleFormSubmit"
      @success="handleFormSuccess"
    >
      <template v-for="fm in visibleColumns" #[fm?.form?.slotName]="slotProps">
        <slot
          :name="fm?.form?.slotName"
          v-bind="slotProps"
          v-if="fm?.form?.slotName"
        ></slot>
      </template>
    </TableForm>

    <TableInfo v-model:visible="visibleTableInfo" :config="config" />

    <!-- 右键菜单 -->
    <div
      v-show="state.contextMenuVisible"
      class="context-menu"
      :style="{
        left: state.contextMenuPosition.x + 'px',
        top: state.contextMenuPosition.y + 'px',
      }"
      @click.stop="closeContextMenu"
      @contextmenu.prevent
    >
      <div v-if="contextMenuActions.length === 0" class="context-menu-empty">
        暂无操作
      </div>
      <div
        v-else
        v-for="action in contextMenuActions"
        :key="action.key"
        class="context-menu-item"
        :class="{ disabled: isDisabled(action) }"
        @click="!isDisabled(action) && handleActionClick(action)"
      >
        {{ action.label }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.context-menu {
  position: fixed;
  z-index: 9999;
  background: #fff;
  border: 1px solid #eee;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  padding: 4px 0;
  min-width: 100px;
}

.context-menu-item {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 13px;
  color: #333;
  transition: all 0.2s;
}

.context-menu-item:hover {
  background-color: #f5f7fa;
  color: rgb(var(--primary-6));
}

.context-menu-item.disabled {
  color: #c9cdd4;
  cursor: not-allowed;
  background-color: transparent;
}

.context-menu-empty {
  padding: 8px 16px;
  color: #999;
  font-size: 12px;
  text-align: center;
}

.arco-table-container {
  padding: 16px;
  background: #fff;
  border-radius: 4px;
}
.arco-table-container-form-item {
  /* padding: 16px; */
  background: #fff;
  border-radius: 4px;
  width: 100%;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.search-bar-expanded {
  padding: 12px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-area {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
  align-items: end;
}

.search-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 220px;
  align-items: flex-start;
}

.search-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.search-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
}

.action-area {
  display: flex;
  gap: 8px;
  align-items: center;
}

.tools-area {
  display: flex;
  gap: 8px;
  align-items: center;
}

.operations {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.table-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.column-config-grid {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}

.column-header {
  display: grid;
  grid-template-columns: 2fr 0.8fr 1.2fr 1.2fr 0.8fr 0.8fr;
  gap: 12px;
  padding: 8px;
  background: #fafafa;
  border-bottom: 2px solid #f0f0f0;
  font-weight: bold !important;
  position: sticky;
  top: 0;
  z-index: 10;
}

.column-header > div {
  font-weight: bold !important;
  font-size: 14px !important;
}

.column-row {
  display: grid;
  grid-template-columns: 2fr 0.8fr 1.2fr 1.2fr 0.8fr 0.8fr;
  gap: 12px;
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.column-row:hover {
  background: #fafafa;
}

.column-row:last-child {
  border-bottom: none;
}

.col-name {
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col-name-highlighted {
  color: red;
  font-weight: bold;
}

.col-visibility {
  display: flex;
  justify-content: center;
  align-items: center;
}

.col-width {
  display: flex;
  align-items: center;
}

.col-actions {
  display: flex;
  justify-content: center;
  align-items: center;
}

.bk-supertable :deep(.arco-table-th) {
  font-weight: 700;
  /* color: #7f70a0; */
  /* background-color: #eef5f8; */
  background-color: var(--header-bg-color);
  color: var(--header-font-color);
}

.bk-supertable :deep(.arco-table-tr:hover .arco-table-td) {
  color: var(--hover-font-color) !important;
}
</style>
