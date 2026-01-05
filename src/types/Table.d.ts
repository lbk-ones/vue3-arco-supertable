import { DefineComponent } from 'vue';

// 搜索字段选项类型
export type SearchOption = {
  label: string;
  value: any;
};

// 搜索字段类型
export type SearchField = {
  dataIndex: string;
  title: string;
  type?: 'input' | 'select' | 'radio' | 'checkbox' | 'date' | 'date-range' | 'number' | 'switch';
  placeholder?: string;
  options?: SearchOption[] | ((searchValues: Record<string, any>, field: SearchField) => SearchOption[]);
  attrs?: Record<string, any>;
};

// 列配置类型 - 先声明为接口以便递归引用
export interface TableColumn {
  dataIndex: string;
  title: string;
  key?: string;
  width?: number;
  fixed?: boolean | 'left' | 'right';
  slotName?: string;
  visible?: boolean;
  statusMap?: Record<string, { label: string; color: string }>;
  form?: {
    type?: string;
    creatable?: boolean;
    editable?: boolean;
    required?: boolean;
    placeholder?: string;
    enterNext?: string;
    options?: any[];
    attrs?: Record<string, any>;
    columns?: number;
    slotName?: string;
    validator?: (value: any) => string;
    oneRow?: boolean;
    tableConfig?: TableConfig; // 嵌套的表格配置
    [key: string]: any;
  };
  [key: string]: any;
}

// 操作按钮类型
export type TableAction = {
  key: string;
  label: string;
  type?: 'primary' | 'secondary' | 'outline' | 'dashed' | 'text' | 'confirm';
  status?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  message?: string;
  confirmMessage?: string;
  params?: any | ((records: any[]) => any);
  attrs?: Record<string, any>;
  icon?: string;
  apiUrl?: string;
  [key: string]: any;
};

// 表格配置类型
export interface TableConfig {
  columns: TableColumn[];
  searchFields?: SearchField[];
  paginationType?: 'backend' | 'frontend' | 'none';
  pageSize?: number;
  pageApiUrl?: string;
  formAddApiUrl?: string;
  formUpdateApiUrl?: string;
  formDeleteApiUrl?: string;
  pageSizeOptions?: number[];
  actions?: TableAction[];
  showColumnConfig?: boolean;
  showForm?: boolean;
  tableSize?: 'small' | 'medium' | 'large';
  rowKey?: string;
  scroll?: { x?: number | string; y?: number | string };
  selection?: boolean;
  bordered?: boolean | { cell?: boolean };
  hoverable?: boolean;
  columnResizable?: boolean;
  stripe?: boolean;
  cnDesc?: string;
  modalWidth?: number | string;
  formLayout?: 'horizontal' | 'vertical' | 'inline';
  formColumns?: number;
  formColGap?: number;
  formRowGap?: number;
  showHeader?: boolean;
  hoverColor?: string;
  hoverFontColor?: string;
  headerBgColor?: string;
  headerFontColor?: string;
  handlerSearch?: (searchValues: Record<string, any>) => void;
  handlePageChange?: (params: { page: number; pageSize: number }) => void;
  handleColumnConfigChange?: (params: { visibility: Record<string, boolean>; order: Array<{ index: number; dataIndex: string; title: string }> }) => void;
  executeAction?: (action: TableAction, records: any[], params?: any) => Promise<void>;
  handleFormSubmit?: (params: {
    config: TableConfig;
    mode: 'create' | 'edit' | 'readonly';
    data: any;
    record: any;
  }) => Promise<void>;
  pageFetchData?: (apiUrl: string, params: {
    pageNo: number;
    pageSize: number;
    searchValues: Record<string, any>;
  }) => Promise<{ records: any[]; total: number }>;
  tableAttrs?: Record<string, any>;
  tablePaginationAttrs?: Record<string, any>;
}

// 表单数据类型
export type FormData = {
  mode: 'create' | 'edit' | 'readonly';
  data: any;
  record: any | null;
};

// 表格组件 Props 类型
export type TableProps = {
  config: TableConfig;
  data?: any[];
  loading?: boolean;
  isFormItem?: boolean;
  selectedKeys?: any[];
  tableDisabled?: boolean;
};

// 表格组件 Emits 类型
export type TableEmits = {
  'update:selectedKeys': [keys: any[]];
  'update:data': [data: any[]];
  'update:loading': [loading: boolean];
};

// 表格组件 Expose 类型
export type TableExpose = {
  fetchData: () => Promise<void>;
};

// 表格组件类型
export declare const Table: DefineComponent<
  TableProps,
  TableEmits,
  {},
  {},
  {},
  {},
  {},
  {},
  TableExpose
>;

export default Table;