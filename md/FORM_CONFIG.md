# Vue 3 表单配置完整指南

## 📋 概述

`TableForm` 是一个通用的 Arco Design 表单组件，通过在 Table 组件的 columns 配置中添加 `form` 属性，可以自动生成对应的表单字段。支持 12 种表单控件类型和完整的验证系统。

---

## 🚀 基本使用

### 第1步：在columns中添加form配置

```javascript
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    form: {
      type: 'input',
      required: true,
      creatable: true,
      editable: true,
      placeholder: '请输入姓名',
    },
  },
];
```

### 第2步：启用表单功能

```javascript
const tableConfig = {
  columns: [...],
  showForm: true,  // 启用表单功能
};
```

### 第3步：监听表单提交

```javascript
const handleFormSubmit = (data) => {
  const { mode, data: formData, record } = data;
  
  if (mode === 'create') {
    // 处理新增
  } else {
    // 处理编辑
  }
};

// <Table @form-submit="handleFormSubmit" />
```

---

## 📖 Form配置属性详解

### 基础配置

| 属性 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| `type` | String | 'input' | 表单控件类型 (必填) |
| `required` | Boolean | false | 是否必填 |
| `creatable` | Boolean | true | 新增时是否显示 |
| `editable` | Boolean | true | 编辑时是否显示 |
| `disabled` | Boolean \| Function | false | 是否禁用 (支持函数) |
| `defaultValue` | Any | undefined | 默认值 |
| `placeholder` | String | '' | 占位符提示 |
| `validator` | Function | - | 自定义验证函数 |
| `options` | Array \| Function | [] | 选项数据 (选择类控件) |
| `attrs` | Object | {} | 原生属性透传 |

---

## 🎨 12种表单控件类型

### 1. input - 单行文本输入

文本输入框，用于输入单行文本。

```javascript
form: {
  type: 'input',
  placeholder: '请输入用户名',
  attrs: {
    'max-length': 50,
    'show-word-limit': true,
    'allow-clear': true,
    'prefix': 'user',  // 前缀图标/文本
  },
}
```

**常用attrs属性：**
- `max-length` - 最大字符数
- `show-word-limit` - 显示字数限制
- `allow-clear` - 显示清除按钮
- `prefix` - 前缀
- `suffix` - 后缀
- `readonly` - 只读

---

### 2. textarea - 多行文本输入

多行文本域，用于输入较长的文本。

```javascript
form: {
  type: 'textarea',
  placeholder: '请输入备注',
  attrs: {
    rows: 4,
    'max-length': 500,
    'show-word-limit': true,
  },
}
```

**常用attrs属性：**
- `rows` - 显示行数
- `max-length` - 最大字符数
- `show-word-limit` - 显示字数限制

---

### 3. number - 数字输入

数字输入框，用于输入数值。

```javascript
form: {
  type: 'number',
  placeholder: '请输入金额',
  attrs: {
    min: 0,
    max: 999999,
    step: 0.01,
    precision: 2,  // 小数点位数
  },
}
```

**常用attrs属性：**
- `min` - 最小值
- `max` - 最大值
- `step` - 步长
- `precision` - 精度（小数位数）
- `allow-clear` - 显示清除按钮

---

### 4. select - 下拉选择

单选或多选下拉框。

```javascript
form: {
  type: 'select',
  placeholder: '请选择部门',
  required: true,
  options: [
    { label: '技术部', value: 'tech' },
    { label: '销售部', value: 'sales' },
    { label: '人力资源', value: 'hr' },
  ],
  attrs: {
    multiple: false,    // 单选
    'allow-clear': true,
    'allow-search': true,
  },
}
```

**多选示例：**
```javascript
form: {
  type: 'select',
  defaultValue: [],
  attrs: {
    multiple: true,  // 启用多选
  },
  options: [
    { label: 'Vue', value: 'vue' },
    { label: 'React', value: 'react' },
  ],
}
```

**常用attrs属性：**
- `multiple` - 启用多选
- `allow-clear` - 显示清除按钮
- `allow-search` - 启用搜索
- `max-tag-count` - 最多显示标签数

---

### 5. radio - 单选框

单选框组，选项在页面上显示。

