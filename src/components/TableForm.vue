<script setup>
import TableFormFieldItem from "./TableFormFieldItem.vue";
import { reactive, ref, computed, onMounted, watch } from "vue";
import { Message, Modal } from "@arco-design/web-vue";

// Props 定义
const props = defineProps({
  // 列配置（来自 Table 组件）
  columns: {
    type: Array,
    required: true,
  },
  // 编辑的数据记录（如果是修改模式）
  record: {
    type: Object,
    default: null,
  },
  // 是否显示弹窗
  visible: {
    type: Boolean,
    default: false,
  },
  // 模式：'create'、'edit' 或 'readonly'
  mode: {
    type: String,
    default: "create",
    validator: (value) => ["create", "edit", "readonly"].includes(value),
  },
  // 提交 API 配置
  apiConfig: {
    type: Object,
    default: () => ({}),
  },
  // 表单布局：'vertical' 或 'horizontal'
  formLayout: {
    type: String,
    default: "vertical",
    validator: (value) => ["vertical", "horizontal"].includes(value),
  },
  // 表单列数（用于行布局时的列数）
  formColumns: {
    type: Number,
    default: 3,
  },
  // 列与列之间的间距（用于行布局时的列数）
  formColGap: {
    type: Number,
    default: 10,
  },
  // 行与行之间的间距（用于行布局时的列数）
  formRowGap: {
    type: Number,
    default: 10,
  },
  // 弹窗宽度
  modalWidth: {
    type: Number,
    default: 800,
  },
  selectedKeys: {
    type: Array,
    default: () => [],
  },
});

// Emits 定义
const emit = defineEmits([
  "update:visible", // 更新弹窗显示状态
  "update:selectedKeys", // 更新选中的行
  "submit", // 提交表单数据
  "success", // 提交成功
  "error", // 提交失败
]);
// 表单状态
const state = reactive({
  formData: {}, // 表单数据
  formLoading: false, // 提交中
  formErrors: {}, // 表单错误
  refMap: {}, // 每一个表单的 ref引用
});

// 获取可见的表单字段（有 form 配置的字段）
const formFields = computed(() => {
  return props.columns.filter((col) => col.form);
});

// 获取当前模式下可用的字段
const availableFields = computed(() => {
  return formFields.value.filter((field) => {
    const formConfig = field.form;

    if (props.mode === "readonly") {
      // 只读模式显示所有有form配置的字段
      return true;
    } else if (props.mode === "create") {
      return formConfig.creatable !== false;
    } else {
      return formConfig.editable !== false;
    }
  });
});

// 初始化表单数据
const initializeFormData = () => {
  state.formData = {};
  state.formErrors = {};

  if ((props.mode === "edit" || props.mode === "readonly") && props.record) {
    // 编辑/只读模式：从 record 中获取数据
    // 使用 formFields（所有有form配置的字段）而不是 availableFields
    formFields.value.forEach((field) => {
      state.formData[field.dataIndex] = JSON.parse(
        JSON.stringify(props.record[field.dataIndex])
      );
    });
  } else {
    // 新增模式：初始化空值
    availableFields.value.forEach((field) => {
      const formConfig = field.form;
      formConfig.type === "table"
        ? (state.formData[field.dataIndex] = [])
        : (state.formData[field.dataIndex] = formConfig.defaultValue ?? null);
    });
  }
};

// 检查字段是否禁用
const isFieldDisabled = (field) => {
  // 只读模式下所有字段都禁用
  if (props.mode === "readonly") {
    return true;
  }

  const formConfig = field.form;
  const disabled = formConfig.disabled;

  if (typeof disabled === "function") {
    return disabled(state.formData, field);
  }
  return disabled === true;
};

// 获取下拉选项
const getOptions = (field) => {
  const formConfig = field.form;
  let options = formConfig.options;

  if (typeof options === "function") {
    return options(state.formData, field);
  }
  return options || [];
};

