<script setup>
import { ref, watch, defineProps } from 'vue';

const props = defineProps({
  config: {
    type: Object,
    required: true
  }
});

// 递归弹窗控制
const nestedVisible = ref(false);
const currentNestedConfig = ref(null);

const openNestedConfig = (formConfig) => {
  if (!formConfig.tableConfig) {
    // 初始化默认子表格配置
    formConfig.tableConfig = {
      columns: [
        { title: '示例列', dataIndex: 'example', width: 100, visible: true, form: { type: 'input' } }
      ],
      paginationType: 'frontend',
      pageSize: 5,
      tableSize: 'small',
      bordered: { cell: true }
    };
  }
  currentNestedConfig.value = formConfig.tableConfig;
  nestedVisible.value = true;
};

// 辅助函数：处理 bordered 绑定
// 因为 bordered 可能是 boolean 或 object，这里简单处理为绑定 cell 属性
const isBorderedCell = ref(props.config.bordered?.cell || false);
watch(isBorderedCell, (val) => {
  if (typeof props.config.bordered === 'object') {
    props.config.bordered.cell = val;
  } else {
    props.config.bordered = { cell: val };
  }
});

const addColumn = () => {
  if (!props.config.columns) props.config.columns = [];
  props.config.columns.push({
    title: '新列',
    dataIndex: 'new_col',
    visible: true,
    form: { type: 'input', creatable: true, editable: true }
  });
};

const removeColumn = (index) => {
  props.config.columns.splice(index, 1);
};

const addOption = (formConfig) => {
  if (!formConfig.options) formConfig.options = [];
  formConfig.options.push({ label: '新选项', value: 'new_value' });
};

const addSearchField = () => {
  if (!props.config.searchFields) props.config.searchFields = [];
  props.config.searchFields.push({
    title: '新搜索',
    dataIndex: 'new_search',
    type: 'input',
    placeholder: '请输入'
  });
};

const removeSearchField = (index) => {
  props.config.searchFields.splice(index, 1);
};

const formTypes = [
  'input', 'number', 'select', 'radio', 'checkbox', 'date', 'time', 'textarea', 'table', 'slot', 'upload'
];

</script>

