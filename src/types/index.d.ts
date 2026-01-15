declare module 'arco-vue3-supertable' {
    import type { DefineComponent, Plugin, App } from 'vue';

    // 组件属性类型定义
    interface SuperTableProps {
        /**
         * 表格配置
         */
        config?: TableConfig;
        /**
         * 表格数据
         */
        data?: any[];
        /**
         * 是否加载中
         */
        loading?: boolean;
        /**
         * 是否是表单项
         */
        isFormItem?: boolean;
        /**
         * 选中行数组，由外部传进来
         */
        selectedKeys?: any[];
        /**
         * 是否禁用表格 
         */
        tableDisabled?: boolean;
    }

    // 表格列配置类型
    interface TableColumn {
        dataIndex: string;
        title: string;
        key?: string;
        width?: number;
        fixed?: boolean | 'left' | 'right';
        slotName?: string;
        visible?: boolean;
        tagMap?: Record<string, { label: string; color: string }>;
        enumMap?: Record<string, { label: string }>;
        form?: {
            type?: 'input' | 'select' | 'number' | 'date' | 'radio' | 'switch' | 'textarea' | 'slot' | 'table';
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
        size?: 'small' | 'medium' | 'large';
        message?: string;
        confirmMessage?: string;
        disabled?: boolean | Function,
        isFetchData?: boolean,
        needSelect?: boolean,
        /**
         * 操作完成后是否清除选中状态
         */
        isClearSelect?: boolean,
        showInContextMenu?: boolean,
        contextMenuSortNo?: number,
        visible?: boolean,
        params?: any | ((records: any[]) => any);
        attrs?: Record<string, any>;
        icon?: string;
        apiUrl?: string;
        [key: string]: any;
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
    // 搜索选项类型 select, radio, checkbox
    export type SearchOption = {
        label: string;
        value: any;
    };
    // 表格配置类型
    interface TableConfig {
        columns: TableColumn[];
        searchFields?: SearchField[];
        paginationType?: 'backend' | 'frontend' | 'none';
        pageSize?: number;
        /**
         * 分页API URL
         */
        pageApiUrl?: string;
        /**
         * 新增API URL
         */
        formAddApiUrl?: string;
        /**
         * 更新API URL
         */
        formUpdateApiUrl?: string;
        /**
         * 删除API URL
         */
        formDeleteApiUrl?: string;
        /**
         * 启用/禁用API URL
         */
        enableOrDisabledUrl?: string;
        /**
         * 分页大小选项 [5, 10, 20, 50, 100]
         */
        pageSizeOptions?: number[];
        /**
         * 操作按钮数组
         */
        actions?: TableAction[];
        /**
         * 是否显示表格设置按钮
         */
        showColumnConfig?: boolean;
        /**
         * 是否显示新增按钮
         */
        showForm?: boolean;
        /**
         * 表格大小
         */
        tableSize?: 'mini' | 'small' | 'medium' | 'large';
        /**
         * 行唯一字段名称
         */
        rowKey?: string;
        /**
         * 表格滚动配置
         */
        scroll?: { x?: number | string; y?: number | string };
        /**
         * 是否显示左边选择框
         */
        selection?: boolean;
        bordered?: boolean | { wrapper?: boolean; headerCell?: boolean; bodyCell?: boolean; cell?: boolean };
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
        contextMenuEnabled?: boolean;
        hoverColor?: string;
        hoverFontColor?: string;
        headerBgColor?: string;
        headerFontColor?: string;
        showSearchBar?: boolean;
        /**
         * 是否禁用表格操作（禁用所有操作按钮）
         */
        tableDisabled?: boolean;
        /**
         * 是否显示顶部左侧操作按钮
         */
        showTopLeftActions?: boolean;
        /**
         * 	如果配置了dataIndex名为operations的操作列，每行左侧操作按钮数量，操过两个将转为更多
         */
        lineLeftActionsNum: number;
        /**
         * 表格透传属性
         */
        tableAttrs?: Record<string, any>;
        /**
         * 表格分页透传属性
         */
        tablePaginationAttrs?: Record<string, any>;
        /**
         * 搜索事件处理函数
         * @param searchValues 搜索参数
         * @returns 搜索结果
         */
        handlerSearch?: (searchValues: Record<string, any>) => void;
        /**
         * 分页事件处理函数
         * @param params 分页参数
         * @returns 分页结果
         */
        handlePageChange?: (params: { page: number; pageSize: number }) => void;
        /**
         * 列配置变更事件处理函数
         * @param params 列配置参数
         * @returns 列配置结果
         */
        handleColumnConfigChange?: (params: { visibility: Record<string, boolean>; order: Array<{ index: number; dataIndex: string; title: string }> }) => void;
        /**
         * 执行操作按钮点击事件
         * @param config 表格配置
         * @param action 操作按钮配置
         * @param records 选中的行数据
         * @param params 操作按钮参数
         * @returns 操作结果
         */
        executeAction?: (config: TableConfig, action: TableAction, records: any[], params?: any) => Promise<void>;
        /**
         * 表单提交事件处理函数
         * @param params 表单提交参数
         * @returns 表单提交结果
         */
        handleFormSubmit?: (params: {
            config: TableConfig;
            mode: 'create' | 'edit' | 'readonly';
            data: any;
            record: any;
        }) => Promise<void>;
        /**
         * 分页数据获取事件处理函数
         * @param apiUrl 分页数据获取接口URL
         * @param params 分页数据获取参数
         * @param searchFields 搜索字段配置
         * @returns 分页数据获取结果
         */
        pageFetchData?: (apiUrl: string, params: {
            pageNo: number;
            pageSize: number;
            searchValues: Record<string, any>;
        }, searchFields?: SearchField[]) => Promise<{ records: any[]; total: number }>;

    }

    // 组件实例方法类型
    interface SuperTableInstance {
        /**
         * 刷新表格数据
         */
        fetchData: () => void;
        /**
         * 关闭新增更新表单弹窗
         */
        closeForm: () => void;
        /**
         * 获取当前新增更新表单数据
         */
        getFormData: () => any;
        /**
         * 提交新增更新表单数据
         */
        handleSubmit: () => any;
        /**
         * 初始化表单数据
         */
        initializeFormData: () => any;
        /**
         * 初始化表格列配置
         */
        initializeColumns: () => any;
    }

    // 组件事件类型
    interface SuperTableEvents {
        onSelect?: (selectedRowKeys: any[], selectedRows: any[]) => void;
        onChange?: (pagination: any, filters: any, sorter: any) => void;
        onRowClick?: (record: any, index: number, event: Event) => void;
    }

    // 组件组合类型
    type SuperTableComponent = DefineComponent<
        SuperTableProps & SuperTableEvents,
        SuperTableInstance
    >;

    // 默认导出组件
    const SuperTable: SuperTableComponent & Plugin;

    export { SuperTableProps, TableColumn, TableConfig, SuperTableInstance, SuperTableEvents };
    export {
        SuperTable
    };


    // 库的默认导出类型
    export declare const defaultExport: {
        install: (app: App) => void;
    };

    export default defaultExport
}

// 全局组件类型扩展
declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        SuperTable: typeof import('arco-vue3-supertable').SuperTable;
    }
}