// 获取表单控件的属性
const getFieldAttrs = (field) => {
  const formConfig = field.form;
  return {
    ...formConfig.attrs,
    placeholder:
      formConfig.placeholder ||
      `请${formConfig.type === "select" ? "选择" : "输入"}${field.title}`,
  };
};
/**
 * 检查一个值是否为空。
 *
 * @param {*} value - 需要检查的值。
 * @returns {boolean} - 如果值为空，则返回 true；否则返回 false。
 */
function isEmpty(value) {
  // 1. 处理 null 和 undefined
  if (value === null || value === undefined) {
    return true;
  }

  // 2. 处理布尔值
  if (typeof value === "boolean") {
    return false;
  }

  // 3. 处理数字
  if (typeof value === "number") {
    // 0 不是空，但 NaN 是空
    return isNaN(value);
  }

  // 4. 处理字符串
  if (typeof value === "string") {
    return value.length === 0;
  }

  // 5. 处理函数
  if (typeof value === "function") {
    return false;
  }

  // 6. 处理数组、类数组对象、Map、Set
  if (typeof value.length === "number") {
    return value.length === 0;
  }
  if (typeof value.size === "number") {
    return value.size === 0;
  }

  // 7. 处理普通对象
  // 检查是否是一个对象，并且没有自己的可枚举属性
  if (typeof value === "object" && value.constructor === Object) {
    return Object.keys(value).length === 0;
  }

  // 8. 对于其他所有类型（如 Symbol, Date, 自定义类实例等），都不认为是空
  return false;
}
// 验证表单
const validateForm = () => {
  state.formErrors = {};
  let isValid = true;

  availableFields.value.forEach((field) => {
    const formConfig = field.form;
    const value = state.formData[field.dataIndex];

    // 必填验证
    if (formConfig.required && isEmpty(value)) {
      state.formErrors[field.dataIndex] = `${field.title}为必填项`;
      isValid = false;
    }

    // 自定义验证
    if (formConfig.validator) {
      const error = formConfig.validator(value, field);
      if (error) {
        state.formErrors[field.dataIndex] = error;
        isValid = false;
      }
    }
  });

  return isValid;
};
// 触发提交前的验证
const onOkBefore = () => {
  // 只读模式直接关闭
  if (props.mode === "readonly") {
    emit("update:visible", false);
    return false;
  }

  if (!validateForm()) {
    let errors = [];
    Object.keys(state.formErrors).forEach((key) => {
      errors.push(state.formErrors[key]);
    });
    Message.error(errors.join(", "));
    return false;
  }
  return true;
};
// 提交表单
const handleSubmit = () => {
  state.formLoading = true;

  try {
    // 整理提交数据
    const submitData = {
      ...state.formData,
    };

    // 如果是编辑模式，添加 id
    if (props.mode === "edit" && props.record) {
      submitData.key = props.record.key;
    }

    // 触发提交事件，让父组件处理 API 调用
    emit("submit", {
      mode: props.mode,
      data: submitData,
      record: props.record,
    });

    // 模拟 API 调用（可由父组件自定义）
    if (props.apiConfig.url) {
      const method = props.mode === "create" ? "POST" : "PUT";
      // 这里应该由父组件通过事件处理 API 调用
      Message.success(props.mode === "create" ? "新增成功" : "修改成功");

      emit("success", submitData);
      handleCancel();
    }
  } catch (error) {
    Message.error(error.message || "提交失败");
    emit("error", error);
  } finally {
    state.formLoading = false;
  }
};

// 取消表单
const handleCancel = () => {
  emit("update:visible", false);
  state.formData = {};
  state.formErrors = {};
  Object.keys(state.refMap).forEach((key) => {
    const refComp = state.refMap[key];
    if (refComp && refComp.clearSelectedKeys) {
      refComp.clearSelectedKeys();
    }
  });
};

// 监听 visible 和 record 变化
onMounted(() => {
  initializeFormData();
});

// 监听弹窗显示、模式、记录变化
watch(
  () => [props.visible, props.mode, props.record],
  () => {
    if (props.visible) {
      initializeFormData();
    }
  },
  { deep: true }
);

