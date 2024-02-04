import {
  FamilyTreeServiceProxy,
  FamilyLibsServiceProxy,
  OrderNotificationSearchDto,
} from '/@/services/ServiceProxies';

const _familyTreeServiceProxy = new FamilyTreeServiceProxy();
const _familyLibsServiceProxy = new FamilyLibsServiceProxy();

function sort(tree) {
  if (tree.children) {
    tree.children = tree.children?.filter((item) => !item.displayName?.includes('详图族'));
    tree.children = tree.children?.sort((a, b) => {
      const titleA = a.displayName ?? '';
      const titleB = b.displayName ?? '';
      return titleA.localeCompare(titleB, 'zh-CN');
    });
    for (const item of tree.children) {
      sort(item);
    }
  } else {
    return;
  }
}

export async function getProductTreesAsync() {
  let result: any = [];
  await _familyTreeServiceProxy.get().then((out) => {
    if (Array.isArray(out)) {
      for (const item of out) {
        if (item.parentId == null) {
          sort(item);
          result!.push(item);
        }
      }
      result = result.sort((a, b) => {
        return a.displayName.localeCompare(b.displayName, 'zh-CN');
      });
    }
  });
  return result;
}

export async function getProductLibsAsync(params: OrderNotificationSearchDto) {
  return await _familyLibsServiceProxy.getListByTreeId(params);
}

export async function getProductModuleAsync(params: string) {
  return await _familyLibsServiceProxy.getFamilyModule(params);
}

export async function uploadFamilyLibImage(id, file) {
  return await _familyLibsServiceProxy.uploadFamilyLibImage(id, file);
}
