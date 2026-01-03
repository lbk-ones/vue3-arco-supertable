# 表格搜索字段配置指南

## 概述
搜索字段支持多种控件类型，可以根据数据类型灵活配置搜索条件。

## 搜索字段配置结构

```javascript
{
  dataIndex: 'fieldName',      // 字段名（必填）
  title: '字段标题',           // 显示标题（必填）
  type: 'input',               // 控件类型（可选，默认为 'input'）
  placeholder: '提示文字',     // 占位符（可选）
  options: [],                 // 选项列表（select/radio/checkbox 需要）
  attrs: {},                   // 透传属性（可选，传递给控件的自定义属性）
}
```

## attrs 透传属性说明

`attrs` 对象中的属性会被透传到对应的 Arco Design 组件，用于传递任何组件支持的属性。

### 常用属性示例

```javascript
{
  dataIndex: 'name',
  title: '姓名',
  type: 'input',
  attrs: {
    'max-length': 50,        // 最大长度（适用于 input）
    'allow-clear': true,     // 允许清空（适用于所有组件）
    disabled: false,         // 禁用（适用于所有组件）
    'size': 'large',         // 组件大小
  }
}
```

### 按控件类型的常用 attrs

#### input（文本搜索）
```javascript
attrs: {
  'max-length': 100,       // 最大字符数
  'show-word-limit': true, // 显示字数限制
  size: 'large',          // 组件大小
}
```

#### number（数字搜索）
```javascript
attrs: {
  min: 0,                 // 最小值
  max: 100,              // 最大值
  step: 1,               // 步长
  precision: 2,          // 小数位数
  'allow-clear': true,   // 允许清空
}
```

#### select（下拉框）
```javascript
attrs: {
  multiple: false,       // 是否多选
  'max-tag-count': 5,   // 最多显示标签数
  'remote-search': true, // 是否远程搜索
  size: 'medium',        // 组件大小
}
```

#### date / date-range（日期选择）
```javascript
attrs: {
  'show-time': true,     // 显示时间
  format: 'YYYY-MM-DD',  // 日期格式
  'disable-confirm': true, // 禁用确认按钮
}
```

## 支持的控件类型

### 1. input - 文本搜索（默认）
最基础的搜索方式，支持模糊匹配。

```javascript
{
  dataIndex: 'name',
  title: '姓名',
  type: 'input',
  placeholder: '搜索姓名',
}
```

**搜索逻辑**: 模糊匹配（大小写不敏感）

---

### 2. number - 数字搜索
用于数字类型字段的精确匹配搜索。

```javascript
{
  dataIndex: 'salary',
  title: '薪资',
  type: 'number',
  placeholder: '输入薪资',
}
```

**搜索逻辑**: 精确匹配数字值

---

### 3. select - 下拉框搜索
单选下拉框，用于枚举类型的字段。

```javascript
{
  dataIndex: 'department',
  title: '部门',
  type: 'select',
  placeholder: '选择部门',
  options: [
    { label: '技术部', value: '技术部' },
    { label: '销售部', value: '销售部' },
    { label: '人力资源', value: '人力资源' },
  ],
}
```

**选项来源**:
- 静态数组: `options: [...]`
- 动态函数: `options: (searchValues, field) => [...] `

**搜索逻辑**: 精确匹配选中值

---

### 4. radio - 单选框搜索
单选框组，用于有限的选项列表。

```javascript
{
  dataIndex: 'status',
  title: '状态',
  type: 'radio',
  options: [
    { label: '在职', value: 'active' },
    { label: '离职', value: 'inactive' },
  ],
}
```

**选项来源**: 同 `select` 类型

**搜索逻辑**: 精确匹配选中值

---

### 5. checkbox - 复选框搜索
复选框组，支持多值搜索。

```javascript
{
  dataIndex: 'tags',
  title: '标签',
  type: 'checkbox',
  options: [
    { label: '重要', value: 'important' },
    { label: '紧急', value: 'urgent' },
    { label: '已解决', value: 'resolved' },
  ],
}
```

**搜索逻辑**: 包含匹配（数据中的值与选中的任意值匹配即可）

---

### 6. date - 日期选择搜索
单个日期选择器，用于精确日期搜索。

```javascript
{
  dataIndex: 'joinDate',
  title: '加入日期',
  type: 'date',
  placeholder: '选择日期',
}
```

**搜索逻辑**: 精确匹配日期

---

### 7. date-range - 日期范围搜索
日期范围选择器，用于日期区间搜索。

```javascript
{
  dataIndex: 'dateRange',
  title: '日期范围',
  type: 'date-range',
  placeholder: ['开始日期', '结束日期'],
}
```

**搜索逻辑**: 检查数据日期是否在选定范围内（含边界）

---

### 8. switch - 开关搜索
布尔值开关，用于 true/false 类型字段。

```javascript
{
  dataIndex: 'isActive',
  title: '激活状态',
  type: 'switch',
}
```

**搜索逻辑**: 精确匹配布尔值

---

## 动态选项示例

当选项依赖于其他搜索条件时，可以使用函数：

```javascript
{
  dataIndex: 'subDepartment',
  title: '子部门',
  type: 'select',
  options: (searchValues, field) => {
    // 根据部门字段的值动态返回子部门选项
    const department = searchValues.department;
    
    const subDeptMap = {
      '技术部': [
        { label: '后端', value: 'backend' },
        { label: '前端', value: 'frontend' },
      ],
      '销售部': [
        { label: '内销', value: 'domestic' },
        { label: '外销', value: 'foreign' },
      ],
    };
    
    return subDeptMap[department] || [];
  },
}
```

---

## 完整配置示例

