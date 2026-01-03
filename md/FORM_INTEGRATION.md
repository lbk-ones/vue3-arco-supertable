# Form组件集成完全指南

## 📋 概述

本项目实现了一个完整的 **Vue 3 + Arco Design** 通用表单系统，与表格组件无缝集成。提供了自动化的表单生成、验证和数据提交功能。

---

## 🏗️ 核心组件架构

### 1. Table.vue - 主表格组件

主要职责：表格展示、搜索、分页、与表单组件的集成。

**关键特性：**
- 集成了表单功能模块
- 管理新增/编辑模式和数据
- 触发表单提交事件
- 支持选中行管理

**主要方法：**
- `openCreateForm()` - 打开新增表单
- `openEditForm(record)` - 打开编辑表单
- `handleFormSubmit(data)` - 处理表单提交

---

### 2. TableForm.vue - 通用表单组件

独立的表单弹窗组件，支持自动生成和验证。

**关键特性：**
- 根据columns配置自动生成表单字段
- 支持 create/edit/readonly 三种模式
- 完整的验证系统
- 灵活的字段控制（显示、禁用、选项）

**Props：**
```javascript
{
  visible: Boolean,           // 弹窗显示状态
  mode: 'create'|'edit'|'readonly',  // 表单模式
  columns: Array,             // 列配置（包含form信息）
  record: Object,             // 编辑时的原始记录
  modalWidth: Number,         // 弹窗宽度
  formLayout: 'vertical'|'horizontal',  // 表单布局
}
```

---

### 3. TableFormFieldItem.vue - 字段渲染器

负责单个表单字段的渲染和绑定，支持 12 种控件类型。

**职责：**
- 根据字段类型渲染对应的控件
- 处理字段值的绑定和更新
- 显示验证错误信息

---

## 🎯 Form配置详解

### 基本结构

在columns中添加`form`对象：

```javascript
{
  title: '字段标题',
  dataIndex: 'fieldKey',
  form: {
    type: 'input',              // ①控件类型（必填）
    required: true,             // ②必填验证
    creatable: true,            // ③新增时显示
    editable: true,             // ④编辑时显示
    disabled: false,            // ⑤禁用状态
    defaultValue: null,         // ⑥默认值
    placeholder: '提示文字',    // ⑦占位符
    validator: (value) => '',   // ⑧自定义验证
    options: [],                // ⑨选项（选择类）
    attrs: {},                  // ⑩原生属性
  },
}
```

### 配置分类

#### A. 显示控制

```javascript
// ① 控件类型（必填）
type: 'input' | 'textarea' | 'number' | 'select' | 'radio' | 'checkbox' 
    | 'date' | 'time' | 'datetime' | 'switch' | 'slider' | 'table'

// ② 新增/编辑可见性
creatable: true   // 新增模式显示
editable: false   // 编辑模式隐藏
```

#### B. 验证控制

```javascript
required: true,   // 内置必填验证

validator: (value, field, formData) => {
  // 自定义验证逻辑
  if (!value) return '不能为空';
  return ''; // 通过
}
```

#### C. 状态控制

```javascript
// 静态禁用
disabled: true

// 条件禁用（根据其他字段）
disabled: (formData, field) => {
  return formData.department === 'locked';
}
```

#### D. 选项数据

```javascript
// 静态选项
options: [
  { label: '选项1', value: 'val1' },
  { label: '选项2', value: 'val2' },
]

// 动态选项（根据其他字段）
options: (formData, field) => {
  return formData.type === 'A'
    ? [{ label: '选项A1', value: 'a1' }]
    : [{ label: '选项B1', value: 'b1' }];
}
```

#### E. 属性透传

```javascript
// 通过attrs传递Arco组件属性
attrs: {
  'max-length': 50,
  'show-word-limit': true,
  'allow-clear': true,
  'prefix': '$',
  'placeholder': '自定义占位符',
}
```

---

## 📊 工作流程

### 新增数据流程