// 暴露更新方法给父组件（如果需要手动更新）
defineExpose({
  initializeFormData,
});
</script>

<template>
  <a-modal
    :visible="visible"
    :title="
      mode === 'create' ? '新增记录' : mode === 'readonly' ? '查看详情' : '编辑记录'
    "
    @update:visible="(val) => $emit('update:visible', val)"
    :ok-text="mode === 'readonly' ? '关闭' : '确定'"
    @ok="handleSubmit"
    :on-before-ok="onOkBefore"
    @cancel="handleCancel"
    :ok-loading="formLoading"
    :width="modalWidth"
    :hide-cancel="mode === 'readonly'"
  >
    <a-form
      :model="state.formData"
      layout="vertical"
      :validate-trigger="['change', 'blur']"
      class="horizontal-form"
    >
      <!-- 行布局模式 (水平并排) -->
      <a-grid
        v-if="formLayout === 'horizontal'"
        :col-gap="formColGap"
        :row-gap="formRowGap"
        :cols="formColumns"
        class="horizontal-form-grid"
      >
        <a-grid-item
          v-for="field in availableFields"
          :key="field.dataIndex"
          :span="field.form.type === 'table' ? formColumns : 1"
          class="horizontal-form-item"
        >
          <!-- 表单字段渲染（共用组件） -->
          <table-form-field-item
            :ref="
              (re) =>
                field?.form?.type === 'table'
                  ? (state.refMap[field.dataIndex] = re)
                  : null
            "
            :field="field"
            :form-data="state.formData"
            :form-errors="state.formErrors"
            :is-field-disabled="isFieldDisabled"
            :get-options="getOptions"
            :get-field-attrs="getFieldAttrs"
            :model-value="state.formData[field.dataIndex]"
            @update:model-value="(val) => (state.formData[field.dataIndex] = val)"
            :selectedKeys="props.selectedKeys"
            @update:selectedKeys="(val) => emit('update:selectedKeys', val)"
          />
        </a-grid-item>
      </a-grid>
    </a-form>

    <!-- 列布局模式（默认） -->
    <a-form
      v-if="formLayout === 'vertical'"
      :model="state.formData"
      layout="vertical"
      :validate-trigger="['change', 'blur']"
    >
      <!-- 表单字段 -->
      <template v-for="field in availableFields" :key="field.dataIndex">
        <!-- 表单字段渲染（共用组件） -->
        <!-- selectedKeys 父级选中的行 -->
        <table-form-field-item
          :ref="(re) => (state.refMap[field.dataIndex] = re)"
          :field="field"
          :form-data="state.formData"
          :form-errors="state.formErrors"
          :is-field-disabled="isFieldDisabled"
          :get-options="getOptions"
          :get-field-attrs="getFieldAttrs"
          :model-value="state.formData[field.dataIndex]"
          @update:model-value="(val) => (state.formData[field.dataIndex] = val)"
          :selectedKeys="props.selectedKeys"
          @update:selectedKeys="(val) => emit('update:selectedKeys', val)"
        />
      </template>
    </a-form>
  </a-modal>
</template>

<style scoped>
:deep(.arco-form-item) {
  margin-bottom: 16px;
}

:deep(.arco-form-item:last-child) {
  margin-bottom: 0;
}

/* 水平布局样式 */
:deep(.horizontal-form-grid) {
  margin-bottom: 16px;
}

:deep(.horizontal-form-item) {
  width: 100%;
  /* padding-right: 12px; */
  padding-bottom: 12px;
}

:deep(.horizontal-form) {
  width: 100%;
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  background-color: #fafafa;
}

:deep(.horizontal-form .arco-form-item) {
  margin-bottom: 0;
}

/* 表格表单项样式 */
:deep(.table-form-item) {
  grid-column: 1 / -1;
}

:deep(.table-form-item .arco-form-item-content) {
  width: 100%;
}
</style>
