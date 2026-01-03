# 快速开始指南

## 🚀 5分钟上手

### 第1步：启用表单功能

在Table配置中添加 `showForm: true`：

```javascript
const tableConfig = {
  columns: [...],
  showForm: true,  // ← 添加这行启用表单
};
```

### 第2步：为columns添加form配置

```javascript
{
  title: '姓名',
  dataIndex: 'name',
  form: {
    type: 'input',           // 指定表单控件类型
    required: true,          // 设为必填
    creatable: true,         // 新增时显示
    editable: true,          // 编辑时显示
  },
}
```

### 第3步：监听表单提交事件

```javascript
const handleFormSubmit = (data) => {
  const { mode, data: formData, record } = data;
  
  if (mode === 'create') {
    // 处理新增：formData 是新数据，record 为 null
    console.log('新增:', formData);
  } else if (mode === 'edit') {
    // 处理编辑：formData 是修改后的数据，record 是原始数据
    console.log('编辑:', { old: record, new: formData });
  }
};

// 在template中：
// <Table @form-submit="handleFormSubmit" />
```

完成！现在你的表格支持新增和编辑功能了 🎉

---

## 📚 完整配置示例

```javascript
import { reactive, ref } from 'vue'
import Table from './components/Table.vue'

const tableConfig = reactive({
  columns: [
    // 文本输入框
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

    // 下拉选择框
    {
      title: '部门',
      dataIndex: 'department',
      form: {
        type: 'select',
        required: true,
        options: [
          { label: '技术部', value: 'tech' },
          { label: '销售部', value: 'sales' },
          { label: '人力资源', value: 'hr' },
        ],
      },
    },

    // 数字输入框
    {
      title: '薪资',
      dataIndex: 'salary',
      form: {
        type: 'number',
        attrs: { min: 0, max: 999999, step: 100 },
      },
    },

    // 日期选择
    {
      title: '入职日期',
      dataIndex: 'joinDate',
      form: {
        type: 'date',
        required: true,
      },
    },

    // 复选框（返回数组）
    {
      title: '技能',
      dataIndex: 'skills',
      form: {
        type: 'checkbox',
        defaultValue: [],
        options: [
          { label: 'Vue3', value: 'vue3' },
          { label: 'TypeScript', value: 'ts' },
          { label: 'SQL', value: 'sql' },
        ],
      },
    },

    // 单选框
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

    // 开关控件
    {
      title: '启用',
      dataIndex: 'enabled',
      form: {
        type: 'switch',
        defaultValue: true,
      },
    },
  ],

  // 表格配置
  showForm: true,                    // 启用表单
  paginationType: 'frontend',        // 前端分页
  pageSize: 10,                      // 每页条数
  columnResizable: true,             // 列可调整宽度
  selection: true,                   // 显示选择列
});

// 表格数据
const tableData = ref([
  {
    key: '1',
    name: '张三',
    department: 'tech',
    salary: 25000,
    joinDate: '2023-01-15',
    skills: ['vue3', 'ts'],
    status: 'active',
    enabled: true,
  },
  // 更多数据...
]);

// 处理表单提交
const handleFormSubmit = (data) => {
  const { mode, data: formData, record } = data;

  if (mode === 'create') {
    // 调用API新增
    console.log('新增数据:', formData);
    // await api.create(formData);
    Message.success('新增成功');
  } else if (mode === 'edit') {
    // 调用API更新
    console.log('编辑数据:', { id: record.key, ...formData });
    // await api.update(record.key, formData);
    Message.success('编辑成功');
  }
};
```

---

## 🎯 12种表单控件类型

### 1. input - 单行文本输入

```javascript
form: {
  type: 'input',
  placeholder: '请输入内容',
  attrs: { 'max-length': 50, 'allow-clear': true },
}
```

### 2. textarea - 多行文本输入

```javascript
form: {
  type: 'textarea',
  placeholder: '请输入多行内容',
  attrs: { rows: 4, 'show-word-limit': true },
}
```

### 3. number - 数字输入

```javascript
form: {
  type: 'number',
  attrs: { min: 0, max: 100, step: 1 },
}
```

### 4. select - 下拉选择

```javascript
form: {
  type: 'select',
  options: [
    { label: '选项1', value: 'val1' },
    { label: '选项2', value: 'val2' },
  ],
  attrs: { multiple: false, 'allow-clear': true },
}
```

### 5. radio - 单选框

```javascript
form: {
  type: 'radio',
  options: [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' },
  ],
}
```

### 6. checkbox - 复选框（返回数组）

```javascript
form: {
  type: 'checkbox',
  defaultValue: [],
  options: [
    { label: '选项1', value: 'val1' },
    { label: '选项2', value: 'val2' },
  ],
}
```

### 7. date - 日期选择