```javascript
form: {
  type: 'radio',
  options: [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' },
    { label: '保密', value: 'secret' },
  ],
  attrs: {
    direction: 'horizontal',  // 水平排列
  },
}
```

**常用attrs属性：**
- `direction` - 排列方向 (horizontal | vertical)
- `size` - 尺寸 (small | medium | large)

---

### 6. checkbox - 复选框

复选框组，值为数组。

```javascript
form: {
  type: 'checkbox',
  defaultValue: ['vue', 'ts'],
  options: [
    { label: 'Vue', value: 'vue' },
    { label: 'React', value: 'react' },
    { label: 'TypeScript', value: 'ts' },
    { label: 'SQL', value: 'sql' },
  ],
  attrs: {
    direction: 'vertical',  // 竖直排列
  },
}
```

**重要：** 复选框的值是数组，需要设置 `defaultValue: []`

**常用attrs属性：**
- `direction` - 排列方向
- `size` - 尺寸

---

### 7. date - 日期选择

日期选择器。

```javascript
form: {
  type: 'date',
  placeholder: '请选择日期',
  attrs: {
    format: 'YYYY-MM-DD',
    'value-format': 'YYYY-MM-DD',
    'allow-clear': true,
  },
}
```

**常用attrs属性：**
- `format` - 显示格式
- `value-format` - 返回值格式
- `allow-clear` - 显示清除按钮
- `disabled-date` - 禁用日期的回调函数

---

### 8. time - 时间选择

时间选择器。

```javascript
form: {
  type: 'time',
  placeholder: '请选择时间',
  attrs: {
    format: 'HH:mm:ss',
    'value-format': 'HH:mm:ss',
  },
}
```

**常用attrs属性：**
- `format` - 显示格式
- `value-format` - 返回值格式
- `use-12-hours` - 12小时制

---

### 9. datetime - 日期时间选择

日期和时间一体选择器。

```javascript
form: {
  type: 'datetime',
  placeholder: '请选择日期时间',
  attrs: {
    format: 'YYYY-MM-DD HH:mm:ss',
    'value-format': 'YYYY-MM-DD HH:mm:ss',
  },
}
```

---

### 10. switch - 开关控件

布尔值开关，值为 true 或 false。

```javascript
form: {
  type: 'switch',
  defaultValue: false,
  attrs: {
    'checked-text': '启用',
    'unchecked-text': '禁用',
  },
}
```

**常用attrs属性：**
- `checked-text` - 选中时的文字
- `unchecked-text` - 未选中时的文字
- `type` - 类型 (circle | round | line)

---

### 11. slider - 滑块

滑块选择器，值为数字。

```javascript
form: {
  type: 'slider',
  defaultValue: 50,
  attrs: {
    min: 0,
    max: 100,
    step: 5,
    marks: { 0: '0%', 50: '50%', 100: '100%' },
  },
}
```

**常用attrs属性：**
- `min` - 最小值
- `max` - 最大值
- `step` - 步长
- `marks` - 标记点
- `range` - 范围选择

---

### 12. table - 嵌入式表格

在表单中嵌入一个可编辑的表格。

```javascript
form: {
  type: 'table',
  tableConfig: {
    columns: [
      { title: '产品名', dataIndex: 'productName', width: 150 },
      { title: '数量', dataIndex: 'quantity', width: 100 },
      { title: '单价', dataIndex: 'price', width: 100 },
    ],
    rowKey: 'key',
    selection: false,
  },
}
```

详见 [TABLE_FIELD_TYPE.md](./TABLE_FIELD_TYPE.md)

---

## ⚙️ 高级特性

### 1. 条件渲染（creatable/editable）

根据表单模式显示或隐藏字段：

```javascript
// 仅在新增时显示（如：员工编号）
form: {
  type: 'input',
  creatable: true,
  editable: false,
}

// 仅在编辑时显示（如：修改人）
form: {
  type: 'input',
  creatable: false,
  editable: true,
}

// 新增编辑都显示
form: {
  type: 'input',
  creatable: true,
  editable: true,
}
```

---

### 2. 条件禁用（disabled函数）

根据其他字段值动态禁用当前字段：

