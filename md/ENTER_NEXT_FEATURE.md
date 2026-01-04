# enterNext 功能说明文档

## 功能概述

`enterNext` 是一个增强表单用户体验的功能，允许用户在某些表单字段按下回车键后自动聚焦到下一个字段。这个功能特别适合快速数据录入场景，用户可以通过按回车键快速跳转到下一个字段，提高数据输入效率。

## 特性

### 1. **链式聚焦**
配置 `enterNext` 属性后，按下回车键会自动聚焦到指定的下一个字段。可以形成一条链式的聚焦路径：
```
姓名 → 部门 → 薪资 → 邮箱 → 加入日期
```

### 2. **智能跳过不支持的组件**
如果 `enterNext` 指向的字段类型不支持回车（如 `radio`、`checkbox` 等），系统会自动跳过该字段，查找下一个支持回车的字段。

### 3. **自动跳过禁用字段**
如果目标字段被禁用（`disabled: true` 或通过函数返回 `true`），系统会跳过该字段，继续查找可用的字段。

### 4. **支持动态配置**
`enterNext` 和其他表单配置一样，支持动态计算和条件判断。

## 支持的组件类型

### 支持回车聚焦的组件
- ✅ `input` - 文本输入框
- ✅ `number` - 数字输入框
- ✅ `textarea` - 文本域
- ✅ `select` - 下拉选择框
- ✅ `date` - 日期选择器
- ✅ `time` - 时间选择器
- ✅ `datetime` - 日期时间选择器

### 不支持回车聚焦的组件（会被跳过）
- ❌ `radio` - 单选框
- ❌ `checkbox` - 复选框
- ❌ `switch` - 开关
- ❌ `slider` - 滑块
- ❌ `table` - 表格
- ❌ `hidden` - 隐藏字段

## 配置方式

### 基础配置
在列配置的 `form` 对象中添加 `enterNext` 属性，值为目标字段的 `dataIndex`：

```javascript
{
  title: "姓名",
  dataIndex: "name",
  form: {
    type: "input",
    enterNext: "department",  // 回车聚焦到部门字段
    creatable: true,
    editable: true,
    required: true,
  }
}
```

### 完整示例

```javascript
const columns = [
  {
    title: "姓名",
    dataIndex: "name",
    form: {
      type: "input",
      enterNext: "department",
      required: true,
      placeholder: "请输入姓名",
    },
  },
  {
    title: "部门",
    dataIndex: "department",
    form: {
      type: "select",
      enterNext: "salary",  // 链式聚焦
      required: true,
      options: [
        { label: "技术部", value: "tech" },
        { label: "销售部", value: "sales" },
      ],
    },
  },
  {
    title: "薪资",
    dataIndex: "salary",
    form: {
      type: "number",
      enterNext: "email",
      required: true,
    },
  },
  {
    title: "邮箱",
    dataIndex: "email",
    form: {
      type: "input",
      enterNext: "joinDate",
      required: true,
    },
  },
  {
    title: "加入日期",
    dataIndex: "joinDate",
    form: {
      type: "date",
      // 没有 enterNext，最后一个字段
      required: true,
    },
  },
  {
    title: "状态",
    dataIndex: "status",
    form: {
      type: "radio",  // 不支持回车，会被跳过
      options: [
        { label: "在职", value: "active" },
        { label: "离职", value: "inactive" },
      ],
    },
  },
];
```

## 工作原理

### 1. **用户操作**
用户在支持回车的表单字段中按下 Enter 键。

### 2. **回车事件检测**
`TableFormFieldItem.vue` 组件监听 `@keyup.enter` 事件并触发 `handleEnter()` 方法。

### 3. **查找下一个字段**
- 获取当前字段配置中的 `enterNext` 值
- 从该值对应的字段开始查找
- 跳过不支持回车的字段类型（radio、checkbox 等）
- 跳过被禁用的字段
- 返回第一个可用的字段的 `dataIndex`

### 4. **聚焦目标字段**
触发 `onEnterNext` 回调，由 `TableForm.vue` 通过 ref 获取目标字段组件，调用其 `focus()` 方法进行聚焦。

## 源码组件

### TableFormFieldItem.vue
- **新增 Props**：
  - `allFields`: 所有表单字段列表
  - `onEnterNext`: 回车聚焦回调函数

- **新增方法**：
  - `handleEnter()`: 处理回车事件
  - `getNextFocusableField()`: 获取下一个可聚焦的字段

- **修改**：为支持回车的组件添加 `@keyup.enter="handleEnter"`

### TableForm.vue
- **导入**：引入 `nextTick`

- **新增状态**：
  - `state.fieldRefMap`: 存储字段组件的 ref 引用

