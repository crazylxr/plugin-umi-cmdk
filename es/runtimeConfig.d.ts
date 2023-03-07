export interface IRuntimeConfig {
  /** 搜索框的 placeholder */
  searchPlaceholder?: string;
  /** 搜索为空的时候展示 */
  empty?: React.ReactNode;
  /** 快捷键 */
  keyFilter?: KeyFilter;
  /** 需要放到 suggestion 的菜单 */
  suggestionKeys?: string[];
  /** 增加额外的搜索组 */
  groups?: Group[];
}

type keyType = number | string;
type KeyFilter = keyType | keyType[] | ((event: KeyboardEvent) => boolean);

interface Item {
  key: string;
  title: string;
  action?: () => void;
}

interface Group {
  groupName: string;
  items: Item[];
}