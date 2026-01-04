# Vue 3 + Arco Design 超级表格

## 📋 项目概述

这是一个完整的 **Vue 3 + Arco Design** 通用表单表格系统，提供了一套基于json配置实现的灵活、高效的表格和表单解决方案。系统包含三个核心组件和完整的文档体系。

## 🏗️ 核心组件架构

### 1. Table.vue - 通用表格组件
主表格组件，提供表格数据展示、搜索、分页、操作等功能。

**核心特性：**
- 🎯 灵活的列配置，支持显示/隐藏、排序、调整宽度
- 🔍 搜索功能，支持8种搜索控件类型
- 📄 两种分页模式：前端分页和后端分页
- ✏️ 集成表单功能，支持新增和编辑
- 👁️ 只读模式，用于查看详情
- 📊 行选择和批量操作
- ⚙️ 列配置管理，可视化配置表格显示

**Props:**
- `config` (必填) - 表格配置对象
- `data` - 表格数据数组
- `loading` - 加载状态
- `selectedKeys` - 选中行数组

**主要事件：**
- `@form-submit` - 表单提交事件
- `@search` - 搜索事件
- `@page-change` - 分页变化
- `@action-click` - 操作按钮点击
- `@api-request` - API请求事件

### 2. TableForm.vue - 通用表单组件
独立的表单组件，支持自动生成和验证表单。

**核心特性：**
- 📝 支持12种表单控件类型
- ✅ 完整的字段验证系统
- 🎨 灵活的表单布局（垂直/水平）
- 🔄 支持新增、编辑、只读三种模式
- 🎯 条件字段渲染和禁用
- 📦 动态选项和级联选择
- 🔗 表格字段嵌入，支持行内编辑

**Props:**
- `columns` (必填) - 列配置数组
- `mode` - 表单模式 (create/edit/readonly)
- `visible` - 弹窗显示状态
- `record` - 编辑数据记录

### 3. TableFormFieldItem.vue - 表单字段渲染器
负责单个表单字段的渲染和绑定。

**支持的控件类型：**
- `slot` - 自定义插槽
- `input` - 文本输入框
- `number` - 数字输入框
- `textarea` - 多行文本
- `select` - 下拉选择
- `radio` - 单选框
- `checkbox` - 复选框（返回数组）
- `date` - 日期选择
- `time` - 时间选择
- `datetime` - 日期时间选择
- `switch` - 开关控件
- `slider` - 滑块
- `table` - 表格（行内编辑）

### 4. TableExample.vue - 完整示例
包含所有功能的演示和配置示例。

## 📚 文档体系

| 文档 | 说明 | 适用场景 |
|------|------|--------|
| [QUICK_START.md](./md/QUICK_START.md) | 5分钟快速上手指南 | 新手入门 |
| [TABLE_CONFIG.md](./md/TABLE_CONFIG.md) | 表格配置完整参考 | 表格配置 |
| [FORM_CONFIG.md](./md/FORM_CONFIG.md) | 表单字段配置详解 | 表单开发 |
| [FORM_INTEGRATION.md](./md/FORM_INTEGRATION.md) | 组件集成和扩展 | 深度集成 |
| [TABLE_FIELD_TYPE.md](./md/TABLE_FIELD_TYPE.md) | 表格字段类型说明 | 嵌入式表格 |
| [SEARCH_CONFIG.md](./md/SEARCH_CONFIG.md) | 搜索功能配置 | 搜索功能 |
| [SEARCH_FIELD_TYPES.md](./md/SEARCH_FIELD_TYPES.md) | 搜索字段类型定义 | 类型参考 |
| [SEARCH_ATTRS_EXAMPLES.md](./md/SEARCH_ATTRS_EXAMPLES.md) | 搜索属性示例 | 快速参考 |
| [READONLY_MODE.md](./md/READONLY_MODE.md) | 只读模式使用指南 | 查看详情 |

## 🎯 快速开始

### 基本使用

```vue
<script setup>
import SuperTable from './components/Table.vue'
import { reactive, ref } from 'vue'

const tableConfig = reactive({
  columns: [
    {
      title: '姓名',
      dataIndex: 'name',
      form: { type: 'input', required: true }
    }
  ],
  showForm: true,
  paginationType: 'frontend',
  pageSize: 10
})

const tableData = ref([])

const handleFormSubmit = (data) => {
  console.log('表单提交:', data)
}
</script>

<template>
  <SuperTable 
    :config="tableConfig" 
    :data="tableData"
    @form-submit="handleFormSubmit"
  />
</template>
```

## 🎨 表单控件完整对照表

| 控件类型 | 说明 | 值类型 | 示例 |
|---------|------|--------|------|
| `slot` | 自定义插槽 | any | any |
| `input` | 文本输入框 | 字符串 | 姓名、描述等 |
| `number` | 数字输入框 | 数字 | 价格、数量等 |
| `textarea` | 多行文本 | 字符串 | 备注、评论等 |
| `select` | 下拉选择 | 字符串/数字 | 部门、状态等 |
| `radio` | 单选框 | 字符串/数字/布尔 | 性别、是否等 |
| `checkbox` | 复选框 | 数组 | 权限、标签等 |
| `date` | 日期选择 | 字符串 | 出生日期、时间等 |
| `time` | 时间选择 | 字符串 | 上班时间等 |
| `datetime` | 日期时间 | 字符串 | 创建时间等 |
| `switch` | 开关控件 | 布尔值 | 启用/禁用等 |
| `slider` | 滑块 | 数字 | 评分、百分比等 |
| `table` | 嵌入表格 | 数组 | 订单明细等 |

