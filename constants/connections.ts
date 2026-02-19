export const CONNECTION_OPTIONS: Record<string, string> = {
  Any: 'Anydesk Remote',
  VNC00: 'VNC просмотр без запроса',
  VNC01: 'VNC просмотр с запросом',
  VNC10: 'VNC управление без запроса',
  VNC11: 'VNC управление с запросом',
  WTRC: 'WTRC без запроса',
  WEB: 'Web Интерфейс',
};

export const CONNECTION_URLS: Record<string, string> = {
  Any: 'anydesk://',
  VNC00: 'vnc://viewonly:noprompt@',
  VNC01: 'vnc://viewonly:prompt@',
  VNC10: 'vnc://control:noprompt@',
  VNC11: 'vnc://control:prompt@',
  WTRC: 'wtrc://',
  WEB: 'http://',
};