```
用户点击 "+ 新增" 按钮
    ↓
Table.vue: openCreateForm()
    ↓
设置 state.formMode = 'create'
    ↓
TableForm.vue: mode = 'create'
    ↓
显示 creatable === true 的字段（空值）
    ↓
用户填写表单
    ↓
用户点击"确定"
    ↓
验证所有字段
    ↓
验证通过 → 触发 form-submit 事件
    ↓
{
  mode: 'create',
  data: { /* 填写的数据 */ },
  record: null
}
    ↓
外层处理：调用API新增，更新表格数据
```

### 编辑数据流程

```
用户点击行的 "编辑" 按钮
    ↓
Table.vue: openEditForm(record)
    ↓
设置 state.formMode = 'edit'
    ↓
设置 state.formRecord = record
    ↓
TableForm.vue: mode = 'edit', record = record
    ↓
显示 editable === true 的字段（带原始值）
    ↓
用户修改表单
    ↓
用户点击"确定"
    ↓
验证所有字段
    ↓
验证通过 → 触发 form-submit 事件
    ↓
{
  mode: 'edit',
  data: { /* 修改后的数据 */ },
  record: { /* 原始数据 */ }
}
    ↓
外层处理：调用API更新，刷新表格
```

### 只读模式流程

```
用户点击行的 "查看" 按钮
    ↓
Table.vue: openViewForm(record)
    ↓
设置 state.formMode = 'readonly'
    ↓
TableForm.vue: mode = 'readonly'
    ↓
显示所有字段，所有控件禁用
    ↓
显示记录的详细信息
    ↓
用户点击"关闭"
    ↓
关闭弹窗
```

---

## 💻 集成步骤

### 步骤1：配置columns

```javascript
const tableConfig = reactive({
  columns: [
    {
      title: '用户名',
      dataIndex: 'username',
      width: 150,
      form: {
        type: 'input',
        required: true,
        creatable: true,
        editable: true,
        placeholder: '请输入用户名',
      },
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 120,
      form: {
        type: 'select',
        required: true,
        options: [
          { label: '管理员', value: 'admin' },
          { label: '用户', value: 'user' },
        ],
      },
    },
    {
      title: '是否启用',
      dataIndex: 'enabled',
      form: {
        type: 'switch',
        defaultValue: true,
      },
    },
  ],
  showForm: true,  // ← 启用表单
  paginationType: 'frontend',
});
```

### 步骤2：在template中使用

```vue
<script setup>
import Table from './Table.vue'

const tableConfig = reactive({...})
const tableData = ref([])

const handleFormSubmit = (data) => {
  const { mode, data: formData, record } = data
  
  if (mode === 'create') {
    // 新增逻辑
    tableData.value.push({
      key: Date.now(),
      ...formData
    })
    Message.success('新增成功')
  } else if (mode === 'edit') {
    // 编辑逻辑
    const index = tableData.value.findIndex(
      item => item.key === record.key
    )
    if (index > -1) {
      tableData.value[index] = { ...record, ...formData }
    }
    Message.success('编辑成功')
  }
}
</script>

<template>
  <Table 
    :config="tableConfig"
    :data="tableData"
    @form-submit="handleFormSubmit"
  />
</template>
```

---

## 🔧 高级配置示例

### 级联选择

```javascript
{
  title: '类别',
  dataIndex: 'category',
  form: {
    type: 'select',
    options: [
      { label: '一级', value: '1' },
      { label: '二级', value: '2' },
    ],
  },
},
{
  title: '子类别',
  dataIndex: 'subCategory',
  form: {
    type: 'select',
    options: (formData) => {
      // 根据category返回对应的子类别
      const map = {
        '1': [{ label: '1-1', value: '1-1' }],
        '2': [{ label: '2-1', value: '2-1' }],
      };
      return map[formData.category] || [];
    },
  },
}
```

### 条件字段

