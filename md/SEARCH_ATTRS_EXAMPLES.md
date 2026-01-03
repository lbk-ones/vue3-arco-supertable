# 搜索条件 attrs 属性快速参考

## 什么是 attrs？

`attrs` 是搜索字段配置中的一个可选属性，用于将自定义属性透传到底层的 Arco Design 组件。这允许你更灵活地控制搜索控件的行为和样式。

## 快速示例

### 基础使用

```javascript
{
  dataIndex: 'name',
  title: '姓名',
  type: 'input',
  attrs: {
    'max-length': 50,
    'show-word-limit': true,
  }
}
```

## 按控件类型的 attrs 属性

### 1. input - 文本搜索

```javascript
{
  dataIndex: 'description',
  title: '描述',
  type: 'input',
  attrs: {
    'max-length': 500,           // 最大字符数
    'show-word-limit': true,     // 显示字数统计
    'prefix': '🔍',              // 前缀图标
    'allow-clear': true,         // 允许清空
    disabled: false,             // 禁用输入框
  }
}
```

### 2. number - 数字搜索

```javascript
{
  dataIndex: 'age',
  title: '年龄',
  type: 'number',
  attrs: {
    min: 18,                     // 最小值
    max: 65,                     // 最大值
    step: 1,                     // 步长
    precision: 0,                // 小数位数
    'allow-clear': true,         // 允许清空
    mode: 'button',              // 按钮模式
  }
}
```

### 3. select - 下拉框

```javascript
{
  dataIndex: 'tag',
  title: '标签',
  type: 'select',
  options: [
    { label: '重要', value: 'important' },
    { label: '紧急', value: 'urgent' },
  ],
  attrs: {
    multiple: false,             // 是否多选
    'allow-clear': true,         // 允许清空
    'allow-search': true,        // 允许搜索
    'virtual-list-props': {      // 虚拟滚动
      height: 300
    },
    disabled: false,             // 禁用下拉框
  }
}
```

### 4. radio - 单选框

```javascript
{
  dataIndex: 'type',
  title: '类型',
  type: 'radio',
  options: [
    { label: '个人', value: 'personal' },
    { label: '企业', value: 'business' },
  ],
  attrs: {
    direction: 'horizontal',     // 方向：horizontal/vertical
    disabled: false,             // 禁用
  }
}
```

### 5. checkbox - 复选框

```javascript
{
  dataIndex: 'features',
  title: '功能',
  type: 'checkbox',
  options: [
    { label: '编辑', value: 'edit' },
    { label: '删除', value: 'delete' },
    { label: '导出', value: 'export' },
  ],
  attrs: {
    direction: 'horizontal',     // 方向：horizontal/vertical
    disabled: false,             // 禁用
  }
}
```

### 6. date - 日期选择

```javascript
{
  dataIndex: 'startDate',
  title: '开始日期',
  type: 'date',
  attrs: {
    format: 'YYYY-MM-DD',        // 日期格式
    'show-time': false,          // 显示时间
    'show-now-btn': true,        // 显示"现在"按钮
    'disable-confirm': false,    // 禁用确认按钮
  }
}
```

### 7. date-range - 日期范围

```javascript
{
  dataIndex: 'dateRange',
  title: '日期范围',
  type: 'date-range',
  attrs: {
    format: 'YYYY-MM-DD',        // 日期格式
    'show-time': false,          // 显示时间
    'shortcuts': [               // 快捷选项
      {
        label: '今天',
        value: () => [new Date(), new Date()]
      },
      {
        label: '本月',
        value: () => {
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          return [startOfMonth, now];
        }
      }
    ]
  }
}
```

### 8. switch - 开关

```javascript
{
  dataIndex: 'isActive',
  title: '激活',
  type: 'switch',
  attrs: {
    'checked-text': '启用',      // 开启时文本
    'unchecked-text': '禁用',    // 关闭时文本
    size: 'small',               // 大小：small/medium
  }
}
```

## 常用 attrs 属性总结

