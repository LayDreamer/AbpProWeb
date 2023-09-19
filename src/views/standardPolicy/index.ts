import { lastIndexOf } from 'lodash-es';
import {
  StandardAndPolicyTreeServiceProxy,
  StandardAndPolicyThemeServiceProxy,
  StandardAndPolicyLibDto,
} from '/@/services/ServiceProxies';
const _treeServic = new StandardAndPolicyTreeServiceProxy();
const _themeServic = new StandardAndPolicyThemeServiceProxy();

export async function getStandardAndPolicyTreesAsync() {
  return await _treeServic.getTree();
}

export async function deleteStandardAndPolicyTreesAsync(id) {
  await _treeServic.deleteChild(id);
}

export async function createStandardAndPolicyTreesAsync(id, name) {
  return await _treeServic.addChild(id, name);
}

export async function cardDataList(key) {
  const result: any[] = [];
  let body;

  if (key == '') {
    body = {
      homeMaxCount: 4,
      home: true,
    };
  } else {
    body = {
      id: key,
    };
  }
  var response = await _themeServic.page(body);
  if (response) {
    for (let item of response) {
      result.push({
        id: item.id,
        title: item.theme,
        description: item.data?.map((x) => {
          const themes: string[] = [];
          x.themes?.forEach((e) => {
            themes.push(e + ' ；');
          });
          return {
            title: x.lib.name,
            number: x.lib.number,
            industry: x.lib.industry,
            publishingUnit: x.lib.publishingUnit,
            publishingDate: x.lib.publishingDate,
            implementationDate: x.lib.implementationDate,
            imagePath: x.lib.imagePath,
            pdfPath: x.lib.pdfPath,
            linkPath: x.lib.linkPath,
            theme: themes,
          };
        }),
      });
    }
  }
  return result;
}

export async function uploadStandardAndPolicyFile(file) {
  return await _themeServic.uploadFile(file);
}

export async function addStandardAndPolicy(body) {
  return await _themeServic.insert(body);
}

export async function getTreeAllDetails(body) {
  return await _themeServic.page(body);
}

// function getDes(data: StandardAndPolicyLibDto[]) {
//   const result: any[] = [];

//   for (let i = 0; i < 6; i++) {
//     result.push({
//       id: i,
//       title: '装配置建筑评价标准',
//       description: ['Vben', '设计语言', 'Typescript'],
//       content: ' GB/T 51233-2016',
//       time: '2020-11-14 11:20',
//     });
//   }
//   return result;
// }