- **新增方法**：
  - `handleEnterNext(nextFieldIndex)`: 处理焦点转移

- **修改**：
  - 将 `allFields` 和 `onEnterNext` 作为 props 传递给 `TableFormFieldItem.vue`
  - 更新 ref 绑定逻辑以存储所有字段的引用

## 使用场景

### 1. **快速数据录入**
在需要快速输入大量数据的场景下，用户可以快速按回车跳过字段：
```
用户输入姓名 → 回车 → 选择部门 → 回车 → 输入薪资 → 回车 → ...
```

### 2. **条件性字段跳过**
```javascript
form: {
  type: "input",
  enterNext: "status",  // 指向状态字段
  // status 字段是 radio 类型，会被自动跳过
  // 继续寻找后续可用的字段
}
```

### 3. **可选字段智能绕过**
```javascript
{
  title: "备注",
  dataIndex: "remarks",
  form: {
    type: "textarea",
    enterNext: "submit",  // 即使 submit 字段不存在或禁用，也不会出错
    required: false,
  }
}
```

## 注意事项

### 1. **字段顺序很重要**
确保在列配置中，后续可用字段的定义顺序正确，避免跳过了必要字段。

### 2. **循环引用**
避免配置导致无限循环的 enterNext：
```javascript
// ❌ 不推荐 - 形成循环
field1: { enterNext: "field2" }
field2: { enterNext: "field1" }
```

### 3. **末端字段**
表单最后一个字段通常不需要配置 `enterNext`，或配置为不存在的字段。

### 4. **动态 disabled 配置**
```javascript
form: {
  type: "input",
  enterNext: "department",
  disabled: (formData) => formData.status === "inactive"
}
// 当该字段被禁用时，enterNext 指向的字段仍会被尝试聚焦
```

### 5. **只读模式**
在只读模式下，所有字段都被禁用，enterNext 回车聚焦会被跳过。

## 故障排查

### 问题1：按回车没有聚焦到下一个字段
**可能原因**：
- 目标字段没有配置 `form` 属性
- 目标字段类型不支持回车（如 radio、checkbox）
- 目标字段被禁用
- 目标字段在当前模式下不可见（如 `creatable: false` 在创建模式）

**解决方案**：
- 检查目标字段是否在 `availableFields` 中
- 确认目标字段类型在支持列表中
- 检查 `disabled` 或 `creatable/editable` 配置

### 问题2：聚焦到了错误的字段
**可能原因**：
- `enterNext` 值拼写错误或指向了不存在的字段
- 字段顺序配置错误

**解决方案**：
- 检查 `enterNext` 指向的 `dataIndex` 是否正确
- 验证列配置中所有字段的 `dataIndex` 唯一性

### 问题3：特定组件类型不支持 enterNext
**可能原因**：
- 该组件类型本身不支持回车事件或聚焦

**解决方案**：
- 检查是否为支持列表中的类型
- 对于不支持的类型，可以在 `TableFormFieldItem.vue` 中添加支持

## API 参考

### Props（TableFormFieldItem.vue）

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| allFields | Array | [] | 所有表单字段列表 |
| onEnterNext | Function | null | 回车聚焦回调函数 |

### 表单配置项（form 对象）

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| enterNext | String | undefined | 回车后聚焦的目标字段 dataIndex |
| disabled | Boolean\|Function | false | 字段禁用状态 |
| creatable | Boolean | true | 新增模式是否显示 |
| editable | Boolean | true | 编辑模式是否显示 |

## 示例配置文件

参考 [TableExample.vue](../src/components/TableExample.vue) 中的 `tableConfig.columns` 配置，其中包含完整的 enterNext 使用示例。

## 性能考虑

- **DOM 查询**：每次 enterNext 聚焦时会进行 DOM 查询，对于大型表单影响微小
- **ref 存储**：所有字段的 ref 会被存储在 `state.fieldRefMap` 中，内存占用可接受
- **聚焦操作**：使用 `nextTick` 确保 DOM 更新后再进行聚焦，避免时序问题

## 后续扩展

### 可能的未来功能
1. **自动聚焦链配置**：自动根据字段顺序生成聚焦链
2. **自定义验证后聚焦**：在验证通过后才聚焦到下一个字段
3. **快捷键配置**：支持自定义触发聚焦的快捷键（如 Tab）
4. **字段跳过规则**：自定义哪些字段类型应该被跳过
5. **聚焦事件回调**：在聚焦时触发自定义回调函数

## 更新历史

### v1.0 (2026-01-04)
- 初版发布
- 支持 input、number、textarea、select、date、time、datetime 7种组件类型
- 实现智能字段跳过机制
- 提供完整的配置示例
