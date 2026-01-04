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
  // 所有表单字段列表（用于enterNext功能）
  allFields: {
    type: Array,
    default: () => [],
  },
  // 回车聚焦下一个字段的回调
  onEnterNext: {
    type: Function,
    default: null,
  },
});
const formSelectedKeys = reactive({});
const popupVisible = ref(false);
const emit = defineEmits(["update:modelValue", "update:selectedKeys"]);

// 支持回车的组件类型列表
const supportEnterTypes = [
  "input",
  "number",
  "textarea",
  "select",
  "date",
  "time",
  "datetime",
  "slot",
];

// 获取下一个可聚焦的字段
const getNextFocusableField = () => {
  if (!props.field.form?.enterNext || !props.allFields.length) {
    return null;
  }

  const targetDataIndex = props.field.form.enterNext;
  const currentIndex = props.allFields.findIndex(
    (f) => f.dataIndex === props.field.dataIndex
  );

  if (currentIndex === -1) {
    return null;
  }

  // 从指定的dataIndex开始查找，跳过不支持回车的组件
  let searchIndex = props.allFields.findIndex(
    (f) => f.dataIndex === targetDataIndex
  );

  if (searchIndex === -1) {
    return null;
  }

  // 找到第一个支持回车的可用字段
  while (searchIndex < props.allFields.length) {
    const nextField = props.allFields[searchIndex];
    const formConfig = nextField.form;

    // 检查该字段是否支持回车且未被禁用
    if (
      supportEnterTypes.includes(formConfig?.type) &&
      !props.isFieldDisabled(nextField)
    ) {
      return nextField.dataIndex;
    }

    searchIndex++;
  }

  return null;
};

// 处理回车事件
const handleEnter = () => {
  const nextFieldIndex = getNextFocusableField();
  if (nextFieldIndex && props.onEnterNext) {
    props.onEnterNext(nextFieldIndex);
  }
};

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
      [props.field.form.tableConfig?.rowKey || "key"]: String(
        Date.now() + Math.random()
      ),
    });
    handleUpdate(datas);
  } else if (mode == "edit") {
    let datas = props.formData[props.field.dataIndex];
    const index = datas.findIndex(
      (item) => item._rowIndex === record._rowIndex
    );
    if (index !== -1) {
      datas[index] = {
        ...datas[index],
        ...data,
      };
      handleUpdate(datas);
    }
  }
};
const dom = ref(null);

const focus = () => {
  if (dom.value) {
    if (dom.value.focus) {
      dom.value.focus();
    } else {
      let focusableElement = document
        .querySelector("#" + props.field.dataIndex)
        ?.querySelector("input");
      if (focusableElement && focusableElement.focus) {
        focusableElement.focus();
        if (
          ["select", "date", "time", "datetime"].includes(props.field.form.type)
        ) {
          popupVisible.value = true;
        }
      }
    }
  }
};

defineExpose({
  clearSelectedKeys,
  focus,
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
      :ref="(ref) => (dom = ref)"
      :model-value="formData[field.dataIndex]"
      @update:model-value="handleUpdate"
      @keydown.enter="handleEnter"
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
      :ref="(ref) => (dom = ref)"
      :model-value="formData[field.dataIndex]"
      @update:model-value="handleUpdate"
      @keydown.enter="handleEnter"
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
      :ref="(ref) => (dom = ref)"
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
      :ref="(ref) => (dom = ref)"
      :model-value="formData[field.dataIndex]"
      @update:model-value="handleUpdate"
      v-model:popup-visible="popupVisible"
      @change="handleEnter"
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
      :ref="(ref) => (dom = ref)"
      v-model:popup-visible="popupVisible"
      :model-value="formData[field.dataIndex]"
      @update:model-value="handleUpdate"
      @change="handleEnter"
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
      :ref="(ref) => (dom = ref)"
      :model-value="formData[field.dataIndex]"
      @update:model-value="handleUpdate"
      v-model:popup-visible="popupVisible"
      @change="handleEnter"
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
      :ref="(ref) => (dom = ref)"
      :model-value="formData[field.dataIndex]"
      @update:model-value="handleUpdate"
      @change="handleEnter"
      v-model:popup-visible="popupVisible"
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

  <!-- 动态插槽 -->
  <a-form-item
    v-else-if="field.form.type === 'slot' && field.form.slotName"
    :field="field.dataIndex"
    :label="field.title"
  >
    <slot
      :name="field.form.slotName"
      :domRef="(ref) => (dom = ref)"
      :field="field"
      :handleUpdate="handleUpdate"
      :handleEnter="handleEnter"
      :formData="formData"
      :disabled="isFieldDisabled(field)"
      :attrs="getFieldAttrs(field)"
    >
      <!-- 默认内容 -->
      <div style="color: red">请提供 {{ field.form.slotName }} 插槽</div>
    </slot>
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