| 属性 | 适用组件 | 说明 | 示例 |
|------|--------|------|------|
| disabled | 全部 | 禁用组件 | `disabled: false` |
| allow-clear | input/number/select/date | 允许清空 | `'allow-clear': true` |
| max-length | input | 最大长度 | `'max-length': 100` |
| min | number | 最小值 | `min: 0` |
| max | number | 最大值 | `max: 100` |
| step | number | 步长 | `step: 5` |
| format | date/date-range | 日期格式 | `format: 'YYYY-MM-DD'` |
| direction | radio/checkbox | 排列方向 | `direction: 'horizontal'` |
| size | 全部 | 组件大小 | `size: 'large'` |

## 动态 attrs 示例

使用 `computed` 创建响应式的 attrs：

```javascript
import { computed, ref } from 'vue';

const allowEdit = ref(true);

const tableConfig = reactive({
  searchFields: [
    {
      dataIndex: 'name',
      title: '姓名',
      type: 'input',
      attrs: computed(() => ({
        disabled: !allowEdit.value,     // 根据条件动态禁用
        'max-length': allowEdit.value ? 100 : 50,
      }))
    }
  ]
});

// 切换可编辑状态
const toggleEditMode = () => {
  allowEdit.value = !allowEdit.value;
};
```

## 合并默认属性和自定义 attrs

如果需要某些属性始终存在，可以在初始化时合并：

```javascript
const createSearchField = (baseConfig, customAttrs) => {
  return {
    ...baseConfig,
    attrs: {
      'allow-clear': true,     // 默认允许清空
      ...customAttrs            // 合并自定义属性
    }
  };
};

// 使用
const searchFields = [
  createSearchField(
    { dataIndex: 'name', title: '姓名', type: 'input' },
    { 'max-length': 50 }
  )
];
```

## 常见问题

**Q: attrs 中的属性会覆盖预设的属性吗？**
A: 不会。以下属性始终由搜索条件配置控制，attrs 无法覆盖：
- `v-model` - 搜索值绑定
- `placeholder` - 占位符文本
- `options` - 选项列表
- `@change`, `@search` - 事件处理

**Q: 如何同时设置多个 attrs 属性？**
A: 在 `attrs` 对象中添加多个属性即可：
```javascript
attrs: {
  min: 0,
  max: 100,
  step: 5,
  'allow-clear': true,
  disabled: false,
}
```

**Q: attrs 中的属性名称是否区分大小写？**
A: 是的。HTML 属性名称不区分大小写，但在 JavaScript 对象中使用短横线连接时需要用引号括起来：
```javascript
attrs: {
  'max-length': 50,      // ✓ 正确
  'allow-clear': true,   // ✓ 正确
  maxLength: 50,         // ✗ 可能不工作
}
```

**Q: 可以在 attrs 中使用函数吗？**
A: 大多数情况下不可以。但 `format` 等特定属性支持函数。建议查看 Arco Design 组件文档确认。

**Q: 如何禁用某个搜索字段？**
A: 在 `attrs` 中设置 `disabled: true`：
```javascript
{
  dataIndex: 'status',
  title: '状态',
  type: 'select',
  attrs: {
    disabled: true  // 禁用此搜索字段
  }
}
```

## 完整例子

```javascript
const tableConfig = reactive({
  searchFields: [
    // 文本搜索 - 限制长度
    {
      dataIndex: 'name',
      title: '姓名',
      type: 'input',
      placeholder: '输入员工姓名',
      attrs: {
        'max-length': 50,
        'show-word-limit': true,
      }
    },

    // 数字搜索 - 限制范围
    {
      dataIndex: 'salary',
      title: '薪资',
      type: 'number',
      placeholder: '输入薪资',
      attrs: {
        min: 3000,
        max: 50000,
        step: 1000,
      }
    },

    // 下拉框 - 支持搜索
    {
      dataIndex: 'department',
      title: '部门',
      type: 'select',
      options: departments,
      attrs: {
        'allow-search': true,
        'allow-clear': true,
      }
    },

    // 日期范围 - 带快捷选项
    {
      dataIndex: 'joinDateRange',
      title: '入职日期',
      type: 'date-range',
      attrs: {
        format: 'YYYY-MM-DD',
        'show-time': false,
      }
    },
  ]
});
```
