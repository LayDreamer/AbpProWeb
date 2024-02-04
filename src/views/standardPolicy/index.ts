import {
  StandardAndPolicyThemeServiceProxy,
  StandardAndPolicyTreeServiceProxy,
} from '/@/services/ServiceProxies';
const _treeServic = new StandardAndPolicyTreeServiceProxy();
const _themeServic = new StandardAndPolicyThemeServiceProxy();

export async function getStandardAndPolicyTreesAsync() {
  return await _treeServic.getTree();
}

export async function hideTreeNode(id, hide) {
  return await _treeServic.hideTree(id, hide);
}

export async function deleteStandardAndPolicyTreesAsync(id) {
  await _treeServic.deleteChild(id);
}

export async function createStandardAndPolicyTreesAsync(id, name) {
  return await _treeServic.addChild(id, name);
}

export async function exchangeTreeNodesAsync(id1, id2) {
  return await _treeServic.exChange(id1, id2);
}

export async function cardDataList() {
  const result: any[] = [];
  await _themeServic.pageHome(4).then((response) => {
    for (const item of response) {
      result.push({
        parentName: item.parentName,
        id: item.id,
        title: item.theme,
        description: item.data?.map((x) => {
          const date =
            x.creationTime !== undefined
              ? new Date(x.creationTime).toLocaleDateString()
              : undefined;
          return {
            id: x.id,
            title: x.name,
            number: x.number,
            date: date,
          };
        }),
      });
    }
  });
  return result;
}

export async function getCardDetail(id) {
  return await _themeServic.getCardDetail(id);
}

export async function favoriteLib(id, status) {
  return await _themeServic.updateCollect(id, status);
}

export async function deleteStandardLibs(ids) {
  return await _themeServic.delete(ids);
}

export async function uploadStandardAndPolicyFile(file) {
  return await _themeServic.uploadFile(file);
}

export async function addStandardAndPolicy(id: string | undefined, body) {
  if (id == null) {
    return await _themeServic.insert(body);
  } else {
    return await _themeServic.updateLib(id, body);
  }
}

export async function getTreeAllDetails(body) {
  return await _themeServic.pageBySearch(body);
}

export async function exportExcelAsync() {
  return await _themeServic.export().then((byte) => {
    const bytes = _base64ToArrayBuffer(byte);
    const blob = new Blob([bytes], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '政策报表.xlsx';
    a.click();
  });
  function _base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64); //解码使用base64编码的字符串
    const len = binary_string.length; //获取长度
    const bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
