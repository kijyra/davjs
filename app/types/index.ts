export interface FileSystemItem {
  id: string;
  name: string;
  hasChildren: boolean;
  children?: FileSystemItem[];
}
export interface UserIdentity {
  userName: string;
  isAuthenticated: boolean;
  authType: string;
}
export interface FileSystemItem {
  name: string;
  type: 'Directory' | 'File';
  children?: FileSystemItem[];
  fileExtension?: string;
  relativePath?: string;
  formattedSize?: string;
}

export const CONNECTION_OPTIONS = {
  Any: "Anydesk Remote",
  VNC00: "VNC просмотр без запроса",
  VNC01: "VNC просмотр с запросом",
  VNC10: "VNC управление без запроса",
  VNC11: "VNC управление с запросом",
  WTRC: "WTRC без запроса",
  WEB: "Web Интерфейс",
} as const;

export const LANGUAGES = {
  ru: "Русский",
  en: "English",
} as const;


export interface UserSettings {
  defaultPCConnection: string;
  thinkConnection: string;
  language: string;
}

export interface ADUser {
  id: number;
  cn: string;
  name?: string;
  surName?: string;
  givenName?: string;
  admin: boolean;
  group: string[];
  enabled?: boolean;
  settings?: UserSettings | null;
  
  user?: any; 
}