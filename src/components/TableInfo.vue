<template>
  <a-modal
    :visible="visible"
    title="表格配置详情"
    @update:visible="handleVisibleChange"
    :footer="false"
    width="800px"
    class="table-info-modal"
  >
    <!-- 头部信息：版本和存储状态 -->
    <div class="info-header">
      <div class="info-card">
        <div class="label">组件版本</div>
        <div class="value version-tag">v{{ version }}</div>
      </div>
      <div class="info-card">
        <div class="label">本地存储</div>
        <div class="value">
          <a-tag :color="config.enableLocalStorage ? 'green' : 'gray'">
            {{ config.enableLocalStorage ? "已开启" : "未开启" }}
          </a-tag>
        </div>
      </div>
      <div class="info-card" v-if="config.uniqueId">
        <div class="label">唯一标识</div>
        <div class="value code-font">{{ config.uniqueId }}</div>
      </div>
    </div>

    <a-divider orientation="left">详细配置参数</a-divider>

    <!-- 配置列表 -->
    <div class="config-grid">
      <div
        v-for="(value, key) in filteredConfig"
        :key="key"
        class="config-item"
      >
        <div class="config-key" :title="key">{{ key }}</div>
        <div class="config-value" :title="formatValue(value)">
          {{ formatValue(value) }}
        </div>
      </div>
    </div>

    <!-- 底部关闭按钮 -->
    <div class="modal-footer">
      <a-button type="outline" @click="close">关闭</a-button>
    </div>
  </a-modal>
</template>

<script setup>
import { computed } from "vue";
import pkg from "../../package.json";

const { version } = pkg;

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  config: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:visible"]);

const excludedKeys = [
  "columns",
  "searchFields",
  "pageApiUrl",
  "formAddApiUrl",
  "formUpdateApiUrl",
  "formDeleteApiUrl",
  "actions",
  "tablePaginationAttrs",
  "executeAction",
  "pageFetchData",
  "handleFormSubmit",
  "handleSearch",
  "handlePageChange",
  "handleColumnConfigChange",
];

const filteredConfig = computed(() => {
  const result = {};
  if (!props.config) return result;

  Object.keys(props.config).forEach((key) => {
    if (!excludedKeys.includes(key)) {
      result[key] = props.config[key];
    }
  });
  return result;
});

const handleVisibleChange = (val) => {
  emit("update:visible", val);
};

const close = () => {
  emit("update:visible", false);
};

const formatValue = (val) => {
  if (val === null) return "null";
  if (val === undefined) return "undefined";
  if (typeof val === "boolean") return val ? "true" : "false";
  if (typeof val === "object") {
    try {
      return JSON.stringify(val);
    } catch (e) {
      return "[Object]";
    }
  }
  return String(val);
};
</script>

<style scoped>
.info-header {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  background: #f7f8fa;
  padding: 16px;
  border-radius: 4px;
}

.info-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-card .label {
  font-size: 16px;
  color: #000;
  font-weight: bolder;
}

.info-card .value {
  font-size: 16px;
  font-weight: 500;
  color: #1d2129;
}

.version-tag {
  color: #165dff !important;
  font-family: monospace;
}

.code-font {
  font-family: monospace;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
}

.config-item {
  border: 1px solid #e5e6eb;
  border-radius: 4px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.2s;
}

.config-item:hover {
  border-color: #165dff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.config-key {
  font-size: 12px;
  color: #86909c;
  font-weight: 500;
  word-break: break-all;
}

.config-value {
  font-size: 14px;
  color: #1d2129;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e6eb;
}

/* 滚动条美化 */
.config-grid::-webkit-scrollbar {
  width: 6px;
}

.config-grid::-webkit-scrollbar-thumb {
  background: #c9cdd4;
  border-radius: 3px;
}

.config-grid::-webkit-scrollbar-track {
  background: transparent;
}
</style>
