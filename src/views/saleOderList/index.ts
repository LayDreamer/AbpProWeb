import { BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';

import {
  OrderNotificationSearchDto,
  SaleOderServiceProxy,
} from '/@/services/ServiceProxies';

const { t } = useI18n();
const _saleOderServiceProxy = new SaleOderServiceProxy();

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

export async function getList(params: OrderNotificationSearchDto) {
  return await _saleOderServiceProxy.getSaleOrderList(params);
}
export async function get(id) {
  return await _saleOderServiceProxy.get(id);
}
export async function deleteOder(id) {
  return await _saleOderServiceProxy.delete(id);
}


export async function UploadFactoryFile(file) {
  return await _saleOderServiceProxy.uploadFactoryFile(file);
}

export async function CreateNewSplitFile(body) {
  return await _saleOderServiceProxy.createNewSplitFile(body);
}

export async function CreateSaleOderFile(body) {
  return await _saleOderServiceProxy.createSaleOderFile(body);
}
