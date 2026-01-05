import { DefineComponent } from 'vue';
import type { TableColumn } from './Table';

// TableFormFieldItem 组件 Props 类型
export type TableFormFieldItemProps = {
  field: TableColumn;
  formData: Record<string, any>;
  formErrors: Record<string, any>;
  isFieldDisabled: (field: TableColumn) => boolean;
  getOptions: (field: TableColumn) => any[];
  getFieldAttrs: (field: TableColumn) => Record<string, any>;
  modelValue?: string | number | boolean | Array<any> | Object | Date;
  selectedKeys?: any[];
  allFields?: TableColumn[];
  onEnterNext?: () => void;
  supportEnterTypes?: string[];
};

// TableFormFieldItem 组件 Emits 类型
export type TableFormFieldItemEmits = {
  'update:modelValue': [value: any];
  'update:selectedKeys': [keys: any[]];
};

// TableFormFieldItem 组件类型
export declare const TableFormFieldItem: DefineComponent<
  TableFormFieldItemProps,
  TableFormFieldItemEmits
>;

export default TableFormFieldItem;