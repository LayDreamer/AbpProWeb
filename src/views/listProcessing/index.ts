import { ListProcessingServiceProxy } from '/@/services/ServiceProxies';
const _listProcessingServiceProxy = new ListProcessingServiceProxy();

export async function PageListProcessingLists(body) {
  return await _listProcessingServiceProxy.page(body);
}

export async function GetSelects(type) {
  return await _listProcessingServiceProxy.getSelect(type);
}

export async function UploadSelects(type, file) {
  return await _listProcessingServiceProxy.upload(type, file);
}

export async function DeleteSheets(ids) {
  return await _listProcessingServiceProxy.delete(ids);
}

export async function BuildSheet(body) {
  return await _listProcessingServiceProxy.build(body);
}