## 🌟 主要特性
| `date` | 日期选择器 | 字符串 |
| `time` | 时间选择器 | 字符串 |
| `datetime` | 日期时间选择器 | 字符串 |
| `switch` | 开关 | 布尔值 |
| `slider` | 滑块 | 数字 |
| `table` | 表格（占满一行） | 数组 |

## ✨ 核心特性### 1. 灵活的Form配置

```javascript
form: {
  type: 'input',              // 控件类型
  creatable: true,            // 新增时可用
  slotName: true,             // type=slot时生效
  columns: true,              // 占多数列
  editable: true,             // 编辑时可用
  required: true,             // 必填
  enterNext: "xxx",           // 回车指向下一个控件（带输入框的控件才可以）
  oneRow:   true,             // 占满一行
  disabled: false,            // 禁用状态（支持函数）
  options: [],                // 选项数据（支持函数）
  defaultValue: null,         // 默认值
  placeholder: '提示',        // 占位符
  attrs: {},                  // 原生属性透传
  validator: (value) => '',   // 自定义验证
}
```

### 2. 条件控制

**按模式显示/隐藏**
```javascript
// 仅在新增时显示
creatable: true, editable: false

// 仅在编辑时显示
creatable: false, editable: true
```

**条件禁用**
```javascript
disabled: (formData, field) => {
  return !!formData.isLocked;
}
```

### 3. 动态选项

```javascript
options: (formData, field) => {
  // 根据其他字段值动态返回选项
  return formData.department === 'tech'
    ? [{ label: 'Vue', value: 'vue' }]
    : [];
}
```

### 4. 自定义验证

```javascript
validator: (value, field) => {
  if (!value) return '不能为空';
  if (value.length < 3) return '至少3个字符';
  return ''; // 验证通过
}
```

### 5. 原生属性透传

```javascript
attrs: {
  'max-length': 50,
  'allow-clear': true,
  'show-word-limit': true,
}
```

## 📊 数据流

### 新增流程
```
点击"+新增"按钮
    ↓
打开Form弹窗（mode='create'）
    ↓
显示空白表单（根据form.creatable === true的字段）
    ↓
用户填写表单
    ↓
点击"确定"提交
    ↓
触发 form-submit 事件
    ↓
{ mode: 'create', data: {...formData...} }
```

### 编辑流程
```
点击行的"编辑"按钮
    ↓
打开Form弹窗（mode='edit'）
    ↓
显示该行数据（根据form.editable === true的字段）
    ↓
用户修改表单
    ↓
点击"确定"提交
    ↓
触发 form-submit 事件
    ↓
{ mode: 'edit', data: {...formData...}, record: {...originalData...} }
```

## 🔧 快速集成步骤

### 1. 启用表单功能
```javascript
const tableConfig = {
  columns: [...],
  showForm: true,  // 启用表单
};
```

### 2. 为columns添加form配置
```javascript
{
  title: '姓名',
  dataIndex: 'name',
  form: {
    type: 'input',
    required: true,
  },
}
```

### 3. 监听表单提交
```javascript
@form-submit="handleFormSubmit"

const handleFormSubmit = (data) => {
  // 处理表单提交
};
```

## 📁 项目文件结构

```
src/components/
├── Table.vue                      表格主组件
├── TableForm.vue                  表单主组件
├── TableFormFieldItem.vue         表单字段渲染器
├── TableExample.vue               完整使用示例
├── README.md                      项目总览（本文件）
├── QUICK_START.md                 5分钟快速入门
├── TABLE_CONFIG.md                表格配置完整指南
├── FORM_CONFIG.md                 表单配置完整指南
├── FORM_INTEGRATION.md            组件集成说明
├── TABLE_FIELD_TYPE.md            表单内表格字段说明
├── SEARCH_CONFIG.md               搜索功能配置指南
├── SEARCH_FIELD_TYPES.md          搜索字段类型定义
├── SEARCH_ATTRS_EXAMPLES.md       搜索属性快速参考
├── READONLY_MODE.md               只读模式使用说明
└── READONLY_MODE_IMPLEMENTATION.md 只读模式实现细节
```

## ✨ 已实现的核心功能

### 表单功能
- ✅ 12种表单控件类型（input、number、textarea、select、radio、checkbox、date、time、datetime、switch、slider、table）
- ✅ 新增/编辑/只读三种模式
- ✅ 自动表单生成和验证
- ✅ 条件字段渲染（creatable/editable）
- ✅ 条件禁用（支持函数）
- ✅ 动态选项（支持函数）
- ✅ 自定义验证函数
- ✅ 原生属性透传
- ✅ 多种值类型支持

