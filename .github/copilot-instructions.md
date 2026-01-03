# Arco Vue Table Form System - AI Coding Guidelines

## Project Overview
This is a Vue 3 + Vite project implementing a universal Arco Design form component system integrated with data tables. The core architecture consists of three main components:

- `Table.vue`: Main table component with integrated form functionality
- `TableForm.vue`: Standalone form component supporting 11 control types
- `TableExample.vue`: Comprehensive usage examples and configuration reference

## Key Architecture Patterns

### Form Configuration in Columns
Form fields are defined within table column configurations using a `form` property:

```javascript
{
  title: '姓名',
  dataIndex: 'name',
  form: {
    type: 'input',           // Control type: input, select, number, date, etc.
    required: true,          // Built-in validation
    creatable: true,         // Show in create mode
    editable: true,          // Show in edit mode
    disabled: false,         // Can be function: (formData, field) => boolean
    options: [],             // For select/radio/checkbox, can be function
    defaultValue: null,
    placeholder: '提示',
    attrs: {},               // Pass-through to Arco components
    validator: (value) => '', // Custom validation function
  },
}
```

### Form Event Handling
Forms emit structured data on submission:

```javascript
// Listen for form submissions
<ArcoTable @form-submit="handleFormSubmit" />

const handleFormSubmit = (data) => {
  // data: { mode: 'create'|'edit', data: formValues, record: originalRecord }
};
```

### State Management
Use Vue 3's `reactive` for component state, especially for complex table configurations:

```javascript
const tableConfig = reactive({
  columns: [...],
  showForm: true,
  paginationType: 'frontend', // or 'backend'
  // ... other config
});
```

## Supported Form Controls
- `input`: Text input with max-length, allow-clear
- `number`: Numeric input with min/max/step
- `textarea`: Multi-line text with show-word-limit
- `select`: Dropdown with search, multiple selection
- `radio`: Radio buttons
- `checkbox`: Checkboxes (returns array)
- `date`: Date picker
- `time`: Time picker
- `datetime`: Date-time picker
- `switch`: Boolean toggle
- `slider`: Numeric range slider

## Table Configuration Patterns

### Column Definitions
```javascript
columns: [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 120,
    visible: true,
    sortable: { compare: (a, b) => a.localeCompare(b) },
    form: { /* form config */ },
  },
]
```

### Actions Configuration
```javascript
actions: [
  {
    key: 'edit',
    label: '编辑',
    icon: 'edit',
    callback: (records) => { /* handle */ },
  },
  {
    key: 'delete',
    status: 'danger',
    type: 'confirm',
    confirmMessage: '确定删除?',
    apiUrl: '/api/delete',
    params: (records) => ({ ids: records.map(r => r.key) }),
  },
]
```

## Development Workflow

### Running the Project
```bash
npm run dev    # Start dev server
npm run build  # Production build
npm run preview # Preview build
```

### Adding New Form Fields
1. Add form config to column definition in `TableExample.vue`
2. Update sample data structure if needed
3. Test both create and edit modes
4. Add validation if required

### Extending Form Controls
1. Add new control type to `TableForm.vue`
2. Update type checking and rendering logic
3. Add to documentation in component README
4. Test with various attrs and validation

## Code Style Conventions

### Vue Component Structure
- Use `<script setup>` syntax
- Import Arco components: `import { Button, Message } from '@arco-design/web-vue'`
- Use `reactive` for complex state objects
- Emit events with kebab-case: `@form-submit`
- Use PascalCase for component names: `TableForm.vue`

### Naming Patterns
- Event handlers: `handleFormSubmit`, `handleActionClick`
- State variables: `tableData`, `loading`, `formVisible`
- Configuration objects: `tableConfig`, `columnConfig`

### Validation Patterns
```javascript
// Email validation
validator: (value) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value) ? '' : '请输入有效邮箱';
}

// Conditional validation
disabled: (formData) => formData.status === 'inactive'
```

## Integration Points

### External Dependencies
- `@arco-design/web-vue`: UI component library
- `vue`: Framework (v3.5+)
- `vite`: Build tool

### API Integration
For backend pagination, implement `handleApiRequest`:

```javascript
const handleApiRequest = async (params) => {
  const response = await fetch('/api/employees', {
    method: 'POST',
    body: JSON.stringify(params)
  });
  // Update tableData with response
};
```

## Common Patterns to Follow

### Dynamic Options
```javascript
options: (formData, field) => {
  return formData.department === 'tech' 
    ? [{ label: 'Vue', value: 'vue' }]
    : [{ label: 'Sales', value: 'sales' }];
}
```

### Conditional Field Display
```javascript
creatable: true,  // Show when creating
editable: false,  // Hide when editing
```

### Custom Validation with Context
```javascript
validator: (value, field) => {
  if (field.dataIndex === 'endDate' && value < field.formData.startDate) {
    return '结束日期不能早于开始日期';
  }
  return '';
}
```

## Reference Files
- `src/components/TableExample.vue`: Complete usage examples
- `src/components/README.md`: Project overview and architecture
- `src/components/FORM_CONFIG.md`: Detailed form configuration guide
- `src/components/FORM_INTEGRATION.md`: Integration patterns