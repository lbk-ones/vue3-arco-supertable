# 搜索字段配置类型定义

TypeScript 类型定义（供参考）：

```typescript
/**
 * 搜索字段配置
 */
interface SearchField {
  /** 字段名（必填） */
  dataIndex: string;
  
  /** 显示标题（必填） */
  title: string;
  
  /** 控件类型（可选，默认为 'input'） */
  type?: 'input' | 'number' | 'select' | 'radio' | 'checkbox' | 'date' | 'date-range' | 'switch';
  
  /** 占位符文本（可选） */
  placeholder?: string | string[];
  
  /** 选项列表（select/radio/checkbox 需要） */
  options?: SearchOption[] | ((searchValues: Record<string, any>, field: SearchField) => SearchOption[]);
  
  /** 透传属性（可选） */
  attrs?: Record<string, any>;
}

/**
 * 搜索选项
 */
interface SearchOption {
  /** 显示文本（必填） */
  label: string;
  
  /** 选项值（必填） */
  value: any;
  
  /** 是否禁用（可选） */
  disabled?: boolean;
}

/**
 * 搜索值对象
 */
type SearchValues = Record<string, any>;
```

## 类型说明详解

### SearchField 接口

所有搜索字段都应该遵循这个接口的约定。

#### 必填字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `dataIndex` | string | 对应表格数据的字段名，必须与表格数据结构中的字段保持一致 |
| `title` | string | 搜索字段的显示标题，会在搜索条件区域显示 |

#### 可选字段

| 字段 | 类型 | 默认值 | 说明 |
|------|------|-------|------|
| `type` | string | 'input' | 控件类型，影响搜索条件的渲染方式和搜索逻辑 |
| `placeholder` | string \| string[] | 自动生成 | 占位符，对于 date-range 可以是数组 |
| `options` | 数组 \| 函数 | [] | 用于 select/radio/checkbox，可以是动态函数 |
| `attrs` | object | {} | Arco Design 组件的自定义属性 |

## 各类型字段的完整配置示例

### 1. Input 类型

```typescript
const inputField: SearchField = {
  dataIndex: 'keyword',        // 必填
  title: '关键词',              // 必填
  type: 'input',               // 可选，默认就是 input
  placeholder: '输入关键词',    // 可选
  attrs: {                     // 可选
    'max-length': 100,
    'show-word-limit': true,
  }
};
```

### 2. Number 类型

```typescript
const numberField: SearchField = {
  dataIndex: 'price',
  title: '价格',
  type: 'number',
  placeholder: '输入价格范围',
  attrs: {
    min: 0,
    max: 10000,
    step: 100,
    precision: 2,
  }
};
```

### 3. Select 类型（静态选项）

```typescript
const selectField: SearchField = {
  dataIndex: 'category',
  title: '分类',
  type: 'select',
  placeholder: '选择分类',
  options: [
    { label: '电子产品', value: 'electronics' },
    { label: '服装', value: 'clothing' },
    { label: '食品', value: 'food' },
  ],
  attrs: {
    'allow-clear': true,
    'allow-search': true,
  }
};
```

### 4. Select 类型（动态选项）

```typescript
const dynamicSelectField: SearchField = {
  dataIndex: 'subcategory',
  title: '子分类',
  type: 'select',
  placeholder: '选择子分类',
  options: (searchValues: Record<string, any>, field: SearchField) => {
    const category = searchValues.category;
    
    const categoryMap: Record<string, SearchOption[]> = {
      electronics: [
        { label: '手机', value: 'phone' },
        { label: '平板', value: 'tablet' },
      ],
      clothing: [
        { label: '上衣', value: 'top' },
        { label: '裤子', value: 'pants' },
      ],
    };
    
    return categoryMap[category] || [];
  },
  attrs: {
    'allow-clear': true,
  }
};
```

### 5. Radio 类型

```typescript
const radioField: SearchField = {
  dataIndex: 'status',
  title: '状态',
  type: 'radio',
  options: [
    { label: '上架', value: 'online' },
    { label: '下架', value: 'offline' },
  ],
  attrs: {
    direction: 'horizontal',  // 水平排列
  }
};
```

### 6. Checkbox 类型

```typescript
const checkboxField: SearchField = {
  dataIndex: 'features',
  title: '功能特性',
  type: 'checkbox',
  options: [
    { label: '包邮', value: 'free_shipping' },
    { label: '7天退货', value: 'return_7_days' },
    { label: '质保', value: 'warranty' },
  ],
  attrs: {
    direction: 'horizontal',
  }
};
```

### 7. Date 类型

