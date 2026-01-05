import { App } from 'vue';
import type { TableProps, TableEmits, TableExpose, TableConfig, TableColumn, TableAction, SearchField, SearchOption } from './Table';
import Table from './components/Table.vue';

// 定义 SuperTable 组件类型
export declare const SuperTable: typeof Table;

// 库的默认导出类型
export declare const defaultExport: {
  install: (app: App) => void;
};

// 导出组件
export { SuperTable, Table };

// 导出类型
export type { 
  TableProps, 
  TableEmits, 
  TableExpose, 
  TableConfig, 
  TableColumn, 
  TableAction, 
  SearchField, 
  SearchOption 
};

// 兼容默认导入
export default defaultExport;