```javascript
{
  title: '是否有折扣',
  dataIndex: 'hasDiscount',
  form: {
    type: 'radio',
    options: [
      { label: '有', value: true },
      { label: '没有', value: false },
    ],
  },
},
{
  title: '折扣金额',
  dataIndex: 'discountAmount',
  form: {
    type: 'number',
    // 只在选择"有折扣"时显示
    disabled: (formData) => !formData.hasDiscount,
  },
}
```

### 复杂验证

```javascript
{
  title: '确认密码',
  dataIndex: 'confirmPassword',
  form: {
    type: 'input',
    attrs: { type: 'password' },
    validator: (value, field, formData) => {
      if (!value) return '请确认密码';
      if (value !== formData.password) {
        return '两次输入的密码不一致';
      }
      return '';
    },
  },
}
```

---

## 🚀 自定义扩展

### 添加自定义控件类型

在 `TableFormFieldItem.vue` 中添加新的分支：

```vue
<script setup>
// ... 其他代码

// 添加对自定义控件的支持
const isSupportedType = (type) => {
  return [
    'input', 'textarea', 'number', 'select', 'radio', 'checkbox',
    'date', 'time', 'datetime', 'switch', 'slider', 'table',
    'custom-editor' // 新增类型
  ].includes(type)
}
</script>

<template>
  <!-- ... 其他控件 -->
  
  <!-- 自定义富文本编辑器 -->
  <a-form-item
    v-else-if="field.form.type === 'custom-editor'"
    :field="field.dataIndex"
    :label="field.title"
  >
    <CustomEditor
      :model-value="formData[field.dataIndex]"
      @update:model-value="handleUpdate"
      :disabled="isFieldDisabled(field)"
      v-bind="getFieldAttrs(field)"
    />
  </a-form-item>
</template>
```

### 添加全局钩子

```javascript
// 在 Table.vue 中添加生命周期钩子
const emits = defineEmits([
  'form-before-submit',  // 表单提交前
  'form-after-submit',   // 表单提交后
  'form-submit',
])

const handleFormSubmit = async (data) => {
  // 提交前钩子
  emit('form-before-submit', data)
  
  // 提交逻辑
  // ...
  
  // 提交后钩子
  emit('form-after-submit', data)
}
```

---

## 💡 最佳实践

### 1. 字段设计

✅ **好的实践：**
```javascript
{
  title: '邮箱',
  dataIndex: 'email',
  form: {
    type: 'input',
    required: true,
    placeholder: 'example@domain.com',
    validator: (value) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(value) ? '' : '邮箱格式不正确';
    },
  },
}
```

❌ **应避免：**
```javascript
{
  form: {
    // 没有指定type
    required: '不能为空',  // 应该用validator
    options: {},           // 不是数组或函数
  },
}
```

### 2. 验证策略

```javascript
// 简单必填 → 用 required
required: true

// 复杂验证 → 用 validator
validator: (value) => {
  if (!value) return '不能为空'
  // ... 更多逻辑
  return ''
}

// 多字段验证 → 在提交时处理
const handleFormSubmit = (data) => {
  if (data.startDate > data.endDate) {
    Message.error('开始日期不能晚于结束日期')
    return
  }
  // ... 继续处理
}
```

### 3. 性能优化

```javascript
// 避免在options函数中进行复杂计算
options: (formData) => {
  // ❌ 避免
  return expensiveComputation(formData)
  
  // ✅ 推荐
  const cached = cacheMap[formData.id]
  return cached || []
}
```

---

## 📚 API参考

### Table事件

```javascript
@form-submit="(data) => {}"
// data: { mode, data, record }
```

### 表单数据格式

```javascript
{
  mode: 'create' | 'edit',
  data: {
    // 所有表单字段的值
    fieldKey1: value1,
    fieldKey2: value2,
  },
  record: {
    // 编辑时为原始记录，新增时为null
  }
}
```

---

## 🔗 相关文档

- [快速开始](./QUICK_START.md)
- [完整配置](./FORM_CONFIG.md)
- [表格配置](./TABLE_CONFIG.md)
- [完整示例](./TableExample.vue)