<template>
  <div class="table-config-editor">
    <a-tabs default-active-key="1">
      <!-- 基础配置 -->
      <a-tab-pane key="1" title="基础配置">
        <a-form :model="config" layout="vertical" class="config-form">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="表格标题 (cnDesc)">
                <a-input v-model="config.cnDesc" placeholder="请输入表格标题" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
               <a-form-item label="表格大小 (tableSize)">
                <a-select v-model="config.tableSize">
                  <a-option value="mini">Mini</a-option>
                  <a-option value="small">Small</a-option>
                  <a-option value="medium">Medium</a-option>
                  <a-option value="large">Large</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="主键字段 (rowKey)">
                <a-input v-model="config.rowKey" />
              </a-form-item>
            </a-col>
             <a-col :span="12">
              <a-form-item label="分页类型 (paginationType)">
                <a-select v-model="config.paginationType">
                  <a-option value="frontend">前端分页</a-option>
                  <a-option value="backend">后端分页</a-option>
                </a-select>
              </a-form-item>
            </a-col>
             <a-col :span="12">
              <a-form-item label="每页条数 (pageSize)">
                <a-input-number v-model="config.pageSize" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="弹窗宽度 (modalWidth)">
                <a-input-number v-model="config.modalWidth" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
               <a-form-item label="表单布局 (formLayout)">
                <a-select v-model="config.formLayout">
                  <a-option value="horizontal">Horizontal</a-option>
                  <a-option value="vertical">Vertical</a-option>
                </a-select>
              </a-form-item>
            </a-col>
             <a-col :span="12">
              <a-form-item label="表单列数 (formColumns)">
                <a-input-number v-model="config.formColumns" />
              </a-form-item>
            </a-col>
             <a-col :span="12">
              <a-form-item label="滚动宽 (scroll.x)">
                <a-input v-model="config.scroll.x" placeholder="e.g. 1200 or '100%'" />
              </a-form-item>
            </a-col>
             <a-col :span="12">
              <a-form-item label="滚动高 (scroll.y)">
                <a-input v-model="config.scroll.y" placeholder="e.g. 400 or 'auto'" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-divider orientation="left">开关配置</a-divider>
          <a-space wrap>
            <a-form-item label="显示表单">
               <a-switch v-model="config.showForm" />
            </a-form-item>
            <a-form-item label="显示列设置">
               <a-switch v-model="config.showColumnConfig" />
            </a-form-item>
             <a-form-item label="显示多选">
               <a-switch v-model="config.selection" />
            </a-form-item>
             <a-form-item label="显示表头">
               <a-switch v-model="config.showHeader" />
            </a-form-item>
             <a-form-item label="斑马纹">
               <a-switch v-model="config.stripe" />
            </a-form-item>
             <a-form-item label="单元格边框">
               <a-switch v-model="isBorderedCell" />
            </a-form-item>
             <a-form-item label="悬停效果">
               <a-switch v-model="config.hoverable" />
            </a-form-item>
             <a-form-item label="列宽拖拽">
               <a-switch v-model="config.columnResizable" />
            </a-form-item>
          </a-space>
        </a-form>
      </a-tab-pane>

      <!-- 列配置 -->
      <a-tab-pane key="2" title="列配置">
        <a-button type="primary" size="small" @click="addColumn" style="margin-bottom: 10px">添加列</a-button>
        <a-collapse :default-active-key="['0']" accordion>
          <a-collapse-item v-for="(col, index) in config.columns" :key="String(index)" :header="`${col.title || '未命名'} (${col.dataIndex})`">
            <template #extra>
              <a-button status="danger" size="mini" @click.stop="removeColumn(index)">删除</a-button>
            </template>
            <a-form :model="col" layout="vertical">
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item label="标题 (title)">
                    <a-input v-model="col.title" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="字段名 (dataIndex)">
                    <a-input v-model="col.dataIndex" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="宽度 (width)">
                    <a-input-number v-model="col.width" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="固定 (fixed)">
                     <a-select v-model="col.fixed" allow-clear>
                        <a-option value="left">Left</a-option>
                        <a-option value="right">Right</a-option>
                     </a-select>
                  </a-form-item>
                </a-col>
                 <a-col :span="8">
                  <a-form-item label="对齐 (align)">
                     <a-select v-model="col.align" allow-clear>
                        <a-option value="left">Left</a-option>
                        <a-option value="center">Center</a-option>
                        <a-option value="right">Right</a-option>
                     </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                   <a-space>
                      <a-checkbox v-model="col.visible">可见 (Visible)</a-checkbox>
                      <a-checkbox v-model="col.ellipsis">省略 (Ellipsis)</a-checkbox>
                   </a-space>
                </a-col>
              </a-row>

              <a-divider orientation="left">表单属性 (Form)</a-divider>
              <div v-if="col.form" style="background: #f5f5f5; padding: 10px; border-radius: 4px;">
                 <a-row :gutter="16">
                    <a-col :span="8">
                      <a-form-item label="类型 (Type)">
                         <a-select v-model="col.form.type">
                            <a-option v-for="t in formTypes" :key="t" :value="t">{{ t }}</a-option>
                         </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="8" v-if="col.form.type === 'slot'">
                       <a-form-item label="插槽名 (slotName)">
                          <a-input v-model="col.form.slotName" placeholder="插槽名称" />
                       </a-form-item>
                    </a-col>
                    <a-col :span="8">
                       <a-form-item label="Placeholder">
                          <a-input v-model="col.form.placeholder" />
                       </a-form-item>
                    </a-col>
                     <a-col :span="8">
                       <a-form-item label="回车跳转 (EnterNext)">
                          <a-input v-model="col.form.enterNext" />
                       </a-form-item>
                    </a-col>
                     <a-col :span="24">
                       <a-space>
                          <a-checkbox v-model="col.form.required">必填</a-checkbox>
                          <a-checkbox v-model="col.form.creatable">新增可见</a-checkbox>
                          <a-checkbox v-model="col.form.editable">编辑可见</a-checkbox>
                       </a-space>
                    </a-col>
                 </a-row>

                 <!-- 选项配置 -->
                 <div v-if="['select', 'radio', 'checkbox'].includes(col.form.type)" style="margin-top: 16px;">
                    <a-divider orientation="left" style="margin: 10px 0;">选项配置 (Options)</a-divider>
                    <div v-for="(opt, oIdx) in col.form.options" :key="oIdx" style="display: flex; gap: 8px; margin-bottom: 8px;">
                      <a-input v-model="opt.label" placeholder="Label" />
                      <a-input v-model="opt.value" placeholder="Value" />
                      <a-button status="danger" @click="col.form.options.splice(oIdx, 1)">
                        <template #icon>x</template>
                      </a-button>
                    </div>
                    <a-button type="dashed" long @click="addOption(col.form)">+ 添加选项</a-button>
                 </div>

                 <!-- Attrs JSON 编辑 -->
                 <div style="margin-top: 16px;">
                    <a-divider orientation="left" style="margin: 10px 0;">组件属性 (Attrs JSON)</a-divider>
                    <a-textarea 
                       :model-value="JSON.stringify(col.form.attrs || {}, null, 2)"
                       @update:model-value="(val) => { try { col.form.attrs = JSON.parse(val); } catch(e) {} }"
                       placeholder='{ "min": 0, "max": 100 }'
                       :auto-size="{ minRows: 2, maxRows: 5 }"
                     />
                 </div>

                 <!-- 嵌套表格配置入口 -->
                 <div v-if="col.form.type === 'table'" style="margin-top: 10px;">
                    <a-alert type="info" style="margin-bottom: 10px">这是一个嵌套表格字段。</a-alert>
                    <a-button type="primary" @click="openNestedConfig(col.form)">编辑子表格配置 (Table Config)</a-button>
                 </div>
              </div>
              <div v-else>
                 <a-button size="mini" @click="col.form = { type: 'input', creatable: true, editable: true }">启用表单配置</a-button>
              </div>

            </a-form>
          </a-collapse-item>
        </a-collapse>
      </a-tab-pane>

      <!-- 搜索配置 -->
      <a-tab-pane key="3" title="搜索配置">
        <a-button type="primary" size="small" @click="addSearchField" style="margin-bottom: 10px">添加搜索字段</a-button>
        <a-collapse :default-active-key="['0']" accordion>
          <a-collapse-item v-for="(field, index) in config.searchFields" :key="String(index)" :header="`${field.title || '未命名'} (${field.dataIndex})`">
            <template #extra>
              <a-button status="danger" size="mini" @click.stop="removeSearchField(index)">删除</a-button>
            </template>
            <a-form :model="field" layout="vertical">
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item label="标题 (title)">
                    <a-input v-model="field.title" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="字段名 (dataIndex)">
                    <a-input v-model="field.dataIndex" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="类型 (Type)">
                     <a-select v-model="field.type">
                        <a-option v-for="t in formTypes" :key="t" :value="t">{{ t }}</a-option>
                     </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8" v-if="field.type === 'slot'">
                   <a-form-item label="插槽名 (slotName)">
                      <a-input v-model="field.slotName" placeholder="插槽名称" />
                   </a-form-item>
                </a-col>
                <a-col :span="24">
                   <a-form-item label="Placeholder">
                      <a-input v-model="field.placeholder" />
                   </a-form-item>
                </a-col>
              </a-row>

              <!-- 选项配置 -->
              <div v-if="['select', 'radio', 'checkbox'].includes(field.type)" style="margin-top: 16px;">
                 <a-divider orientation="left" style="margin: 10px 0;">选项配置 (Options)</a-divider>
                 <div v-for="(opt, oIdx) in field.options" :key="oIdx" style="display: flex; gap: 8px; margin-bottom: 8px;">
                   <a-input v-model="opt.label" placeholder="Label" />
                   <a-input v-model="opt.value" placeholder="Value" />
                   <a-button status="danger" @click="field.options.splice(oIdx, 1)">
                     <template #icon>x</template>
                   </a-button>
                 </div>
                 <a-button type="dashed" long @click="addOption(field)">+ 添加选项</a-button>
              </div>

              <!-- Attrs JSON 编辑 -->
              <div style="margin-top: 16px;">
                 <a-divider orientation="left" style="margin: 10px 0;">组件属性 (Attrs JSON)</a-divider>
                 <a-textarea 
                    :model-value="JSON.stringify(field.attrs || {}, null, 2)"
                    @update:model-value="(val) => { try { field.attrs = JSON.parse(val); } catch(e) {} }"
                    placeholder='{ "allow-clear": true }'
                    :auto-size="{ minRows: 2, maxRows: 5 }"
                  />
              </div>
            </a-form>
          </a-collapse-item>
        </a-collapse>
      </a-tab-pane>

      <!-- API 配置 -->
      <a-tab-pane key="4" title="API & 操作">
         <a-form :model="config" layout="vertical">
            <a-form-item label="列表接口 (apiUrl / pageApiUrl)">
               <a-input v-model="config.pageApiUrl" placeholder="Page API URL" />
               <a-input v-model="config.apiUrl" placeholder="API URL (Backend pagination)" style="margin-top: 5px" />
            </a-form-item>
            <a-form-item label="新增接口 (formAddApiUrl)">
               <a-input v-model="config.formAddApiUrl" />
            </a-form-item>
            <a-form-item label="更新接口 (formUpdateApiUrl)">
               <a-input v-model="config.formUpdateApiUrl" />
            </a-form-item>
             <a-form-item label="删除接口 (formDeleteApiUrl)">
               <a-input v-model="config.formDeleteApiUrl" />
            </a-form-item>
         </a-form>
      </a-tab-pane>
    </a-tabs>

    <!-- 递归模态框 -->
    <a-modal v-model:visible="nestedVisible" title="编辑子表格配置" width="900px" :footer="false">
      <TableConfigEditor v-if="currentNestedConfig" :config="currentNestedConfig" />
    </a-modal>
  </div>
</template>

<style scoped>
.table-config-editor {
  background: #fff;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 4px;
}
.config-form {
  max-width: 100%;
}
</style>
