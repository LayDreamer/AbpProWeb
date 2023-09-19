import {
  MaterialInventoryUpdateDto,
  ProjectInfoUpdateDto,
  ProductRetrievalServiceProxy,
  MaterialInventoryServiceProxy,
  ProjectInfoServiceProxy,
} from '/@/services/ServiceProxies';

const _productService = new ProductRetrievalServiceProxy();
const _materialInventoryService = new MaterialInventoryServiceProxy();
const _projectService = new ProjectInfoServiceProxy();
export async function getProductIndex(data) {
  return await _productService.page(data);
}

export async function getProductById(data) {
  return await _productService.findByInput(data);
}

export async function uploadInventory(jsonData) {
  const dto = new MaterialInventoryUpdateDto();
  dto.data = jsonData;
  return await _materialInventoryService.upload(dto);
}

export async function parsingInventory(data) {
  return await _materialInventoryService.parsing(data);
}

export async function uploadProjectInfo(jsonData) {
  const dto = new ProjectInfoUpdateDto();
  dto.data = jsonData;
  return await _projectService.upload(dto);
}

export async function parsingProjectInfo(data) {
  return await _projectService.parsing(data);
}
