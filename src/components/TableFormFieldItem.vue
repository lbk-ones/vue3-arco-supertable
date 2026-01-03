<script setup>
import SuperTable from "./Table.vue";
import { onMounted, reactive, ref, watch } from "vue";
// Props 定义
const props = defineProps({
  // 字段配置
  field: {
    type: Object,
    required: true,
  },
  // 表单数据
  formData: {
    type: Object,
    required: true,
  },
  // 表单错误
  formErrors: {
    type: Object,
    required: true,
  },
  // 是否禁用字段的方法
  isFieldDisabled: {
    type: Function,
    required: true,
  },
  // 获取选项的方法
  getOptions: {
    type: Function,
    required: true,
  },
  // 获取字段属性的方法
  getFieldAttrs: {
    type: Function,
    required: true,
  },
  // 字段值更新回调
  modelValue: {
    type: [String, Number, Boolean, Array, Object, Date],
    default: null,
  },
  selectedKeys: {
    type: Array,
    default: () => [],
  },
});
const formSelectedKeys = reactive({});
const emit = defineEmits(["update:modelValue", "update:selectedKeys"]);

onMounted(() => {
  // 初始化表格字段的 selectedKeys
  if (props.field.form.type === "table") {
    formSelectedKeys[props.field.dataIndex] = [];
  }
});
const handleUpdate = (value) => {
  emit("update:modelValue", value);
};
const clearSelectedKeys = () => {
  if (props.field.form.type === "table") {
    formSelectedKeys[props.field.dataIndex] = [];
  }
};

// 表单提交事件 - 处理新增和编辑逻辑
const handleFormSubmit = async ({ config, mode, data, record }) => {
  // config 是这个tableConfig的对象
  // mode 是新增还是编辑或者是其他的
  // data 是表单提交的数据
  // record 是当前编辑的行数据，新增时为 null
  if (mode == "create") {
    let datas = props.formData[props.field.dataIndex];
    datas.push({
      ...data,
      _rowIndex: datas.length,
      [props.field.form.tableConfig?.rowKey || "key"]: String(Date.now() + Math.random()),
    });
    handleUpdate(datas);
  } else if (mode == "edit") {
    let datas = props.formData[props.field.dataIndex];
    const index = datas.findIndex((item) => item._rowIndex === record._rowIndex);
    if (index !== -1) {
      datas[index] = {
        ...datas[index],
        ...data,
      };
      handleUpdate(datas);
    }
  }
};

defineExpose({
  clearSelectedKeys,
});
</script>

