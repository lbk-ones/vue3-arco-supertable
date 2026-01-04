<script setup>
import {
  reactive,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
} from "vue";
import { Message, Modal } from "@arco-design/web-vue";
import TableForm from "./TableForm.vue";

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
    //   apiUrl: '/api/list',            // 后端分页接口
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
    // }
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
});

// 初始化列配置
const initializeColumns = () => {
  if (!props.config.columns) return;

  state.columnConfig = JSON.parse(JSON.stringify(props.config.columns));

  // 初始化列可见性和顺序，并为每列添加 slotName
  state.columnConfig.forEach((col, index) => {
    state.columnVisibility[col.dataIndex] = col.visible !== false;
    state.columnOrder.push({
      index,
      dataIndex: col.dataIndex,
      title: col.title,
    });
    // 为每列添加 slotName，用于动态插槽
    if (!col.slotName) {
      col.slotName = `${col.dataIndex}-cell`;
    }
  });
};

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

        const searchField = props.config.searchFields.find(
          (f) => f.dataIndex === field
        );
        const fieldValue = item[field];
        const fieldType = searchField?.type || "input";

        // 根据搜索字段类型处理搜索逻辑
        switch (fieldType) {
          case "checkbox": // 复选框：数组类型，检查是否有交集
            if (Array.isArray(value) && value.length > 0) {
              const itemValue = Array.isArray(fieldValue)
                ? fieldValue
                : [fieldValue];
              return value.some((v) => itemValue.includes(v));
            }
            return true;

          case "date-range": // 日期范围：检查是否在范围内
            if (Array.isArray(value) && value.length === 2) {
              const [startDate, endDate] = value;
              const itemDate = new Date(fieldValue);
              return (
                itemDate >= new Date(startDate) && itemDate <= new Date(endDate)
              );
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
  if (props.config.paginationType !== "backend" || !props.config.apiUrl) return;
  try {
    let data = await props.config?.pageFetchData?.(props.config.apiUrl, {
      pageNo: state.currentPage,
      pageSize: state.pageSize,
      searchValues: state.searchValues,
    });
    emit("update:loading", false);
    let records = data?.records || [];
    emit("update:data", records);
    //state.apiData = records || [];
    state.totalCount = parseInt(data?.total || 0);
  } catch (error) {
    Message.error("数据加载失败");
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

// 操作按钮点击（传递选中的行数组）
const handleActionClick = (action) => {
  // 获取选中行对应的记录 - 从完整数据中查找
  const sourceData = props.data;

  const selectedRecords = props.selectedKeys
    .map((key) => sourceData.find((item) => item[getKeyName()] === key))
    .filter(Boolean);

  if (selectedRecords.length === 0) {
    Message.warning("请先选择数据");
    return;
  }

  // 编辑操作特殊处理
  if (action.key === "edit") {
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
  if (action.key === "view") {
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
    executeAction(action, selectedRecords);
  }
};
// 执行callback回调
const executeAction = async (action, records) => {
  if (props.config.executeAction) {
    let params = action.params && action.params(records);
    await props.config.executeAction(action, records, params);
    await fetchData();
    // emit("action-click", {
    //   actionKey: action.key,
    //   records, // 传递数组
    //   callback: action.callback,
    //   apiUrl: action.apiUrl,
    //   params: action.params,
    // });
    emit("update:selectedKeys", []);
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
      if (col.title.toLowerCase().includes(newVal.toLowerCase())) {
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

defineExpose({
  fetchData,
});
</script>

<template>
  <div
    :class="
      isFormItem ? 'arco-table-container-form-item' : 'arco-table-container'
    "
  >
    <!-- 操作工具栏 -->
    <div class="table-toolbar" style="margin-bottom: 16px">
      <!-- 左侧：操作按钮 -->
      <div class="action-area">
        <!-- 新增按钮 -->
        <a-button
          v-if="config.showForm"
          type="primary"
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
            :type="action.type === 'confirm' ? 'secondary' : 'primary'"
            :status="action.status"
            :disabled="props.selectedKeys.length === 0 || props.tableDisabled"
            :size="config.tableSize || 'small'"
            @click="handleActionClick(action)"
            style="margin-right: 8px"
          >
            {{ action.label }}（{{ props.selectedKeys.length }}）
          </a-button>
        </a-button-group>
      </div>

      <!-- 右侧：搜索、列配置和导出按钮 -->
      <div class="tools-area">
        <icon-refresh class="hover-point" :style="{ fontSize: '20px' }" @click="fetchData" :spin="loading" />
        <!-- 搜索按钮 -->
        <a-button
          v-if="config.searchFields"
          type="secondary"
          @click="state.visibleSearchBar = !state.visibleSearchBar"
          style="margin-right: 8px"
          :size="config.tableSize || 'small'"
        >
          🔍 搜索
        </a-button>

        <!-- 列配置按钮 -->
        <a-button
          v-if="config.showColumnConfig"
          type="secondary"
          @click="state.visibleColumnModal = true"
          style="margin-right: 8px"
          :size="config.tableSize || 'small'"
        >
          列配置
        </a-button>
        <slot name="toolbar" />
      </div>
    </div>

    <!-- 搜索条件展开区域 -->
    <div
      v-if="config.searchFields && state.visibleSearchBar"
      class="search-bar-expanded"
      style="margin-bottom: 16px"
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
                v-bind="field.attrs || {}"
                @search="handleSearch"
              />
            </template>

            <!-- 数字输入框搜索 -->
            <template v-else-if="field.type === 'number'">
              <a-input-number
                v-model="state.searchValues[field.dataIndex]"
                :placeholder="field.placeholder || `搜索${field.title}`"
                allow-clear
                :size="config.tableSize || 'small'"
                v-bind="field.attrs || {}"
                @change="handleSearch"
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
                v-bind="field.attrs || {}"
                @change="handleSearch"
              />
            </template>

            <!-- 单选框搜索 -->
            <template v-else-if="field.type === 'radio'">
              <a-radio-group
                type="button"
                v-model="state.searchValues[field.dataIndex]"
                :options="getSearchOptions(field)"
                :size="config.tableSize || 'small'"
                v-bind="field.attrs || {}"
                @change="handleSearch"
              />
            </template>

            <!-- 复选框搜索 -->
            <template v-else-if="field.type === 'checkbox'">
              <a-checkbox-group
                v-model="state.searchValues[field.dataIndex]"
                :options="getSearchOptions(field)"
                :size="config.tableSize || 'small'"
                v-bind="field.attrs || {}"
                @change="handleSearch"
              />
            </template>

            <!-- 日期选择搜索 -->
            <template v-else-if="field.type === 'date'">
              <a-date-picker
                v-model="state.searchValues[field.dataIndex]"
                :placeholder="field.placeholder || `选择${field.title}`"
                :size="config.tableSize || 'small'"
                v-bind="field.attrs || {}"
                @change="handleSearch"
              />
            </template>

            <!-- 日期范围搜索 -->
            <template v-else-if="field.type === 'date-range'">
              <a-range-picker
                v-model="state.searchValues[field.dataIndex]"
                :placeholder="
                  field.placeholder || [
                    `${field.title}开始日期`,
                    `${field.title}结束日期`,
                  ]
                "
                :size="config.tableSize || 'small'"
                v-bind="field.attrs || {}"
                @change="handleSearch"
              />
            </template>

            <!-- 开关搜索 -->
            <template v-else-if="field.type === 'switch'">
              <a-switch
                v-model="state.searchValues[field.dataIndex]"
                :size="config.tableSize || 'small'"
                v-bind="field.attrs || {}"
                @change="handleSearch"
              />
            </template>
          </div>
        </div>

        <div class="search-buttons">
          <a-button
            :size="config.tableSize || 'small'"
            type="primary"
            @click="handleSearch"
          >
            🔍 搜索
          </a-button>
          <a-button
            :size="config.tableSize || 'small'"
            @click="handleResetSearch"
          >
            重置
          </a-button>
        </div>
      </div>
    </div>

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
      @update:selected-keys="(keys) => emit('update:selectedKeys', keys)"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      :scroll="config.scroll || { x: 1200 }"
      :pagination="false"
      :loading="loading"
      :column-resizable="config.columnResizable !== false"
      :stripe="config.stripe !== false"
    >
      <!-- 状态列插槽 -->
      <template #status-cell="{ record }">
        <a-tag
          :color="
            visibleColumns.find((c) => c.dataIndex === 'status')?.statusMap?.[
              record.status
            ]?.color || 'blue'
          "
        >
          {{
            visibleColumns.find((c) => c.dataIndex === "status")?.statusMap?.[
              record.status
            ]?.label || record.status
          }}
        </a-tag>
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

    <!-- 分页 -->
    <div v-if="config.paginationType !== 'none'" class="table-pagination">
      <span
        >共 {{ totalCount }} 条数据，已选择
        {{ props.selectedKeys.length }} 条</span
      >
      <a-pagination
        :current="state.currentPage"
        :page-size="state.pageSize"
        :total="totalCount"
        :page-size-options="config.pageSizeOptions || [10, 20, 50, 100]"
        show-total
        show-page-size
        @change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </div>

    <!-- 列配置弹窗 -->
    <a-modal
      v-model:visible="state.visibleColumnModal"
      title="表格列配置"
      @ok="saveColumnConfig"
      width="700px"
    >
      <!-- 搜索框 -->
      <div style="margin-bottom: 16px; display: flex; gap: 8px">
        <a-input-search
          v-model="state.columnSearchValue"
          placeholder="搜索列名..."
          allow-clear
          style="flex: 1; max-width: 300px"
        />
      </div>

      <div class="column-config-grid">
        <!-- 表头 -->
        <div class="column-header">
          <div class="col-name">列名</div>
          <div class="col-visibility">显示</div>
          <div class="col-width">宽度 (px)</div>
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
              'col-name-highlighted': state.highlightedColumns.has(
                col.dataIndex
              ),
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
      :title="
        state.viewListMode === 'edit' ? '选择要编辑的记录' : '选择要查看的记录'
      "
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
              <a-button type="primary" size="small" @click="selectRecord(item)">
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
      v-if="config.showForm"
      :visible="state.formVisible"
      :modalWidth="state.modalWidth"
      :mode="state.formMode"
      formLayout="horizontal"
      :record="state.formRecord"
      :columns="config.columns"
      :config="config"
      :selected-keys="props.selectedKeys"
      @update:visible="formModalChangeVisible"
      @update:selected-keys="(val) => emit('update:selectedKeys', val)"
      @submit="handleFormSubmit"
      @success="handleFormSuccess"
    />
  </div>
</template>

<style scoped>
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
  grid-template-columns: 2fr 1fr 1.5fr 0.8fr;
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
  grid-template-columns: 2fr 1fr 1.5fr 0.8fr;
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
</style>