```javascript
form: {
  type: 'input',
  disabled: (formData, field) => {
    // formData：当前表单的所有数据
    // field：当前字段配置
    
    // 例1：当部门不是技术部时禁用
    return formData.department !== 'tech';
    
    // 例2：当状态为锁定时禁用
    return formData.status === 'locked';
    
    // 例3：多个条件
    return !formData.isActive || formData.isLocked;
  },
}
```

---

### 3. 动态选项（options函数）

根据其他字段值动态生成选项（级联选择）：

```javascript
form: {
  type: 'select',
  options: (formData, field) => {
    // 根据部门选择岗位
    const positionMap = {
      'tech': [
        { label: '前端开发', value: 'frontend' },
        { label: '后端开发', value: 'backend' },
        { label: '测试', value: 'test' },
      ],
      'sales': [
        { label: '销售代表', value: 'rep' },
        { label: '销售经理', value: 'manager' },
      ],
      'hr': [
        { label: '人力资源', value: 'staff' },
        { label: '招聘', value: 'recruit' },
      ],
    };
    
    return positionMap[formData.department] || [];
  },
}
```

---

### 4. 自定义验证（validator函数）

实现复杂的验证逻辑：

```javascript
form: {
  type: 'input',
  validator: (value, field) => {
    // 返回空字符串表示验证通过
    // 返回错误信息字符串表示验证失败
    
    // 例1：邮箱验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return '邮箱格式不正确';
    }
    
    return ''; // 验证通过
  },
}

// 例2：结合其他字段的验证
{
  title: '结束日期',
  dataIndex: 'endDate',
  form: {
    type: 'date',
    validator: (value, field, formData) => {
      if (value < formData.startDate) {
        return '结束日期不能早于开始日期';
      }
      return '';
    },
  },
}
```

---

### 5. 原生属性透传（attrs）

通过 `attrs` 对象透传 Arco 组件的原生属性：

```javascript
form: {
  type: 'input',
  attrs: {
    'max-length': 50,
    'show-word-limit': true,
    'allow-clear': true,
    'placeholder': '请输入内容',
    'readonly': false,
  },
}
```

---

## 📝 完整实例

