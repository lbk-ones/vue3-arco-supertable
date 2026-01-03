# 表格配置项完整指南 (Table Config)

## 概述

表格组件通过 `config` prop 接收配置对象，支持灵活的定制选项。以下是所有支持的配置项详解。

## 配置项列表

### 基础配置

#### `columns` (必填)
- **类型**: `Array<ColumnConfig>`
- **说明**: 表格列的配置数组
- **示例**:
  ```javascript
  columns: [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
      visible: true,
      form: { type: 'input', required: true }
    }
  ]
  ```

#### `data` (通过 prop 传入)
- **类型**: `Array`
- **说明**: 表格数据，通过组件 prop 传入而非 config
- **示例**:
  ```vue
  <ArcoTable :config="tableConfig" :data="tableData" />
  ```

#### `paginationType`
- **类型**: `'frontend' | 'backend'`
- **默认值**: `'frontend'`
- **说明**: 分页类型
  - `'frontend'`: 前端分页，所有数据加载到前端
  - `'backend'`: 后端分页，按需请求数据
- **示例**:
  ```javascript
  paginationType: 'frontend'
  ```

#### `pageSize`
- **类型**: `Number`
- **默认值**: `10`
- **说明**: 每页显示的数据条数
- **示例**:
  ```javascript
  pageSize: 20
  ```

#### `pageSizeOptions`
- **类型**: `Array<Number>`
- **默认值**: `[10, 20, 50, 100]`
- **说明**: 分页大小选项
- **示例**:
  ```javascript
  pageSizeOptions: [5, 10, 20, 50, 100]
  ```

---

### 搜索配置

#### `searchFields`
- **类型**: `Array<SearchField>`
- **默认值**: `[]`
- **说明**: 搜索字段配置，支持多种控件类型
- **示例**:
  ```javascript
  searchFields: [
    {
      dataIndex: 'name',
      title: '姓名',
      type: 'input',
      placeholder: '搜索姓名',
      attrs: { 'max-length': 50 }
    },
    {
      dataIndex: 'department',
      title: '部门',
      type: 'select',
      options: [
        { label: '技术部', value: 'tech' }
      ]
    }
  ]
  ```
- **相关文档**: 详见 [SEARCH_CONFIG.md](./SEARCH_CONFIG.md)

---

### 操作配置

#### `actions`
- **类型**: `Array<ActionConfig>`
- **默认值**: `[]`
- **说明**: 操作按钮配置，支持批量操作
- **示例**:
  ```javascript
  actions: [
    {
      key: 'edit',
      label: '编辑',
      icon: 'edit',
      // 编辑操作会自动打开编辑表单（在 Table 中特殊处理）
    },
    {
      key: 'delete',
      label: '删除',
      status: 'danger',
      type: 'confirm',
      confirmMessage: '确定删除吗？',
      apiUrl: '/api/delete',
      params: (records) => ({ ids: records.map(r => r.key) })
    }
  ]
  ```

---

### 表单配置

#### `showForm`
- **类型**: `Boolean`
- **默认值**: `true`
- **说明**: 是否显示新增/编辑表单功能
- **示例**:
  ```javascript
  showForm: true
  ```

---

### 列配置

#### `showColumnConfig`
- **类型**: `Boolean`
- **默认值**: `true`
- **说明**: 是否显示列配置按钮（可调整列显示/隐藏、宽度、顺序）
- **示例**:
  ```javascript
  showColumnConfig: true
  ```

---

### 后端分页配置

#### `apiUrl`
- **类型**: `String`
- **默认值**: `undefined`
- **说明**: 后端分页接口 URL，仅在 `paginationType === 'backend'` 时有效
- **示例**:
  ```javascript
  apiUrl: '/api/employee/list'
  ```

---

### 表格行配置

#### `rowKey`
- **类型**: `String`
- **默认值**: `'key'`
- **说明**: 表格行的唯一标识字段名，用于行选择、排序等功能
- **示例**:
  ```javascript
  rowKey: 'key'    // 使用 key 字段作为行唯一标识
  rowKey: 'id'     // 或使用 id 字段
  rowKey: 'uuid'   // 或使用 uuid 字段
  ```
- **重要**: 确保 `rowKey` 指向的字段在每一行数据中都是唯一的

---

### 表格样式配置

#### `tableSize`
- **类型**: `'small' | 'medium' | 'large'`
- **默认值**: `'large'`
- **说明**: 表格行高大小
- **示例**:
  ```javascript
  tableSize: 'small'  // 紧凑
  // tableSize: 'medium' // 中等
  // tableSize: 'large'  // 宽松
  ```

