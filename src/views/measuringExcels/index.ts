import { BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';

import { MeasuringExcelServiceProxy, OrderNotificationSearchDto } from '/@/services/ServiceProxies';

const { t } = useI18n();
const _measuringExcelServiceProxy = new MeasuringExcelServiceProxy();

export async function getMeasuringExcelAsync(params: OrderNotificationSearchDto) {
  return await _measuringExcelServiceProxy.getList(params);
}

export async function UploadMeasuringExcel(file) {
  return await _measuringExcelServiceProxy.uploadFile(file);
}
export async function AddMeasuringExcel(data) {
  return await _measuringExcelServiceProxy.add(data);
}

export async function deleteExcel(id) {
  return await _measuringExcelServiceProxy.delete(id);
}

export async function getRecord(id) {
  return _measuringExcelServiceProxy.get(id);
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
