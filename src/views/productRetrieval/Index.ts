import {
  MaterialInventoryCreateDto,
  MaterialInventoryServiceProxy,
  ProductRetrievalServiceProxy,
  ProjectInfoServiceProxy,
} from '/@/services/ServiceProxies';

const _productService = new ProductRetrievalServiceProxy();
const _materialInventoryService = new MaterialInventoryServiceProxy();
const _projectService = new ProjectInfoServiceProxy();
export async function getProductIndex(data) {
  return await _productService.page(data);
}
export async function getAllProducts(data) {
  return await _productService.noPage(data);
}

export async function getProductById(data) {
  return await _productService.findByInput(data);
}

export async function getAllProductById(data) {
  return await _productService.findAllByInput(data);
}

//库存表导入
export async function uploadInventory(jsonData) {
  let body: any[] = [];
  var data = JSON.parse(jsonData);
  for (let item of data) {
    var dto = new MaterialInventoryCreateDto();
    dto.projectName = item['项目名称'];
    dto.warehouse = item['仓库'].trim();
    dto.warehouseLocationName = item['库位名称'].trim();
    dto.billMaterialsCode = item['料单编码'];
    dto.materialCode = item['材料编码'].trim();
    dto.materialName = item['材料名称'];
    dto.productionBatch = item['批次'];
    dto.unit = item['基本单位'];
    dto.inventoryQuantity = item['库存数量'];
    dto.inventoryAmount = item['库存金额'];
    dto.storageTime = item['入库时间'];
    body.push(dto);
  }
  return await _materialInventoryService.upload(body);
}

//库存表查询
export async function parsingInventory(data) {
  return await _materialInventoryService.getByErp(data);
}

//项目表导入
export async function uploadProjectInfo(file) {
  return await _projectService.importFromExcel(file);
}

//项目表查询
export async function parsingProjectInfo(data) {
  return await _projectService.getByErp(data);
}

export async function uploadImportRetrievalFile(jsonData) {
  return await _productService.importFromExcel(jsonData);
}

export function exportToExcel(body) {
  return _productService.exportToExcel(body).then((res) => {
    const bytes = _base64ToArrayBuffer(res);
    const blob = new Blob([bytes], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '产品检索表.xlsx';
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