### 表格功能
- ✅ 新增按钮集成
- ✅ 行编辑按钮
- ✅ 查看详情（单条和多条）
- ✅ 搜索过滤功能
- ✅ 前端/后端两种分页
- ✅ 列显示/隐藏管理
- ✅ 列宽度调整
- ✅ 行选择和批量操作

### 表格字段
- ✅ 嵌入式表格支持
- ✅ 行内编辑功能

## 📖 文档导航

| 场景 | 推荐文档 | 阅读时间 |
|------|--------|--------|
| 首次使用 | [QUICK_START.md](./md/QUICK_START.md) | 5 分钟 |
| 表格配置 | [TABLE_CONFIG.md](./md/TABLE_CONFIG.md) | 20 分钟 |
| 表单配置 | [FORM_CONFIG.md](./md/FORM_CONFIG.md) | 30 分钟 |
| 搜索功能 | [SEARCH_CONFIG.md](./md/SEARCH_CONFIG.md) | 20 分钟 |
| 搜索参考 | [SEARCH_ATTRS_EXAMPLES.md](./md/SEARCH_ATTRS_EXAMPLES.md) | 10 分钟 |
| 搜索类型 | [SEARCH_FIELD_TYPES.md](./md/SEARCH_FIELD_TYPES.md) | 15 分钟 |
| 查看详情 | [READONLY_MODE.md](./md/READONLY_MODE.md) | 10 分钟 |
| 表单表格 | [TABLE_FIELD_TYPE.md](./md/TABLE_FIELD_TYPE.md) | 20 分钟 |
| 深度集成 | [FORM_INTEGRATION.md](./md/FORM_INTEGRATION.md) | 30 分钟 |
| 代码示例 | [TableExample.vue](./md/TableExample.vue) | 实时参考 |

## 🎓 学习路径

**新手入门路径：**
1. 查看本 README.md（了解整体）
2. 阅读 [QUICK_START.md](./md/QUICK_START.md)（5分钟上手）
3. 参考 [TableExample.vue](./md/TableExample.vue)（看完整示例）
4. 尝试修改示例代码（动手实践）

**功能扩展路径：**
1. [TABLE_CONFIG.md](./md/TABLE_CONFIG.md) - 表格配置
2. [FORM_CONFIG.md](./md/FORM_CONFIG.md) - 表单配置
3. [SEARCH_CONFIG.md](./md/SEARCH_CONFIG.md) - 搜索配置

**深度开发路径：**
1. [FORM_INTEGRATION.md](./md/FORM_INTEGRATION.md) - 组件集成
2. [TABLE_FIELD_TYPE.md](./md/TABLE_FIELD_TYPE.md) - 高级表单字段
3. 查看源代码注释 - 深入理解实现

## 💡 最佳实践

### Form配置建议
```javascript
// ✅ 好的实践
{
  title: '用户名',
  dataIndex: 'username',
  form: {
    type: 'input',           // 明确指定type
    required: true,          // 使用required
    creatable: true,         // 明确指定模式
    editable: true,
    validator: (value) => {  // 复杂验证用函数
      return /^[a-z0-9_]{3,}$/.test(value) ? '' : '无效用户名';
    },
    attrs: {
      'max-length': 20,      // 通过attrs传递原生属性
      'allow-clear': true,
    },
  },
}

// ❌ 避免
{
  form: {
    // 缺少type定义
    // creatable和editable都不写（依赖默认值）
    placeholder: '这应该在attrs中',  // 应该在attrs中
  },
}
```

### 事件处理建议
```javascript
// 新增
const handleFormSubmit = (data) => {
  const { mode, data: formData, record } = data;
  
  if (mode === 'create') {
    // 调用新增API
    createData(formData);
  } else if (mode === 'edit') {
    // 调用更新API
    updateData(record.id, formData);
  }
}
```

## 🤝 贡献指南

如果发现问题或有改进建议，欢迎通过以下方式反馈：
1. 检查 [TableExample.vue](./src/components/TableExample.vue) 中的相似功能
2. 查阅相关文档中的示例
3. 查看源代码注释
4. 提出 Issue 或 Pull Request

## 📄 许可证

MIT License
## ✅ 质量检查

- ✅ 代码无错误
- ✅ 组件功能完整
- ✅ 文档详细完整
- ✅ 示例代码可运行
- ✅ 界面交互流畅
- ✅ 事件系统完善

## 📞 技术支持

有任何问题，请：
1. 查看对应的文档文件
2. 参考TableExample.vue的使用方式
3. 检查Form配置是否正确
4. 查看浏览器控制台的错误信息

## 🌟 最新功能

### 表单项模式（isFormItem）
当Table组件用作表单字段时（`isFormItem="true"`），点击新增按钮会直接向父级数组添加一条新记录，而无需打开表单弹窗。

**使用示例：**

```javascript
// 在TableForm中使用Table作为字段
{
  title: '子表',
  dataIndex: 'items',
  form: {
    type: 'table',
    tableConfig: {
      columns: [...],  // 子表列定义
      // isFormItem: true 会自动设置
    }
  }
}
```

祝你使用愉快！🚀