<template>
  <!-- 隐藏字段处理 -->
  <div v-if="field.form.type === 'hidden'" style="display: none">
    <input :value="formData[field.dataIndex]" type="hidden" />
  </div>

  <!-- 文本输入框 -->
  <a-form-item
    v-else-if="field.form.type === 'input' || !field.form.type"
    :field="field.dataIndex"
    :label="field.title"
    :validate-status="formErrors[field.dataIndex] ? 'error' : ''"
    :help="formErrors[field.dataIndex]"
  >
    <a-input
      :model-value="formData[field.dataIndex]"
      @update:model-value="handleUpdate"
      :disabled="isFieldDisabled(field)"
      v-bind="getFieldAttrs(field)"
    />
  </a-form-item>

  <!-- 数字输入框 -->
  <a-form-item
    v-else-if="field.form.type === 'number'"
    :field="field.dataIndex"
    :label="field.title"
    :validate-status="formErrors[field.dataIndex] ? 'error' : ''"
    :help="formErrors[field.dataIndex]"
  >
    <a-input-number
      :model-value="formData[field.dataIndex]"
      @update:model-value="handleUpdate"
      :disabled="isFieldDisabled(field)"
      v-bind="getFieldAttrs(field)"
    />
  </a-form-item>

  <!-- 文本域 -->
  <a-form-item
    v-else-if="field.form.type === 'textarea'"
    :field="field.dataIndex"
    :label="field.title"
    :validate-status="formErrors[field.dataIndex] ? 'error' : ''"
    :help="formErrors[field.dataIndex]"
  >
    <a-textarea
      :model-value="formData[field.dataIndex]"
      @update:model-value="handleUpdate"
      :disabled="isFieldDisabled(field)"
      v-bind="getFieldAttrs(field)"
    />
  </a-form-item>

  <!-- 复选框 -->
  <a-form-item
    v-else-if="field.form.type === 'checkbox'"
    :field="field.dataIndex"
    :label="field.title"
  >
    <a-checkbox-group
      :model-value="formData[field.dataIndex]"
      @update:model-value="handleUpdate"
      :disabled="isFieldDisabled(field)"
      v-bind="getFieldAttrs(field)"
    >
      <a-checkbox
        v-for="option in getOptions(field)"
        :key="option.value"
        :value="option.value"
        :disabled="
          typeof option.disabled === 'function'
            ? option.disabled(formData, field)
            : option.disabled
        "
      >
        {{ option.label }}
      </a-checkbox>
    </a-checkbox-group>
  </a-form-item>

  <!-- 单选框 -->
  <a-form-item
    v-else-if="field.form.type === 'radio'"
    :field="field.dataIndex"
    :label="field.title"
  >
    <a-radio-group
      :model-value="formData[field.dataIndex]"
      @update:model-value="handleUpdate"
      :disabled="isFieldDisabled(field)"
      v-bind="getFieldAttrs(field)"
    >
      <a-radio
        v-for="option in getOptions(field)"
        :key="option.value"
        :value="option.value"
        :disabled="
          typeof option.disabled === 'function'
            ? option.disabled(formData, field)
            : option.disabled
        "
      >
        {{ option.label }}
      </a-radio>
    </a-radio-group>
  </a-form-item>

  <!-- 下拉选择框 -->
  <a-form-item
    v-else-if="field.form.type === 'select'"
    :field="field.dataIndex"
    :label="field.title"
    :validate-status="formErrors[field.dataIndex] ? 'error' : ''"
    :help="formErrors[field.dataIndex]"
  >
    <a-select
      :model-value="formData[field.dataIndex]"
      @update:model-value="handleUpdate"
      :disabled="isFieldDisabled(field)"
      v-bind="getFieldAttrs(field)"
    >
      <a-option
        v-for="option in getOptions(field)"
        :key="option.value"
        :value="option.value"
        :disabled="
          typeof option.disabled === 'function'
            ? option.disabled(formData, field)
            : option.disabled
        "
      >
        {{ option.label }}
      </a-option>
    </a-select>
  </a-form-item>

  <!-- 日期选择器 -->
  <a-form-item
    v-else-if="field.form.type === 'date'"
    :field="field.dataIndex"
    :label="field.title"
    :validate-status="formErrors[field.dataIndex] ? 'error' : ''"
    :help="formErrors[field.dataIndex]"
  >
    <a-date-picker
      :model-value="formData[field.dataIndex]"
      @update:model-value="handleUpdate"
      :disabled="isFieldDisabled(field)"
      v-bind="getFieldAttrs(field)"
    />
  </a-form-item>

  <!-- 时间选择器 -->
  <a-form-item
    v-else-if="field.form.type === 'time'"
    :field="field.dataIndex"
    :label="field.title"
    :validate-status="formErrors[field.dataIndex] ? 'error' : ''"
    :help="formErrors[field.dataIndex]"
  >
    <a-time-picker
      :model-value="formData[field.dataIndex]"
      @update:model-value="handleUpdate"
      :disabled="isFieldDisabled(field)"
      v-bind="getFieldAttrs(field)"
    />
  </a-form-item>

  <!-- 日期时间选择器 -->
  <a-form-item
    v-else-if="field.form.type === 'datetime'"
    :field="field.dataIndex"
    :label="field.title"
    :validate-status="formErrors[field.dataIndex] ? 'error' : ''"
    :help="formErrors[field.dataIndex]"
  >
    <a-date-picker
      :model-value="formData[field.dataIndex]"
      @update:model-value="handleUpdate"
      show-time
      :disabled="isFieldDisabled(field)"
      v-bind="getFieldAttrs(field)"
    />
  </a-form-item>

  <!-- 开关 -->
  <a-form-item
    v-else-if="field.form.type === 'switch'"
    :field="field.dataIndex"
    :label="field.title"
  >
    <a-switch
      :model-value="formData[field.dataIndex]"
      @update:model-value="handleUpdate"
      :disabled="isFieldDisabled(field)"
      v-bind="getFieldAttrs(field)"
    />
  </a-form-item>

  <!-- 滑块 -->
  <a-form-item
    v-else-if="field.form.type === 'slider'"
    :field="field.dataIndex"
    :label="field.title"
  >
    <a-slider
      :model-value="formData[field.dataIndex]"
      @update:model-value="handleUpdate"
      :disabled="isFieldDisabled(field)"
      v-bind="getFieldAttrs(field)"
    />
  </a-form-item>

  <!-- 表格 -->
  <a-form-item
    v-else-if="field.form.type === 'table'"
    :field="field.dataIndex"
    :label="field.title"
    class="table-form-item"
  >
    <SuperTable
      :isFormItem="true"
      :table-disabled="isFieldDisabled(field)"
      :config="{
        ...(field.form?.tableConfig ?? {}),
        handleFormSubmit: handleFormSubmit,
        executeAction: async (action, records, params) => {
          if (action.key == 'delete') {
            let datas = formData[field.dataIndex];
            datas.splice(records._rowIndex, 1);
            handleUpdate(datas);
          }
        },
      }"
      :data="formData[field.dataIndex] || []"
      :loading="field.form.tableConfig?.loading"
      :selectedKeys="formSelectedKeys[field.dataIndex]"
      @update:selectedKeys="
        (val) => {
          formSelectedKeys[field.dataIndex] = val;
        }
      "
    />
  </a-form-item>
</template>
