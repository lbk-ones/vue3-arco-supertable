# 表单表格字段类型使用指南

## 概述

在表单中支持嵌入表格（table）字段类型，允许用户在表单中直接管理表格数据。表格字段会占满整行，并拥有完整的表格功能。

## 基本配置

### 列配置示例

```javascript
{
  title: '订单详情',
  dataIndex: 'orderDetails',
  form: {
    type: 'table',           // 表格类型
    creatable: true,         // 新增时显示
    editable: true,          // 编辑时显示
    tableConfig: {
      // 表格配置
      columns: [
        {
          title: '产品名称',
          dataIndex: 'productName',
          width: 150,
        },
        {
          title: '数量',
          dataIndex: 'quantity',
          width: 100,
        },
        {
          title: '单价',
          dataIndex: 'price',
          width: 100,
        },
        {
          title: '合计',
          dataIndex: 'total',
          width: 100,
        },
      ],
      bordered: { cell: true },  // 边框配置
      hoverable: true,           // 行悬停效果
      scroll: { x: 'auto' },     // 滚动配置
      tableSize: 'small',        // 表格大小
    },
  },
}
```

## 字段值格式

表格字段的值应该是一个数组，每一项代表表格的一行：

```javascript
// 表单数据示例
{
  orderDetails: [
    {
      key: 'row-1',           // 必须有 key 字段作为行的唯一标识
      productName: '产品A',
      quantity: 10,
      price: 100,
      total: 1000,
    },
    {
      key: 'row-2',
      productName: '产品B',
      quantity: 5,
      price: 200,
      total: 1000,
    },
  ],
}
```

## tableConfig 配置项

| 属性 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `columns` | Array | 表格列配置，与Arco Table组件相同 | 见上面的配置示例 |
| `bordered` | Boolean/Object | 边框配置 | `true` 或 `{ cell: true }` |
| `hoverable` | Boolean | 行悬停效果 | `true` |
| `scroll` | Object | 滚动配置 | `{ x: 'auto', y: 400 }` |
| `tableSize` | String | 表格大小：small/medium/large | `'small'` |
| `slots` | Object | 自定义插槽配置（可选） | `{ status: true }` |

## 功能特点

### 1. 自动操作列

表格会自动显示"编辑"和"删除"按钮：

```javascript
// 自动生成的操作列
<a-button @click="editRow(key)">编辑</a-button>
<a-button @click="deleteRow(key)">删除</a-button>
```

### 2. 新增行

点击表格工具栏的"+ 新增行"按钮可以添加新行：

```javascript
// 新行会自动包含所有列的字段，值初始化为 null
{
  key: 'new-timestamp-random',
  column1: null,
  column2: null,
  // ...
}
```

### 3. 删除行

点击操作列的"删除"按钮可以删除该行。

### 4. 只读模式

在只读模式下，表格会隐藏所有操作按钮和新增行按钮，仅显示数据。

### 5. 数据同步

表格数据的任何更改都会立即更新到表单的 `formData` 中，提交表单时会包含表格数据。

## 完整示例

```javascript
// TableExample.vue
const tableConfig = reactive({
  columns: [
    // ... 其他列配置
    {
      title: '商品列表',
      dataIndex: 'items',
      form: {
        type: 'table',
        creatable: true,
        editable: true,
        tableConfig: {
          columns: [
            {
              title: '商品名称',
              dataIndex: 'name',
              width: 120,
            },
            {
              title: '规格',
              dataIndex: 'spec',
              width: 100,
            },
            {
              title: '数量',
              dataIndex: 'qty',
              width: 80,
            },
            {
              title: '单价',
              dataIndex: 'unitPrice',
              width: 80,
            },
            {
              title: '操作',
              dataIndex: 'operations',
              width: 120,
            },
          ],
          bordered: { cell: true },
          hoverable: true,
          tableSize: 'small',
        },
      },
    },
  ],
  // ... 其他配置
});

// 表单提交时的数据
const handleFormSubmit = (data) => {
  console.log('表单数据:', data);
  // 数据中会包含 items 数组
  // {
  //   items: [
  //     { key: 'row-1', name: '商品A', spec: '规格1', qty: 10, unitPrice: 100 },
  //     { key: 'row-2', name: '商品B', spec: '规格2', qty: 5, unitPrice: 200 },
  //   ],
  //   // ... 其他表单字段
  // }
};
```

## 样式和布局

### 占满一行

表格字段会自动占满整行（在水平布局模式下）：

```javascript
// 配置为 horizontal 时
formLayout: 'horizontal',
formColumns: 3,  // 即使设置为3列，表格也会占满整行
```

### 自定义样式

可以通过在column配置中添加样式来自定义表格单元格：

```javascript
{
  title: '状态',
  dataIndex: 'status',
  render: (col, record) => {
    return {
      render: () => (
        <a-tag color={record.status === '1' ? 'green' : 'red'}>
          {record.status === '1' ? '活跃' : '无效'}
        </a-tag>
      ),
    };
  },
}
```

## 注意事项

1. **key字段必须**：表格中每一行都必须有唯一的 `key` 字段，系统会在新增行时自动生成

2. **列配置要与数据匹配**：表格的 columns 配置中的 dataIndex 必须与实际数据字段名对应

3. **表格大小限制**：不建议在一个表单中嵌入过大的表格（超过100行），可能影响性能

4. **初始值**：在创建新记录时，如果要初始化表格数据，需要在 form 配置中设置 `defaultValue`：

```javascript
{
  type: 'table',
  defaultValue: [
    {
      key: 'default-1',
      name: '默认商品1',
      qty: 1,
    },
  ],
}
```

5. **禁用状态**：表格字段可以通过 `disabled` 配置禁用：

```javascript
{
  type: 'table',
  disabled: false,  // 或者一个函数：(formData, field) => boolean
}
```

## 与主表格的区别

| 特性 | 主表格 | 表单表格字段 |
|------|--------|-----------|
| 位置 | 表格组件的主体 | 表单弹窗内嵌 |
| 功能 | 完整的查询、排序、分页等 | 基础的行编辑删除 |
| 行数 | 可以很大 | 建议 < 100 行 |
| 交互 | 独立的操作 | 与表单一起提交 |
| 数据 | 来自后端API | 来自表单数据 |

## 常见问题

**Q: 能否自定义操作列？**
A: 目前操作列是固定的"编辑"和"删除"。如需自定义，可以在后续版本中扩展。

**Q: 能否实现行的编辑功能（如双击编辑）？**
A: 当前版本通过点击"编辑"按钮触发 `table-action` 事件，父组件可以监听此事件实现自定义编辑逻辑。

**Q: 表格数据如何验证？**
A: 可以在表单的整体验证函数中对表格数据进行验证，或者为每个表格列添加自定义验证逻辑。

**Q: 新增行的默认值如何设置？**
A: 系统会根据 columns 配置自动创建新行，所有字段初始化为 null。可以通过后续的编辑功能填充数据。
