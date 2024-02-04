import {
  ArchitectureListMaterialCreateDto,
  ArchitectureListMaterialDto,
  ArchitectureListMaterialTag,
  ArchitectureListModifyStatus,
  ArchitectureListModuleCreateDto,
  ArchitectureListModuleDto,
  ArchitectureListTreeDto,
  ArchitectureListServiceProxy,
  NewFamilyLibServiceProxy,
} from '/@/services/ServiceProxies';

const _service = new ArchitectureListServiceProxy();
const _familyService = new NewFamilyLibServiceProxy();

function seriesData(data) {
  let tmp: string[] = [];
  for (const item of data[3]) {
    if (item !== undefined) {
      tmp.push(item);
    }
  }
  if (tmp.length == 0) {
    throw new Error('请检查产品系统是否存在');
  }
  const system = tmp[tmp.length - 1];
  const moduleMap = {
    模块名称: 'name',
    模块类别: 'category',
    模块型号: 'model',
    加工方式: 'processingMode',
    L: 'length',
    W: 'width',
    H: 'height',
    模块单位: 'unit',
    加工码: 'processingCode',
    供货方式: 'supplyMode',
    模块定制规范: 'moduleSpecification',
    加工图图号: 'processNum',
    装配图图号: 'assemblyDrawingNum',
    节点图图号: 'detailNum',
    备注: 'remark',
  };
  const assemblyMaterial = {
    物料名称: 'composition',
    物料名称Ⅱ: 'name',
    物料编码: 'code',
    L: 'length',
    W: 'width',
    H: 'height',
    材质: 'materialQuality',
    基本性能要求: 'basicPerformance',
    用量: 'usage',
    采购单位: 'unit',
    '加工是/否': 'isProcess',
  };
  const installMaterial = {
    选配序号: 'optionalSerial',
    物料名称: 'composition',
    物料名称Ⅱ: 'name',
    物料编码: 'code',
    L: 'length',
    W: 'width',
    H: 'height',
    材质: 'materialQuality',
    用量: 'usage',
    采购单位: 'unit',
    安装码: 'installationCode',
  };
  var head1 = data[6];
  var head2 = data[7];
  var head3 = data[8];
  var moduleIndex;
  var materialIndex;
  var processIndex;
  var installIndex;
  var moduleHead = new Map();
  var assemblyMaterialHead = new Map();
  var installMaterialHead = new Map();
  for (let i = 1; i < head1.length; i++) {
    if (head1[i] == undefined) continue;
    var str = head1[i]
      .toString()
      .replace(/[\r\n]/g, '')
      .trim();
    if (str == '模块定制规范' || str == '装配图图号' || str == '节点图图号' || str == '备注') {
      if (str == '模块定制规范') {
        installIndex = i;
      }
      moduleHead.set(str, i);
    } else if (str == '物料信息') {
      moduleIndex = i;
    } else if (str == '生产信息') {
      materialIndex = i;
    } else if (str == '安装信息') {
      processIndex = i;
    }
  }
  for (let i = 2; i < moduleIndex; i++) {
    if (head2[i] == undefined) continue;
    var str = head2[i]
      .toString()
      .replace(/[\r\n]/g, '')
      .trim();
    if (str.includes('模块尺寸')) {
      for (let j = i; j < head3.length; j++) {
        if (head3[j] == undefined) break;
        var d = head3[j]
          .toString()
          .replace(/[\r\n]/g, '')
          .trim();
        moduleHead.set(d, j);
      }
    } else {
      moduleHead.set(str, i);
    }
  }
  for (let i = moduleIndex; i < materialIndex; i++) {
    if (head2[i] == undefined) continue;
    var str = head2[i]
      .toString()
      .replace(/[\r\n]/g, '')
      .trim();
    if (str.includes('物料尺寸')) {
      for (let j = i; j < head3.length; j++) {
        if (head3[j] == undefined) break;
        var d = head3[j]
          .toString()
          .replace(/[\r\n]/g, '')
          .trim();
        assemblyMaterialHead.set(d, j);
      }
    } else {
      assemblyMaterialHead.set(str, i);
    }
  }
  for (let i = materialIndex; i < processIndex; i++) {
    if (head2[i] == undefined) continue;
    var str = head2[i]
      .toString()
      .replace(/[\r\n]/g, '')
      .trim();
    if (str == '加工是/否') {
      assemblyMaterialHead.set(str, i);
    } else {
      moduleHead.set(str, i);
    }
  }
  for (let i = processIndex; i < installIndex; i++) {
    if (head2[i] == undefined) continue;
    var str = head2[i]
      .toString()
      .replace(/[\r\n]/g, '')
      .trim();
    if (str.includes('物料尺寸')) {
      for (let j = i; j < head3.length; j++) {
        if (head3[j] == undefined) break;
        var d = head3[j]
          .toString()
          .replace(/[\r\n]/g, '')
          .trim();
        installMaterialHead.set(d, j);
      }
    } else {
      installMaterialHead.set(str, i);
    }
  }
  let body: ArchitectureListModuleCreateDto[] = [];
  const filters = data.filter((x) => data.indexOf(x) > 8 && x[0] != undefined);
  for (let i = 0; i < filters.length - 1; i++) {
    if (filters[i][0] == '备注') break;
    const sRow = data.indexOf(filters[i]);
    const eRow = data.indexOf(filters[i + 1]);
    var dto = new ArchitectureListModuleCreateDto();
    dto.materials = [];
    dto.system = system;
    for (const column in moduleMap) {
      const propertyName = moduleMap[column];
      const value = data[sRow][moduleHead.get(column)];
      if (column == '模块定制规范') {
        let x = '';
        if (value !== undefined) {
          x = value.replace(/\s/g, '');
        }
        if (x.includes('选配开始') && x.includes('选配结束')) {
          dto[propertyName] = x.slice(x.indexOf('选配结束') + 4);
          var optionalData: any[] = [];
          let str = x.slice(x.indexOf('选配开始') + 4, x.indexOf('选配结束'));
          for (let item of str.split('情况')) {
            if (item == '') {
              continue;
            }

            var s =
              (item.indexOf('：') == -1
                ? item.indexOf(':') == -1
                  ? 0
                  : item.indexOf(':')
                : item.indexOf('：')) + 1;
            var e = item.indexOf('配置');
            var n = item.slice(s, e).replace(';', '').replace('；', '');
            var p = item.slice(e + 4);
            var v = p.trim();
            optionalData.push({
              name: n,
              value: v,
            });
          }
          dto.optional = JSON.stringify(optionalData);
          continue;
        }
        dto[propertyName] = x;
        continue;
      }
      dto[propertyName] = value == undefined ? '' : value.toString();
    }
    var assemblycol = assemblyMaterialHead.get('物料名称');
    var installcol = installMaterialHead.get('物料名称');
    for (let row = sRow; row < eRow; row++) {
      var assemblyMaterialSheetName = data[row][assemblycol];
      if (assemblyMaterialSheetName != undefined && assemblyMaterialSheetName != '/') {
        var material = new ArchitectureListMaterialCreateDto();
        material.tag = ArchitectureListMaterialTag.Assemble;
        for (const column in assemblyMaterial) {
          const propertyName = assemblyMaterial[column];
          const value = data[row][assemblyMaterialHead.get(column)];
          material[propertyName] = value == undefined ? '' : value.toString();
        }
        dto.materials?.push(material);
      }
      var installMaterialSheetName = data[row][installcol];
      if (installMaterialSheetName != undefined && installMaterialSheetName != '/') {
        var material = new ArchitectureListMaterialCreateDto();
        material.tag = ArchitectureListMaterialTag.Install;
        for (const column in installMaterial) {
          const propertyName = installMaterial[column];
          const value = data[row][installMaterialHead.get(column)];
          material[propertyName] = value == undefined ? '' : value.toString();
        }
        dto.materials?.push(material);
      }
    }
    body.push(dto);
  }
  return {
    system: system,
    data: body,
  };
}