```typescript
const dateField: SearchField = {
  dataIndex: 'createdDate',
  title: '创建日期',
  type: 'date',
  placeholder: '选择创建日期',
  attrs: {
    format: 'YYYY-MM-DD',
    'show-time': false,
  }
};
```

### 8. DateRange 类型

```typescript
const dateRangeField: SearchField = {
  dataIndex: 'dateRange',
  title: '时间范围',
  type: 'date-range',
  placeholder: ['开始日期', '结束日期'],
  attrs: {
    format: 'YYYY-MM-DD',
    'show-time': false,
  }
};
```

### 9. Switch 类型

```typescript
const switchField: SearchField = {
  dataIndex: 'isActive',
  title: '是否激活',
  type: 'switch',
  attrs: {
    'checked-text': '激活',
    'unchecked-text': '禁用',
  }
};
```

## SearchOption 接口

表示选项列表中的每个选项。

```typescript
interface SearchOption {
  label: string;              // 显示文本（必填）
  value: any;                 // 选项值（必填）
  disabled?: boolean;         // 是否禁用（可选）
}
```

### 完整例子

```typescript
const options: SearchOption[] = [
  {
    label: '管理员',
    value: 'admin',
    disabled: false
  },
  {
    label: '编辑',
    value: 'editor',
    disabled: false
  },
  {
    label: '查看者',
    value: 'viewer',
    disabled: false
  },
  {
    label: '已禁用（示例）',
    value: 'disabled-role',
    disabled: true  // 此选项在界面上显示但不可选
  },
];
```

## 搜索值类型 (SearchValues)

搜索值是一个键值对象，其中：
- **键**: 对应 `SearchField` 的 `dataIndex`
- **值**: 根据字段类型而定

```typescript
// 示例搜索值
const searchValues: SearchValues = {
  keyword: 'javascript',        // input 类型 - 字符串
  price: 99,                    // number 类型 - 数字
  category: 'electronics',      // select 类型 - 单个值
  features: ['free_shipping'],  // checkbox 类型 - 数组
  status: 'online',             // radio 类型 - 单个值
  createdDate: '2024-01-01',   // date 类型 - 日期字符串
  dateRange: [                  // date-range 类型 - 日期数组
    '2024-01-01',
    '2024-12-31'
  ],
  isActive: true,               // switch 类型 - 布尔值
};
```

## Attrs 类型

`attrs` 是一个通用的对象类型，包含要透传给 Arco Design 组件的所有属性。

```typescript
/**
 * Arco Design 组件通用属性
 */
interface ComponentAttrs {
  // 通用属性
  disabled?: boolean;
  'allow-clear'?: boolean;
  size?: 'small' | 'medium' | 'large';
  
  // input 特定
  'max-length'?: number;
  'show-word-limit'?: boolean;
  prefix?: string;
  
  // number 特定
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  mode?: 'button' | 'embed';
  
  // select 特定
  multiple?: boolean;
  'allow-search'?: boolean;
  
  // date/date-range 特定
  format?: string;
  'show-time'?: boolean;
  
  // radio/checkbox 特定
  direction?: 'horizontal' | 'vertical';
  
  // switch 特定
  'checked-text'?: string;
  'unchecked-text'?: string;
  
  // 其他 Arco Design 支持的属性...
  [key: string]: any;
}
```

## 实际使用建议

### 1. 类型安全（如果使用 TypeScript）

```typescript
import { reactive } from 'vue';

interface TableConfig {
  searchFields: SearchField[];
  // ... 其他配置
}

const tableConfig: TableConfig = reactive({
  searchFields: [
    {
      dataIndex: 'name',
      title: '姓名',
      type: 'input',
      attrs: {
        'max-length': 50,
      }
    },
  ]
});
```

### 2. 动态属性（使用 computed）

```typescript
import { computed, ref } from 'vue';

const editMode = ref(false);

const searchFields = computed(() => [
  {
    dataIndex: 'name',
    title: '姓名',
    type: 'input',
    attrs: {
      disabled: !editMode.value,  // 动态禁用
    }
  }
]);
```

### 3. 可复用配置工厂函数

```typescript
function createSearchField(
  dataIndex: string,
  title: string,
  type: string = 'input',
  attrs?: Record<string, any>
): SearchField {
  return {
    dataIndex,
    title,
    type,
    attrs: {
      'allow-clear': true,      // 默认属性
      ...attrs                   // 合并传入属性
    }
  };
}

// 使用
const searchFields = [
  createSearchField('name', '姓名', 'input', { 'max-length': 50 }),
  createSearchField('age', '年龄', 'number', { min: 0, max: 100 }),
];
```