```javascript
const tableConfig = reactive({
  // ... 其他配置
  
  searchFields: [
    // 文本搜索 - 带 attrs 自定义属性
    {
      dataIndex: 'name',
      title: '姓名',
      type: 'input',
      placeholder: '搜索姓名',
      attrs: {
        'max-length': 50,
        'show-word-limit': false,
      },
    },
    
    // 下拉框搜索
    {
      dataIndex: 'department',
      title: '部门',
      type: 'select',
      placeholder: '选择部门',
      options: [
        { label: '技术部', value: '技术部' },
        { label: '销售部', value: '销售部' },
      ],
      attrs: {
        'allow-clear': true,
        size: 'large',
      },
    },
    
    // 单选框搜索
    {
      dataIndex: 'status',
      title: '状态',
      type: 'radio',
      options: [
        { label: '在职', value: 'active' },
        { label: '离职', value: 'inactive' },
      ],
    },
    
    // 数字搜索 - 带 attrs
    {
      dataIndex: 'salary',
      title: '薪资',
      type: 'number',
      placeholder: '输入薪资',
      attrs: {
        min: 0,
        max: 999999,
        step: 1000,
      },
    },
    
    // 日期范围搜索 - 带 attrs
    {
      dataIndex: 'joinDate',
      title: '加入日期',
      type: 'date-range',
      attrs: {
        'show-time': false,
        format: 'YYYY-MM-DD',
      },
    },
  ],
});
```

---

## 搜索逻辑说明

### AND 逻辑
- 多个搜索条件之间采用 **AND** 逻辑
- 只有所有非空搜索条件都满足，数据才会被返回
- 空的搜索条件会被忽略

### 各类型搜索的匹配规则

| 类型 | 匹配规则 | 示例 |
|------|--------|------|
| input | 模糊匹配（不区分大小写） | 输入"jane"可匹配"Jane Doe" |
| number | 精确匹配 | 输入20000只匹配薪资为20000 |
| select | 精确匹配 | 选择"技术部"只返回技术部数据 |
| radio | 精确匹配 | 选择"在职"只返回在职数据 |
| checkbox | 包含匹配 | 选择["重要", "紧急"]返回包含任一标签的数据 |
| date | 精确匹配 | 选择2024-01-01只匹配该日期 |
| date-range | 范围匹配 | 选择2024-01-01到2024-12-31返回该范围内的数据 |
| switch | 精确匹配 | 打开开关返回值为true的数据 |

---

## 最佳实践

1. **合理选择搜索类型**
   - 文本字段使用 `input`
   - 枚举字段使用 `select` 或 `radio`
   - 多选字段使用 `checkbox`
   - 日期字段使用 `date` 或 `date-range`

2. **提供清晰的占位符**
   ```javascript
   placeholder: '搜索员工姓名'  // ✓ 清晰
   placeholder: '输入'          // ✗ 不清晰
   ```

3. **使用标准的选项格式**
   ```javascript
   options: [
     { label: '显示文本', value: '存储值' },
   ]
   ```

4. **通过 attrs 定制组件行为**
   ```javascript
   {
     dataIndex: 'email',
     title: '邮箱',
     type: 'input',
     attrs: {
       'max-length': 100,        // 限制最大长度
       'show-word-limit': true,  // 显示字数限制
       size: 'large',            // 设置大小
     }
   }
   ```

5. **动态选项时处理边界情况**
   ```javascript
   options: (searchValues) => {
     // 当依赖的字段为空时，返回空数组
     if (!searchValues.parentField) return [];
     
     // 返回相关选项
     return getRelatedOptions(searchValues.parentField);
   }
   ```

6. **考虑用户体验**
   - 重要的搜索条件放在前面
   - 限制搜索字段数量（建议不超过5个）
   - 提供"重置"按钮清空所有条件
   - 合理使用 `attrs` 设置组件大小和样式

---

## FAQ

**Q: 如何实现多个搜索条件之间的OR逻辑？**
A: 当前实现为AND逻辑。如需OR逻辑，建议在后端分页时处理，或通过自定义事件处理。

**Q: 复选框搜索如何工作？**
A: 选择多个值时，返回"数据中的值与任一选中值匹配"的行。例如，选择["tag1", "tag2"]会返回包含tag1或tag2的数据。

**Q: 日期范围搜索的边界是否包含？**
A: 是的，边界日期包含在内。范围[2024-01-01, 2024-12-31]包括这两个日期。

**Q: 可以在搜索条件中使用自定义组件吗？**
A: 当前不支持。如需自定义组件，可以考虑在Table.vue中扩展搜索字段渲染逻辑。

**Q: attrs 属性如何使用？**
A: 在搜索字段配置中添加 `attrs` 对象，其中的属性会被透传到对应的 Arco Design 组件。例如：
```javascript
{
  dataIndex: 'name',
  title: '姓名',
  type: 'input',
  attrs: {
    'max-length': 50,
    'show-word-limit': true,
    size: 'large',
  }
}
```

**Q: attrs 中的属性与其他配置冲突时如何处理？**
A: 优先级顺序为：显式设置的属性 > attrs 中的属性。例如，`placeholder` 始终使用配置中的值，而不是 attrs 中的值。

**Q: 哪些属性会被 attrs 覆盖？**
A: attrs 中的属性不会覆盖以下显式设置的属性：
- `v-model`（搜索值绑定）
- `placeholder`（占位符）
- `options`（选项列表）
- `@change` 和 `@search`（事件处理）

**Q: 可以通过 attrs 动态修改组件行为吗？**
A: 可以。attrs 是响应式的，如果 `field.attrs` 发生变化，组件会自动更新。例如：
```javascript
{
  dataIndex: 'status',
  title: '状态',
  type: 'select',
  attrs: computed(() => ({
    disabled: !allowSearch.value,  // 根据条件动态禁用
  }))
}
```