```javascript
import { reactive, ref } from 'vue'
import Table from './Table.vue'

const tableConfig = reactive({
  columns: [
    // 基础文本字段
    {
      title: '员工编号',
      dataIndex: 'id',
      form: {
        type: 'input',
        creatable: true,     // 仅新增可用
        editable: false,
        required: true,
        placeholder: '系统自动生成',
      },
    },

    // 名字字段 - 必填
    {
      title: '员工姓名',
      dataIndex: 'name',
      form: {
        type: 'input',
        required: true,
        placeholder: '请输入姓名',
        validator: (value) => {
          if (!value) return '姓名不能为空';
          if (value.length > 20) return '姓名不超过20个字符';
          return '';
        },
        attrs: {
          'max-length': 20,
        },
      },
    },

    // 邮箱字段
    {
      title: '邮箱',
      dataIndex: 'email',
      form: {
        type: 'input',
        required: true,
        placeholder: '请输入邮箱地址',
        validator: (value) => {
          const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return regex.test(value) ? '' : '邮箱格式不正确';
        },
      },
    },

    // 部门选择
    {
      title: '部门',
      dataIndex: 'department',
      form: {
        type: 'select',
        required: true,
        placeholder: '请选择部门',
        options: [
          { label: '技术部', value: 'tech' },
          { label: '销售部', value: 'sales' },
          { label: '人力资源', value: 'hr' },
          { label: '市场部', value: 'market' },
        ],
      },
    },

    // 岗位选择 - 根据部门动态
    {
      title: '岗位',
      dataIndex: 'position',
      form: {
        type: 'select',
        placeholder: '请先选择部门',
        options: (formData) => {
          const map = {
            'tech': [
              { label: '前端开发', value: 'frontend' },
              { label: '后端开发', value: 'backend' },
            ],
            'sales': [
              { label: '销售代表', value: 'rep' },
            ],
            'hr': [
              { label: '招聘专员', value: 'recruit' },
            ],
            'market': [
              { label: '市场策划', value: 'planner' },
            ],
          };
          return map[formData.department] || [];
        },
      },
    },

    // 薪资输入
    {
      title: '薪资',
      dataIndex: 'salary',
      form: {
        type: 'number',
        required: true,
        placeholder: '请输入月薪',
        attrs: {
          min: 0,
          max: 999999,
          step: 100,
          precision: 0,
        },
      },
    },

    // 入职日期
    {
      title: '入职日期',
      dataIndex: 'joinDate',
      form: {
        type: 'date',
        required: true,
        attrs: {
          'value-format': 'YYYY-MM-DD',
        },
      },
    },

    // 技能选择 - 复选框
    {
      title: '技能',
      dataIndex: 'skills',
      form: {
        type: 'checkbox',
        defaultValue: [],
        options: [
          { label: 'Vue3', value: 'vue3' },
          { label: 'React', value: 'react' },
          { label: 'TypeScript', value: 'ts' },
          { label: 'Node.js', value: 'node' },
        ],
      },
    },

    // 状态选择 - 单选框
    {
      title: '状态',
      dataIndex: 'status',
      form: {
        type: 'radio',
        options: [
          { label: '在职', value: 'active' },
          { label: '离职', value: 'inactive' },
        ],
      },
    },

    // 是否启用 - 开关
    {
      title: '启用',
      dataIndex: 'enabled',
      form: {
        type: 'switch',
        defaultValue: true,
        attrs: {
          'checked-text': '启用',
          'unchecked-text': '禁用',
        },
      },
    },

    // 绩效评分 - 滑块
    {
      title: '绩效评分',
      dataIndex: 'performance',
      form: {
        type: 'slider',
        defaultValue: 80,
        attrs: {
          min: 0,
          max: 100,
          step: 5,
          marks: {
            0: '差',
            50: '中',
            100: '优',
          },
        },
      },
    },

    // 备注 - 文本域
    {
      title: '备注',
      dataIndex: 'remarks',
      form: {
        type: 'textarea',
        placeholder: '请输入备注信息',
        attrs: {
          rows: 3,
          'max-length': 500,
          'show-word-limit': true,
        },
      },
    },
  ],

  showForm: true,
  paginationType: 'frontend',
  pageSize: 10,
});

const tableData = ref([]);

const handleFormSubmit = (data) => {
  const { mode, data: formData, record } = data;

  if (mode === 'create') {
    console.log('新增员工:', formData);
    // api.createEmployee(formData);
  } else if (mode === 'edit') {
    console.log('编辑员工:', { id: record.id, ...formData });
    // api.updateEmployee(record.id, formData);
  }
};
```

---

## 🎯 验证系统

### 内置验证

```javascript
form: {
  required: true,  // 内置必填验证
}
```

### 自定义验证

验证函数在表单提交时调用，返回值：
- 空字符串 `''` - 验证通过
- 非空字符串 - 验证失败，显示错误信息

```javascript
form: {
  validator: (value, field, formData) => {
    // value: 字段值
    // field: 字段配置
    // formData: 整个表单数据
    
    if (!value) return '必填';
    return '';
  },
}
```

---

## 📋 表单事件

```javascript
<Table @form-submit="handleFormSubmit" />

const handleFormSubmit = (data) => {
  const { mode, data: formData, record } = data;
  
  console.log('模式:', mode);           // 'create' 或 'edit'
  console.log('表单数据:', formData);   // 所有字段的值
  console.log('原始数据:', record);     // 编辑时的原始记录
};
```

---

## 💡 最佳实践

1. **明确指定type** - 每个form都要明确指定控件类型
2. **合理使用required** - 简单必填用 `required: true`
3. **复杂验证用validator** - 涉及逻辑的验证用函数
4. **充分利用attrs** - 通过 attrs 传递Arco组件属性
5. **设置合理的placeholder** - 提供清晰的输入提示
6. **使用defaultValue** - 为必填字段设置默认值
7. **动态选项要兼容空值** - options函数要处理未选择的情况

---

## 🔗 相关文档

- [快速开始](./QUICK_START.md)
- [表格配置](./TABLE_CONFIG.md)  
- [组件集成](./FORM_INTEGRATION.md)
- [表单表格](./TABLE_FIELD_TYPE.md)
- [完整示例](./TableExample.vue)
