import Compressor from 'compressorjs';
import {
  IMaterialManageHomeItem,
  MaterailManageServiceProxy,
  MaterialManageDto,
  MaterialManageFullDto,
  MaterialManageSaveDto,
  ProjectInfoServiceProxy,
} from '/@/services/ServiceProxies';
const service = new MaterailManageServiceProxy();
const projectservice = new ProjectInfoServiceProxy();

export async function uploadImage(file) {
  return await service.uploadImage(file);
}

export async function pageHomeData(body) {
  return await service.pageHome(body);
}

export async function getDetailData(id) {
  return await service.getDetail(id);
}

export async function getManageExtra() {
  return await service.manageExtraInfo();
}

export async function pageManageTable(body) {
  return await service.pageManage(body);
}

export async function getProjectInfo(body) {
  return await projectservice.parsing(body);
}

export function getImportExcelData(data) {
  console.log(data);
  if (data.length == 0) return [];
  const tmplatemap = {
    材料状态: 'status',
    材质类型: 'materialType',
    材质纹理: 'materialTexture',
    表面质感: 'materialSurface',
    顺序码: 'sequenceCode',
    封样样品存放处: 'storagePlace',
    宽幅: 'width',
    厚度: 'thickness',
    克重: 'weight',
    每卷长度: 'length',
    供应商名称: 'supplier',
    供应商编码: 'supplierCode',
    价格区间: 'price',
    起订量: 'quantity',
    供货周期: 'deliveryCycle',
    样册系列名称: 'seriesName',
    样册编码: 'seriesCode',
  };
  const head = data[0];
  var excelhead = new Map();
  for (let cell = 0; cell < head.length; cell++) {
    if (head[cell] == undefined) continue;
    var str = head[cell].toString();
    for (const column in tmplatemap) {
      if (str.includes(column) && !excelhead.has(column)) {
        excelhead.set(column, cell);
        break;
      }
    }
  }
  var body: any[] = [];
  for (let row = 1; row < data.length; row++) {
    if (data[row][1] == undefined) break;
    var dto = new MaterialManageFullDto();
    for (const column in tmplatemap) {
      const propertyName = tmplatemap[column];
      const value = data[row][excelhead.get(column)];
      dto[propertyName] = value == undefined ? '' : value.toString();
    }
    body.push(dto);
  }

  if (body.length == 0) {
    throw new Error('表格有误');
  }
  return body;
}

export async function importMaterialImages(image, downloads) {
  return await service.insertMaterialImage(image, downloads);
}

export async function importSeriesImages(image) {
  return await service.insertSeriesImage(image);
}

export async function saveManageTable(body) {
  var savedto = new MaterialManageSaveDto();
  savedto.insert = body.insertRecords.map((x) => new MaterialManageDto(x));
  savedto.delete = body.removeRecords.map((x) => new MaterialManageDto(x));
  savedto.modify = body.updateRecords.map((x) => new MaterialManageDto(x));
  return await service.save(savedto);
}

export async function carmeraSearch(key, file) {
  return await service.cameraSearch(key, file);
}

export function imageCompressor(image, backType, maxSizeInBytes) {
  return new Promise((resolve, reject) => {
    let quality = 1.0;
    const maxWidth = 600;
    const maxHeight = 800;
    const maxAttempts = 10;
    let currentAttempts = 0;

    const compress = () => {
      new Compressor(image, {
        quality,
        maxWidth,
        maxHeight,
        success(result) {
          // 检查压缩后图片大小是否满足要求
          if (result.size <= maxSizeInBytes) {
            let file = new File([result], image.name, { type: image.type });

            if (!backType || backType == 'blob') {
              resolve(result);
            } else if (backType == 'file') {
              resolve(file);
            } else {
              resolve(file);
            }
          } else {
            // 如果大小超过目标值，减小压缩质量并重新尝试
            currentAttempts++;
            if (currentAttempts < maxAttempts) {
              quality -= 0.1; // 减小0.1，可以根据需要调整
              compress();
            } else {
              reject(new Error('无法将图片压缩到指定大小范围内'));
            }
          }
        },
        error(err) {
          console.log('图片压缩失败---->>>>>', err);
          reject(err);
        },
      });
    };
    compress();
  });
}

interface SelectCell {
  name: string;
  active: Boolean;
  invalid: Boolean;
}
interface SelectRow {
  title: string;
  data: SelectCell[];
}

export function initSearchData() {
  const searchData = [
    {
      title: '材质类型',
      data: [
        '全部',
        'PVC（水性）',
        'PVC（油性）',
        'PET',
        'PP（国产）',
        'PP（进口）',
        'PVC墙布',
        '墙布',
        '皮革',
      ],
    },
    {
      title: '材质纹理',
      data: ['全部', '纯色', '木纹', '布纹', '皮纹', '石纹', '金属纹', '艺术纹'],
    },
    {
      title: '表面质感',
      data: [
        '全部',
        '肤感',
        '磨砂',
        '亮光',
        '木纹',
        '木纹同步纹',
        '布纹',
        '皮纹',
        '油漆',
        '拉丝',
        '艺术纹',
      ],
    },
  ];
  let result: SelectRow[] = [];
  for (let item of searchData) {
    let data: any[] = [];
    for (let tmp of item.data) {
      data.push({
        name: tmp,
        active: tmp == '全部' ? true : false,
        invalid: false,
      });
    }
    result.push({
      title: item.title,
      data: data,
    });
  }
  return result;
}

export class MaterialManageHomeDto {
  id: string | undefined;
  materialImageUrl: string | undefined;
  sequenceCode: string | undefined;
  materialType: string | undefined;
  materialTexture: string | undefined;
  materialSurface: string | undefined;
  /** 拍照识别相似度 */
  similarity: string | undefined;
  picker: Boolean;
  constructor(data: IMaterialManageHomeItem | undefined, picker: Boolean) {
    this.id = '';
    this.picker = picker;
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) (<any>this)[property] = (<any>data)[property];
      }
    }
  }
}