#### `bordered`
- **类型**: `Boolean | Object`
- **默认值**: `{ cell: true }`
- **说明**: 表格边框配置
  - `false`: 无边框
  - `true`: 仅显示外框
  - `{ cell: true }`: 显示所有单元格边框
- **示例**:
  ```javascript
  bordered: { cell: true }  // 完整网格
  // bordered: true          // 仅外框
  // bordered: false         // 无边框
  ```

#### `hoverable`
- **类型**: `Boolean`
- **默认值**: `true`
- **说明**: 行悬停时是否显示高亮效果
- **示例**:
  ```javascript
  hoverable: true
  ```

#### `columnResizable`
- **类型**: `Boolean`
- **默认值**: `true`
- **说明**: 列宽是否可通过拖拽调整
- **示例**:
  ```javascript
  columnResizable: true
  ```

#### `stripe`
- **类型**: `Boolean`
- **默认值**: `true`
- **说明**: 是否显示斑马纹（交替行背景色）
- **示例**:
  ```javascript
  stripe: true
  ```

#### `scroll`
- **类型**: `Object`
- **默认值**: `{ x: 1200 }`
- **说明**: 表格滚动配置
  - `x`: 水平滚动宽度
  - `y`: 垂直滚动高度
- **示例**:
  ```javascript
  scroll: {
    x: 1200,
    y: 'calc(100vh - 392px)'
  }
  ```

#### `selection`
- **类型**: `Boolean`
- **默认值**: `true`
- **说明**: 是否显示行选择列（复选框）
- **示例**:
  ```javascript
  selection: true
  ```

---

## 完整配置示例

```javascript
import { reactive } from 'vue';

const tableConfig = reactive({
  // === 基础配置 ===
  columns: [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
      visible: true,
      form: {
        type: 'input',
        required: true,
        creatable: true,
        editable: true
      }
    },
    {
      title: '部门',
      dataIndex: 'department',
      width: 120,
      form: {
        type: 'select',
        options: [
          { label: '技术部', value: 'tech' },
          { label: '销售部', value: 'sales' }
        ]
      }
    }
  ],

  // === 搜索配置 ===
  searchFields: [
    {
      dataIndex: 'name',
      title: '姓名',
      type: 'input',
      attrs: { 'max-length': 50 }
    },
    {
      dataIndex: 'department',
      title: '部门',
      type: 'select',
      options: [
        { label: '技术部', value: 'tech' },
        { label: '销售部', value: 'sales' }
      ]
    }
  ],

  // === 分页配置 ===
  paginationType: 'frontend',
  pageSize: 10,
  pageSizeOptions: [5, 10, 20, 50, 100],

  // === 操作配置 ===
  actions: [
    {
      key: 'edit',
      label: '编辑',
      icon: 'edit'
    },
    {
      key: 'delete',
      label: '删除',
      status: 'danger',
      type: 'confirm',
      confirmMessage: '确定删除吗？'
    }
  ],

  // === 表单配置 ===
  showForm: true,

  // === 列配置 ===
  showColumnConfig: true,

  // === 表格行配置 ===
  rowKey: 'key',

  // === 表格样式 ===
  tableSize: 'small',
  bordered: { cell: true },
  hoverable: true,
  columnResizable: true,
  stripe: true,
  scroll: { x: 1200, y: 'calc(100vh - 392px)' },
  selection: true
});
```

---

## 配置项对应表

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|-------|------|
| columns | Array | - | 列配置（必填） |
| searchFields | Array | [] | 搜索字段 |
| paginationType | String | 'frontend' | 分页类型 |
| pageSize | Number | 10 | 每页数量 |
| pageSizeOptions | Array | [10,20,50,100] | 分页选项 |
| actions | Array | [] | 操作按钮 |
| showForm | Boolean | true | 显示表单 |
| showColumnConfig | Boolean | true | 显示列配置 |
| apiUrl | String | - | 后端接口 |
| rowKey | String | 'key' | 行唯一标识字段名 |
| tableSize | String | 'large' | 表格大小 |
| bordered | Boolean/Object | {cell:true} | 边框配置 |
| hoverable | Boolean | true | 行悬停效果 |
| columnResizable | Boolean | true | 列宽可调 |
| stripe | Boolean | true | 斑马纹 |
| scroll | Object | {x:1200} | 滚动配置 |
| selection | Boolean | true | 行选择 |

