import { BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';

import { ProcessingListServiceProxy, OrderNotificationSearchDto,UsersServiceProxy ,PagingUserListInput} from '/@/services/ServiceProxies';

const { t } = useI18n();
const _processingListServiceProxy = new ProcessingListServiceProxy();
const _usersServiceProxy=new UsersServiceProxy();

export const tableColumns: BasicColumn[] = [
  {
    title: t('routes.admin.userManagement_userName'),
    dataIndex: 'userName',
  },
  {
    title: t('routes.admin.userManagement_name'),
    dataIndex: 'name',
  },
  {
    title: t('routes.admin.userManagement_email'),
    dataIndex: 'email',
  },
  {
    title: t('routes.admin.userManagement_phone'),
    dataIndex: 'phoneNumber',
  },
  {
    title: t('common.status'),
    dataIndex: 'isActive',
  },
];

export async function getProcessingListAsync(params: OrderNotificationSearchDto) {
  return await _processingListServiceProxy.getAllList(params);
}

export function getExcel(id) {
  return _processingListServiceProxy.get(id);
}

export function deleteExcel(id) {
  return _processingListServiceProxy.delete(id);
}

export function sendEmail(data) {
  return _processingListServiceProxy.sendEmail(data);
}
export function getAllUsers(params: PagingUserListInput) {
  return _usersServiceProxy.page(params);
}
export function getCurrentUser() {
  return _usersServiceProxy.currentUser();
}


function _base64ToArrayBuffer(base64) {
  const binary_string = window.atob(base64); //解码使用base64编码的字符串
  const len = binary_string.length; //获取长度
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}