enum EditTyPe {
  Module = 1,
  Material = 2,
  InstallMaterial = 4,
}

interface EditFullDto {
  id: string;
  name: string | undefined;
  code: string | undefined;
  length: string | undefined;
  width: string | undefined;
  height: string | undefined;
  category: string | undefined;
  system: string | undefined;
  processingMode: string | undefined;
  processingCode: string | undefined;
  unit: string | undefined;
  supplyMode: string | undefined;
  detailNum: string | undefined;
  assemblyDrawingNum: string | undefined;
  processNum: string | undefined;
  moduleSpecification: string | undefined;
  composition: string | undefined;
  materialQuality: string | undefined;
  basicPerformance: string | undefined;
  isProcess: string | undefined;
  remark: string | undefined;
  usage: string | undefined;
  installationCode: string | undefined;
  modifyStatus: ArchitectureListModifyStatus;
  optional: string | undefined;
  optionalNum: string | undefined; //只用于前端选配的假数据 用来区分选配选了相同项情况
  type: EditTyPe;
  files: [];
  children: EditFullDto[] | undefined;
}

export function initSelect() {
  return {
    id: '',
    name: '',
    code: '',
    length: '',
    width: '',
    height: '',
    category: '',
    system: '',
    processingMode: '',
    processingCode: '',
    unit: '',
    supplyMode: '',
    detailNum: '',
    assemblyDrawingNum: '',
    processNum: '',
    moduleSpecification: '',
    composition: '',
    materialQuality: '',
    basicPerformance: '',
    isProcess: '',
    remark: '',
    usage: '',
    installationCode: '',
    optional: '',
    optionalNum: '',
    files: [],
    modifyStatus: ArchitectureListModifyStatus.Normal,
    type: EditTyPe.Module,
    children: undefined,
  };
}