---

## 最佳实践

### 1. 响应式配置
使用 `reactive` 包装配置对象，以便动态修改：

```javascript
const tableConfig = reactive({
  tableSize: 'large',
  bordered: true,
  // ...
});

// 运行时修改
const changeTableSize = () => {
  tableConfig.tableSize = 'small';
};
```

### 2. 按需配置
只配置需要的项，其他使用默认值：

```javascript
// ✓ 简洁
const config = {
  columns: myColumns,
  // 其他使用默认值
};

// ✗ 冗余
const config = {
  columns: myColumns,
  paginationType: 'frontend',
  pageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
  // ...所有项都写上
};
```

### 3. 条件配置
根据不同场景使用不同配置：

```javascript
const getTableConfig = (type) => {
  const baseConfig = {
    columns: myColumns,
    showForm: true,
    showColumnConfig: true
  };

  if (type === 'simple') {
    // 简化视图
    return {
      ...baseConfig,
      tableSize: 'small',
      bordered: true,
      selection: false,
      showColumnConfig: false
    };
  }

  // 完整视图
  return {
    ...baseConfig,
    tableSize: 'large',
    bordered: { cell: true },
    columnResizable: true
  };
};
```

### 4. 搜索和操作的协调
合理配置搜索字段和操作按钮：

```javascript
const config = {
  columns: [...],
  
  // 常用搜索条件
  searchFields: [
    { dataIndex: 'name', title: '姓名', type: 'input' },
    { dataIndex: 'status', title: '状态', type: 'select', options: [...] }
  ],
  
  // 对应的操作按钮
  actions: [
    { key: 'view', label: '查看' },
    { key: 'edit', label: '编辑' },
    { key: 'delete', label: '删除', status: 'danger' }
  ]
};
```

---

## 常见问题

**Q: bordered、hoverable 等属性的默认值是什么？**
A: 所有表格样式属性都有智能默认值：
- `bordered`: `{ cell: true }` - 显示完整网格
- `hoverable`: `true` - 启用行悬停
- `columnResizable`: `true` - 启用列宽调整
- `stripe`: `true` - 启用斑马纹

**Q: 如何在表格加载时切换样式？**
A: 在配置中使用响应式数据：
```javascript
const isDarkMode = ref(false);

const config = reactive({
  columns: [...],
  bordered: computed(() => isDarkMode.value ? false : { cell: true }),
  stripe: computed(() => !isDarkMode.value)
});
```

**Q: scroll.y 如何设置自适应高度？**
A: 使用 CSS calc 表达式：
```javascript
scroll: {
  x: 1200,
  y: 'calc(100vh - 392px)'  // 减去顶部和底部高度
}
```

**Q: columnResizable 和列配置的区别？**
A: 
- `columnResizable`: 允许拖拽列边框调整宽度（临时）
- `showColumnConfig`: 打开列配置弹窗，永久修改列显示、宽度、顺序

两者可以同时启用。

**Q: 如何完全禁用列操作？**
A: 
```javascript
config: {
  columns: [...],
  showColumnConfig: false,    // 禁用列配置按钮
  columnResizable: false      // 禁用列宽调整
}
```

**Q: rowKey 是什么？为什么要配置它？**
A: `rowKey` 指定表格行的唯一标识字段。在行选择、排序、虚拟滚动等场景中需要使用行的唯一标识。

```javascript
// 假设你的数据结构如下
const data = [
  { id: 1, name: 'Jane', key: 'row_1' },
  { id: 2, name: 'John', key: 'row_2' },
];

// 如果使用 id 作为唯一标识
config.rowKey = 'id'

// 如果使用 key 作为唯一标识（默认值）
config.rowKey = 'key'
```

**Q: 如果没有正确配置 rowKey 会怎样？**
A: 可能出现以下问题：
- 行选择不准确
- 行高亮效果不正确
- 操作多条数据时识别错误
- 虚拟滚动时出现显示问题

建议：
- 始终确保 `rowKey` 指向的字段在数据中唯一
- 不要使用重复的或动态变化的值
- 最好使用 `id`、`uuid`、`key` 等稳定的标识字段

---

## 相关文档

- [列配置指南](./FORM_CONFIG.md) - columns 详细说明
- [搜索字段指南](./SEARCH_CONFIG.md) - searchFields 详细说明
- [搜索属性示例](./SEARCH_ATTRS_EXAMPLES.md) - attrs 快速参考
- [表单配置指南](./FORM_INTEGRATION.md) - form 配置详解
