import { NewFamilyTreeServiceProxy, NewFamilyLibServiceProxy } from '/@/services/ServiceProxies';

const _newFamilyTreeServiceProxy = new NewFamilyTreeServiceProxy();
const _newFamilyLibServiceProxy = new NewFamilyLibServiceProxy();


export async function getRootTree() {
    return await _newFamilyTreeServiceProxy.getTree();
}
export async function getListByTreeId(body) {
    return await _newFamilyLibServiceProxy.getListByTreeId(body);
}
export async function getFamilyInfo(body) {
    return await _newFamilyLibServiceProxy.getFamilyInfo(body);
}
export async function uploadFamilyLibImage(id, file) {
    return await _newFamilyLibServiceProxy.uploadFamilyLibImage(id, file);
}