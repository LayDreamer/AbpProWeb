import { ref } from 'vue';
import {
  StandardAndPolicyTreeServiceProxy,
  StandardAndPolicyTreeDto,
  StandardAndPolicyLibDto,
} from '/@/services/ServiceProxies';
const _treeServic = new StandardAndPolicyTreeServiceProxy();
export async function getStandardAndPolicyTreesAsync() {
  return await _treeServic.getTree();
}

export async function deleteStandardAndPolicyTreesAsync(id) {
  await _treeServic.deleteChild(id);
}

export async function createStandardAndPolicyTreesAsync(id, name) {
  return await _treeServic.addChild(id, name);
}

export async function filterLibByIdAsync(id) {
  return await _libServic.filterById(id);
}

export async function getLibListByInputAsync(input) {}

export const cardList = (() => {
  const result: any[] = [];
  for (let i = 0; i < 12; i++) {
    result.push({
      title: '装配置建筑评价标准',
      icon: 'logos:vue',
      color: '#1890ff',
      active: '100',
      new: '1,799',
      download: 'bx:bx-download',
      content: ' GB/T 51233-2016',
    });
  }
  return result;
})();

function getDes(data: StandardAndPolicyLibDto[]) {
  const result: any[] = [];
  // for (let item of data) {
  // }
  for (let i = 0; i < 6; i++) {
    result.push({
      id: i,
      title: '装配置建筑评价标准',
      //description: ['Vben', '设计语言', 'Typescript'],
      content: ' GB/T 51233-2016',
      time: '2020-11-14 11:20',
    });
  }
  return result;
}

export async function cardDataList() {
  const result: any[] = [];
  const treeData = ref<StandardAndPolicyTreeDto[]>([]);
  treeData.value = await getStandardAndPolicyTreesAsync();
  for (let item of treeData.value) {
    if (item.children)
      for (let children of item.children) {
        result.push({
          id: children.id,
          title: children.name,
          description: cardList,
          //getDes(await filterLibByIdAsync(children.id))
        });
      }
  }
  return result;
}
