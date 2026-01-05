import { DefineComponent } from 'vue';
import type { TableColumn, TableConfig } from './Table';

// TableForm 组件 Props 类型
export type TableFormProps = {
  columns: TableColumn[];
  record?: any | null;
  visible?: boolean;
  mode?: 'create' | 'edit' | 'readonly';
  apiConfig?: Record<string, any>;
  formLayout?: 'vertical' | 'horizontal' | 'inline';
  formColumns?: number;
  formColGap?: number;
  formRowGap?: number;
  modalWidth?: number | string;
  selectedKeys?: any[];
  config?: TableConfig;
};

// TableForm 组件 Emits 类型
export type TableFormEmits = {
  'update:visible': [visible: boolean];
  'update:selectedKeys': [keys: any[]];
  submit: [formData: any];
  success: [data: any];
  error: [error: any];
};

// TableForm 组件类型
export declare const TableForm: DefineComponent<
  TableFormProps,
  TableFormEmits
>;

export default TableForm;