export function getEditDataSource(data: ArchitectureListModuleDto) {
  let root = setModule(data);
  if (data.materials) {
    var materials = data.materials.filter((x) => x.tag == ArchitectureListMaterialTag.Assemble);
    if (materials) {
      for (let item of materials) {
        const child = setMaterial(item);
        if (root.children) {
          root.children.push(child);
        }
      }
    }
    var installMaterials = data.materials.filter(
      (x) => x.tag == ArchitectureListMaterialTag.Install,
    );
    if (installMaterials) {
      for (let item of installMaterials) {
        const child = setMaterial(item);
        if (root.children) {
          root.children.push(child);
        }
      }
    }
  }
  return [root];

  function setModule(data: any) {
    const result: EditFullDto = {
      id: data.id,
      name: data.name,
      code: data.model,
      length: data.length,
      width: data.width,
      height: data.height,
      category: data.category,
      system: data.system,
      processingMode: data.processingMode,
      processingCode: data.processingCode,
      unit: data.unit,
      supplyMode: data.supplyMode,
      detailNum: data.detailNum,
      assemblyDrawingNum: data.assemblyDrawingNum,
      processNum: data.processNum,
      moduleSpecification: data.moduleSpecification,
      composition: '',
      materialQuality: '',
      basicPerformance: '',
      isProcess: '',
      remark: data.remark,
      usage: '',
      installationCode: '',
      optionalNum: '',
      modifyStatus: data.modifyStatus,
      type: EditTyPe.Module,
      optional: data.optional,
      files: data.files,
      children: [],
    };
    return result;
  }

  function setMaterial(data: any) {
    const result: EditFullDto = {
      id: data.id,
      name: data.name,
      code: data.code,
      length: data.length,
      width: data.width,
      height: data.height,
      category: '',
      system: '',
      processingMode: '',
      processingCode: '',
      unit: data.unit,
      supplyMode: '',
      detailNum: '',
      assemblyDrawingNum: '',
      processNum: '',
      moduleSpecification: '',
      optionalNum: '',
      composition: data.composition,
      materialQuality: data.materialQuality,
      basicPerformance: data.basicPerformance,
      isProcess: data.isProcess,
      remark: data.remark,
      usage: data.usage,
      installationCode: data.installationCode,
      modifyStatus: data.modifyStatus,
      optional: '',
      files: [],
      type:
        data.tag == ArchitectureListMaterialTag.Assemble
          ? EditTyPe.Material
          : EditTyPe.InstallMaterial,
      children: undefined,
    };
    return result;
  }
}

export async function exportFromExcel(data, add) {
  var body = seriesData(data);
  return await _service.importFromExcel(body.system, add, body.data);
}

export async function getTreeDataAsync() {
  return await _service.getTree();
}

export async function updateTreeNodeAsync(data: ArchitectureListTreeDto) {
  return await _service.updateTreeNode(data);
}

export async function pageTableAsync(body) {
  return await _service.page(body);
}

export async function deletDataAsync(id) {
  return await _service.delete(id);
}

export async function updateDataStatusAsync(body) {
  return await _service.updateStatus(body);
}