```javascript
form: {
  type: 'date',
  attrs: { 'format': 'YYYY-MM-DD', 'placeholder': '选择日期' },
}
```

### 8. time - 时间选择

```javascript
form: {
  type: 'time',
  attrs: { 'format': 'HH:mm:ss' },
}
```

### 9. datetime - 日期时间选择

```javascript
form: {
  type: 'datetime',
  attrs: { 'format': 'YYYY-MM-DD HH:mm:ss' },
}
```

### 10. switch - 开关控件

```javascript
form: {
  type: 'switch',
  defaultValue: false,
}
```

### 11. slider - 滑块

```javascript
form: {
  type: 'slider',
  attrs: { min: 0, max: 100, step: 1 },
}
```

### 12. table - 嵌入式表格

```javascript
form: {
  type: 'table',
  tableConfig: {
    columns: [
      { title: '产品', dataIndex: 'product', width: 150 },
      { title: '数量', dataIndex: 'quantity', width: 100 },
    ],
  },
}
```

---

## ⚙️ 高级用法

### 1. 条件禁用（根据其他字段）

```javascript
form: {
  type: 'input',
  disabled: (formData, field) => {
    // 当部门不是技术部时禁用
    return formData.department !== 'tech';
  },
}
```

### 2. 动态选项（级联选择）

```javascript
form: {
  type: 'select',
  options: (formData, field) => {
    // 根据选中的部门返回对应的岗位
    if (formData.department === 'tech') {
      return [
        { label: '前端开发', value: 'frontend' },
        { label: '后端开发', value: 'backend' },
      ];
    } else if (formData.department === 'sales') {
      return [
        { label: '销售代表', value: 'rep' },
        { label: '销售经理', value: 'manager' },
      ];
    }
    return [];
  },
}
```

### 3. 自定义验证

```javascript
form: {
  type: 'input',
  validator: (value) => {
    if (!value) {
      return '邮箱不能为空';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return '邮箱格式不正确';
    }
    return ''; // 验证通过
  },
}
```

### 4. 仅新增或仅编辑

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
```

### 5. 原生属性透传（attrs）

```javascript
form: {
  type: 'input',
  attrs: {
    'max-length': 50,              // 最大长度
    'show-word-limit': true,       // 显示字数限制
    'allow-clear': true,           // 显示清除按钮
    'prefix': '$',                 // 前缀图标
    'placeholder': '请输入金额',   // 占位符
  },
}
```

---

## 📖 文档导航

| 需求 | 推荐阅读 | 所需时间 |
|------|--------|--------|
| 表单配置详解 | [FORM_CONFIG.md](./FORM_CONFIG.md) | 30 分钟 |
| 表格配置详解 | [TABLE_CONFIG.md](./TABLE_CONFIG.md) | 20 分钟 |
| 搜索功能 | [SEARCH_CONFIG.md](./SEARCH_CONFIG.md) | 20 分钟 |
| 组件集成 | [FORM_INTEGRATION.md](./FORM_INTEGRATION.md) | 30 分钟 |
| 查看详情 | [READONLY_MODE.md](./READONLY_MODE.md) | 10 分钟 |
| 表单内表格 | [TABLE_FIELD_TYPE.md](./TABLE_FIELD_TYPE.md) | 20 分钟 |
| 完整示例 | [TableExample.vue](./TableExample.vue) | 实时参考 |

---

## 🎓 学习路径

1. **阅读本文档** - 了解基础概念（5分钟）
2. **查看示例代码** - 学习完整实例（10分钟）
3. **动手实践** - 在自己项目中尝试（20分钟）
4. **深入学习** - 查阅 FORM_CONFIG.md 了解高级特性（30分钟）
5. **自定义扩展** - 根据需要扩展功能

---

## ✨ 核心优势

✅ **零配置启用** - 一行代码启用表单功能  
✅ **12种控件** - 涵盖大多数常见场景  
✅ **完全灵活** - 支持动态、条件、自定义逻辑  
✅ **自动验证** - 内置验证系统  
✅ **无缝集成** - 与Table组件完美配合  
✅ **详细文档** - 完整的示例和说明  

---

## 💡 常见问题

**Q: 如何设置默认值？**  
A: 使用 `defaultValue` 属性，或在编辑时数据会自动填充。

**Q: 如何禁用某个字段？**  
A: 使用 `disabled: true` 或使用函数进行条件禁用。

**Q: 如何实现级联选择？**  
A: 使用 `options` 函数，根据其他字段值返回不同的选项。

**Q: 如何自定义验证规则？**  
A: 使用 `validator` 函数，返回错误信息或空字符串。

**Q: 如何传递 Arco 组件属性？**  
A: 使用 `attrs` 对象，所有属性会透传给对应的 Arco 组件。

开始构建你的表单应用吧！🚀