export async function updateModuleAsync(data: EditFullDto) {
  var dto = new ArchitectureListModuleDto();
  dto.id = data.id;
  dto.name = data.name;
  dto.model = data.code;
  dto.length = data.length;
  dto.width = data.width;
  dto.height = data.height;
  dto.category = data.category;
  dto.system = data.system;
  dto.processingMode = data.processingMode;
  dto.processingCode = data.processingCode;
  dto.unit = data.unit;
  dto.supplyMode = data.supplyMode;
  dto.detailNum = data.detailNum;
  dto.assemblyDrawingNum = data.assemblyDrawingNum;
  dto.processNum = data.processNum;
  dto.moduleSpecification = data.moduleSpecification;
  dto.modifyStatus = data.modifyStatus;
  dto.optional = data.optional;
  dto.remark = data.remark;
  dto.files = data.files;
  dto.materials = [];
  debugger;
  if (data.children) {
    for (let item of data.children) {
      var material = new ArchitectureListMaterialDto();
      material.tag =
        item.type == EditTyPe.Material
          ? ArchitectureListMaterialTag.Assemble
          : ArchitectureListMaterialTag.Install;
      material.id = item.id;
      material.name = item.name;
      material.code = item.code;
      material.composition = item.composition;
      material.length = item.length;
      material.width = item.width;
      material.height = item.height;
      material.materialQuality = item.materialQuality;
      material.basicPerformance = item.basicPerformance;
      material.unit = item.unit;
      material.isProcess = item.isProcess;
      material.remark = item.remark;
      material.usage = item.usage;
      material.installationCode = item.installationCode;
      material.modifyStatus = item.modifyStatus;
      dto.materials?.push(material);
    }
  }
  return await _service.update(dto).then(async (response) => {
    await _service.insertModuleFiles(
      response.id,
      dto.files?.map((x) => x.id),
    );
  });
}

export async function getFileListAsync(body) {
  return await _service.getFileList(body.id, body.status);
}

export async function deleteFileAsync(id) {
  return await _service.deleteFile(id);
}

export async function insertFileAsync(id, status, body) {
  return await _service.insertFile(id, status, body);
}

export async function getTokenAsync() {
  return await _service.getToken();
}

export async function uploadModelAsync(file) {
  return await _service.upLoadModel(file);
}

export async function getModelListAsync() {
  return await _service.getModelList();
}

export async function getModelStatus(urn) {
  return await _service.getStatus(urn);
}

export async function getThreeUrlAsync(name, type, code) {
  return await _familyService.archSearch(name, type, code);
}

export async function copyDataAsync(ids) {
  return await _service.copyModules(ids);
}

export async function insertModuleAsync(data: EditFullDto) {
  var dto = new ArchitectureListModuleDto();
  dto.name = data.name;
  dto.model = data.code;
  dto.length = data.length;
  dto.width = data.width;
  dto.height = data.height;
  dto.category = data.category;
  dto.system = data.system;
  dto.processingMode = data.processingMode;
  dto.processingCode = data.processingCode;
  dto.unit = data.unit;
  dto.supplyMode = data.supplyMode;
  dto.detailNum = data.detailNum;
  dto.assemblyDrawingNum = data.assemblyDrawingNum;
  dto.processNum = data.processNum;
  dto.moduleSpecification = data.moduleSpecification;
  dto.modifyStatus = data.modifyStatus;
  dto.optional = data.optional;
  dto.remark = data.remark;
  dto.files = data.files;
  dto.materials = [];

  if (data.children) {
    for (let item of data.children) {
      var material = new ArchitectureListMaterialDto();
      material.tag =
        item.type == EditTyPe.Material
          ? ArchitectureListMaterialTag.Assemble
          : ArchitectureListMaterialTag.Install;
      material.id = item.id;
      material.name = item.name;
      material.code = item.code;
      material.composition = item.composition;
      material.length = item.length;
      material.width = item.width;
      material.height = item.height;
      material.materialQuality = item.materialQuality;
      material.basicPerformance = item.basicPerformance;
      material.unit = item.unit;
      material.isProcess = item.isProcess;
      material.remark = item.remark;
      material.usage = item.usage;
      material.installationCode = item.installationCode;
      material.modifyStatus = item.modifyStatus;
      dto.materials?.push(material);
    }
  }
  return await _service.insertModule(dto).then(async (response) => {
    await _service.insertModuleFiles(
      response.id,
      dto.files?.map((x) => x.id),
    );
  });
}
