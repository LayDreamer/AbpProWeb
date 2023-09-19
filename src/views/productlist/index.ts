import { start } from 'nprogress';
import {
  ProductInventoryTreeServiceProxy,
  ProductInventoryProductServiceProxy,
  OrderNotificationSearchDto,
  ProductInventoryProductCreateDto,
  ProductInventoryEditDto,
} from '/@/services/ServiceProxies';
const _treeServic = new ProductInventoryTreeServiceProxy();
const _productService = new ProductInventoryProductServiceProxy();

export class ProductSheet {
  private productHead;
  private moduleHead;
  private materialHead;
  System: string | undefined;
  Series: string | undefined;
  Remark: string | undefined;
  Product: Product[];
  constructor() {
    this.Product = [];
    this.productHead = new Map();
    this.moduleHead = new Map();
    this.materialHead = new Map();
  }
  init(data: any[]) {
    this.getSeries(data[2], data[3]);
    const head1 = data[6],
      head2 = data[7],
      head3 = data[8];
    this.getHead(head1, head2, head3);
    const productrow = data.filter((value) => {
      return data.indexOf(value) > 8 && value[0] !== undefined;
    });
    for (let i = 0; i < productrow.length; i++) {
      let index = productrow[i][this.productHead.get('序号')].toString();
      if (index.includes('备注')) {
        for (let j = 1; j < 10; j++) {
          let t = productrow[i][j];
          if (t != undefined) {
            this.Remark = t;
            break;
          }
        }

        break;
      }
      this.Product.push(
        new Product(
          data,
          data.indexOf(productrow[i]),
          data.indexOf(productrow[i + 1]),
          this.productHead,
          this.moduleHead,
          this.materialHead,
          this.Series,
        ),
      );
    }
  }

  getSeries(data1, data2) {
    let tmp: string[] = [];
    for (const item of data1) {
      if (item !== undefined) {
        tmp.push(item);
      }
    }
    if (tmp.length == 0) {
      throw new Error('请检查产品系统是否存在');
    }
    this.System = tmp[tmp.length - 1];
    tmp = [];
    for (const item of data2) {
      if (item !== undefined) {
        tmp.push(item);
      }
    }
    if (tmp.length == 0) {
      throw new Error('请检查产品系列是否存在');
    }
    this.Series = tmp[tmp.length - 1];
  }

  getHead(head1, head2, head3) {
    const productCellIndex: number[] = [0];
    const moduleCellIndex: number[] = [];
    const materialCellIndex: number[] = [];
    for (const item of head1) {
      if (item == undefined) continue;
      const index = head1.indexOf(item);
      if (item.trim() == '模块信息') {
        productCellIndex.push(index - 1);
        moduleCellIndex.push(index);
      } else if (item.trim() == '物料信息') {
        moduleCellIndex.push(index - 1);
        materialCellIndex.push(index);
        for (let i = index + 1; i < head1.length; i++) {
          if (head1[i] !== undefined) {
            materialCellIndex.push(i - 1);
            break;
          }
        }
      } else if (item.trim() == '模块定制规范') {
        this.moduleHead.set('模块定制规范', index);
        this.materialHead.set('模块定制规范', index);
      } else if (item.trim() == '产品定制规范') {
        this.productHead.set('产品定制规范', index);
      } else if (item.trim() == '加工图图号') {
        this.productHead.set('加工图图号', index);
      } else if (item.trim() == '装配图图号') {
        this.productHead.set('装配图图号', index);
      } else if (item.trim() == '节点图图号') {
        this.productHead.set('节点图图号', index);
      } else if (item.trim() == '备注') {
        this.productHead.set('备注', index);
      } else if (item.trim() == '项目编码') {
        this.productHead.set('项目编码', index);
      } else if (item.trim() == '项目名称') {
        this.productHead.set('项目名称', index);
      }
    }
    for (const item of head2) {
      if (item === undefined) continue;
      if (item.trim() == '层级') {
        this.materialHead.set('层级', head2.indexOf(item));
        continue;
      }
      if (item.trim() == '供货方式') {
        this.moduleHead.set('供货方式', head2.indexOf(item));
        this.materialHead.set('供货方式', head2.indexOf(item));
        break;
      }
    }
    this.productHead.set('序号', 0);
    for (let i = productCellIndex[0]; i <= productCellIndex[1]; i++) {
      if (head2[i] === undefined) continue;
      if (head2[i].toString().includes('尺寸')) {
        for (let j = productCellIndex[0]; j <= productCellIndex[1]; j++) {
          if (head3[j] === undefined) continue;
          this.productHead.set(head3[j], j);
        }
      } else {
        this.productHead.set(head2[i], i);
      }
    }
    for (let i = moduleCellIndex[0]; i <= moduleCellIndex[1]; i++) {
      if (head2[i] === undefined) continue;
      if (head2[i].toString().includes('尺寸')) {
        for (let j = moduleCellIndex[0]; j <= moduleCellIndex[1]; j++) {
          if (head3[j] === undefined) continue;
          this.moduleHead.set(head3[j], j);
        }
      } else {
        this.moduleHead.set(head2[i], i);
      }
    }
    for (let i = materialCellIndex[0]; i <= materialCellIndex[1]; i++) {
      if (head2[i] === undefined) continue;
      if (head2[i].toString().includes('尺寸')) {
        for (let j = materialCellIndex[0]; j <= materialCellIndex[1]; j++) {
          if (head3[j] === undefined) continue;
          this.materialHead.set(head3[j], j);
        }
      } else if (head2[i].toString().replace(/\r\n/g, '') == '加工是/否') {
        this.materialHead.set('加工是/否', i);
      } else {
        this.materialHead.set(head2[i], i);
      }
    }
  }

  async import() {
    const body: ProductInventoryProductCreateDto[] = [];
    for (const item of this.Product) {
      const dto = new ProductInventoryProductCreateDto();
      dto.init(item);
      body.push(dto);
    }
    await _productService.importFromExcel(this.System, this.Series, this.Remark, body);
  }
}

class Product {
  system!: string | undefined;
  series!: string | undefined;
  limitInfos!: string | undefined;
  projectCode!: string | undefined;
  projectName!: string | undefined;
  name: string | undefined;
  code: string | undefined;
  category: string | undefined;
  version: string | undefined;
  length: string | undefined;
  width: string | undefined;
  height: string | undefined;
  materialQuality: string | undefined;
  color: string | undefined;
  productSpecification: string | undefined;
  processNum: string | undefined;
  assemblyDrawingNum: string | undefined;
  detailNum: string | undefined;
  remark: string | undefined;
  modules: Module[];
  materials: Material[];
  private propertyMap = {
    系统: 'system',
    产品名称: 'name',
    产品编码: 'code',
    结构类别: 'category',
    产品版本: 'version',
    L: 'length',
    W: 'width',
    H: 'height',
    材质: 'materialQuality',
    颜色: 'color',
    产品定制规范: 'productSpecification',
    加工图图号: 'processNum',
    装配图图号: 'assemblyDrawingNum',
    节点图图号: 'detailNum',
    项目编码: 'projectCode',
    项目名称: 'projectName',
    备注: 'remark',
  };
  constructor(data, startRow, endRoW, ph, moh, mah, series) {
    // this.limitInfos = '50;≤;长度;≤;3020';
    this.series = series;
    this.modules = [];
    this.materials = [];
    for (const column in this.propertyMap) {
      if (column == '备注') {
        let value = '';
        const cell = ph.get(column);
        for (let i = startRow; i < endRoW; i++) {
          if (data[i][cell] !== undefined) {
            value += data[i][cell] + '   ';
          }
        }
        this.remark = value;
        break;
      }
      if (column == '产品定制规范') {
        const value = data[startRow][ph.get(column)];
        let d = '';
        if (value !== undefined) {
          d = value.replace(/\s/g, '');
        }
        this.productSpecification = d;
        continue;
      }
      const propertyName = this.propertyMap[column];
      const value = data[startRow][ph.get(column)];
      this[propertyName] = value == undefined ? '' : value.toString();
    }
    const productDatas = data.filter((value) => {
      const index = data.indexOf(value);
      return index >= startRow && index < endRoW;
    });

    const materialrows = productDatas.filter((value) => {
      return (
        value[moh.get('层级')] !== undefined &&
        (value[moh.get('模块名称')] === '/' || value[moh.get('模块名称')] === undefined)
      );
    });

    for (const item of materialrows) {
      this.materials.push(new Material(item, mah, true, this.system, this.series));
    }

    const modulerows = productDatas.filter((value) => {
      const name = value[moh.get('模块名称')];
      return value[moh.get('层级')] !== undefined && name !== undefined && name !== '/';
    });

    for (let item of modulerows) {
      var startRow = data.indexOf(item);
      var end = endRoW;
      for (let i = startRow + 1; i <= endRoW; i++) {
        if (data[i][moh.get('模块名称')] !== undefined) {
          end = i;
          break;
        }
      }
      this.modules.push(new Module(data, startRow, end, moh, mah, this.system, this.series));
    }
  }
}

class Module {
  system!: string | undefined;
  series!: string | undefined;
  limitInfos!: string | undefined;
  level: string | undefined;
  name: string | undefined;
  code: string | undefined;
  category: string | undefined;
  version: string | undefined;
  length: string | undefined;
  width: string | undefined;
  height: string | undefined;
  supplyMode: string | undefined;
  moduleSpecification: string | undefined;
  materials: Material[];
  private propertyMap = {
    层级: 'level',
    模块名称: 'name',
    模块编码: 'code',
    结构类别: 'category',
    模块版本: 'version',
    L: 'length',
    W: 'width',
    H: 'height',
    供货方式: 'supplyMode',
    模块定制规范: 'moduleSpecification',
  };
  constructor(data, statRow, endRow, moh, mah, sys, ser) {
    this.materials = [];
    this.system = sys;
    this.series = ser;
    for (const column in this.propertyMap) {
      const propertyName = this.propertyMap[column];
      const value = data[statRow][moh.get(column)];
      this[propertyName] = value == undefined ? '' : value.toString();
    }
    for (let i = statRow; i < endRow; i++) {
      this.materials.push(new Material(data[i], mah, false, this.system, this.series));
    }
  }
}

class Material {
  system!: string | undefined;
  series!: string | undefined;
  level!: string | undefined;
  property: string | undefined;
  name: string | undefined;
  code: string | undefined;
  length: string | undefined;
  width: string | undefined;
  height: string | undefined;
  materialQuality: string | undefined;
  color: string | undefined;
  usage: string | undefined;
  unit: string | undefined;
  isProcess: string | undefined;
  supplyMode: string | undefined;
  moduleSpecification: string | undefined;
  remark: string | undefined;
  private propertyMap = {
    层级: 'level',
    属性: 'property',
    物料名称: 'name',
    物料编码: 'code',
    L: 'length',
    W: 'width',
    H: 'height',
    材质: 'materialQuality',
    颜色: 'color',
    用量: 'usage',
    单位: 'unit',
    '加工是/否': 'isProcess',
    供货方式: 'supplyMode',
    模块定制规范: 'moduleSpecification',
  };
  constructor(data, head, inProduct, sys, ser) {
    this.system = sys;
    this.series = ser;
    for (const column in this.propertyMap) {
      if (!inProduct && (column === '供货方式' || column == '模块定制规范')) {
        continue;
      }
      const propertyName = this.propertyMap[column];
      const value = data[head.get(column)];
      if (column == '层级') {
        if (inProduct) this[propertyName] = value == undefined ? '' : value.toString();
      } else {
        this[propertyName] = value == undefined ? '' : value.toString();
      }
    }
  }
}

export async function getPrductArchitectureListTreesAsync() {
  // let result: any = [];
  // await _treeServic.getTree().then((out) => {
  //   if (Array.isArray(out.children)) {
  //     result = out.children;
  //   }
  // });
  // return result;
  return await _treeServic.getTree();
}

export async function getProductArchitetureByTreeAsync(input: OrderNotificationSearchDto) {
  return await _productService.pageProducts(input);
}

export async function updateSeriesRemark(id, remark) {
  return await _treeServic.updateRemark(id, remark);
}

function setData(data) {
  if (data.data.creationTime) {
    data.data.creationTime = data.data.creationTime.format();
  }
  if (data.data.lastModificationTime) {
    data.data.lastModificationTime = data.data.lastModificationTime.format();
  }
  if (data.children) {
    for (const child of data.children) {
      setData(child);
    }
  }
}

export async function updateProductArchiteture(deletes, dto) {
  if (deletes && deletes.length > 0) {
    for (const item of deletes) {
      setData(item);
    }
    await _productService.deleteEdits(deletes);
  }
  setData(dto);
  return await _productService.updateProduct(dto);
}

export async function addProducts(dtos) {
  return await _productService.addProduct(dtos);
}

export async function getProductDetail(id) {
  return await _productService.getProductDetails(id).then((response) => {
    setChild(response);
    return response.children;
  });
}

export async function deleteProducts(ids) {
  return await _productService.deleteProducts(ids);
}

function setChild(father) {
  if (father.children) {
    if (father.children.length == 0) {
      father.children = undefined;
      return;
    } else {
      for (const child of father.children) {
        if (child.children) {
          if (child.children.length === 0) {
            child.children = undefined;
          } else {
            setChild(child);
          }
        }
      }
    }
  }
}

export async function getProductEdit(id) {
  return await _productService.getProductDetails(id).then((response) => {
    setChild(response);
    return [response];
  });
}

export async function copyProducts(ids) {
  return await _productService.copyProduct(ids);
}

export function getCalcuteValue(str: string) {
  if (str.includes('取整')) {
    var max = 10;
    var find = str.indexOf('取整');
    while (find !== -1 && max-- > 0) {
      let end = 0;
      var left = new Array();
      for (let i = find + 2; i < str.length; i++) {
        if (str[i] == '(') {
          left.push(i);
        }
        if (str[i] == ')') {
          left.pop();
          if (left.length === 0) {
            end = i;
            break;
          }
        }
      }
      var sub1 = str.substring(find, end + 1);
      var r = getCalcuteValue(sub1.substring(3, sub1.length - 1));
      str = str.replace(sub1, Math.ceil(parseFloat(eval(r))).toString());
      find = str.indexOf('取整');
    }
    var calcute = eval(str);
    return parseFloat(calcute.toFixed(3)).toString();
  } else {
    var calcute = eval(str);
    return parseFloat(calcute.toFixed(3)).toString();
  }
}

function getCookieValue(cookieName) {
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.startsWith(cookieName + '=')) {
      return cookie.substring(cookieName.length + 1);
    }
  }
  return null;
}

export async function getErpToken() {
  var token = getCookieValue('ERPTOKEN');
  if (token == null) {
    token = await _productService.erpGetToken();
    // 设置过期时间为12 小时
    const expiration: string = new Date(new Date().getTime() + 12 * 60 * 60 * 1000).toUTCString();
    document.cookie = `ERPTOKEN=${token}; expires=${expiration}; path=/`;
  }
  return token;
}

export async function getErpDataByNameCode(body) {
  const token = await getErpToken();
  return await _productService.erpGetProduct(token, body);
}

export function setErpDataToEdit(data: ProductInventoryEditDto, erp: ProductInventoryEditDto) {
  data.code = erp.code;
  data.name = erp.name;
  data.length = erp.length;
  data.width = erp.width;
  data.height = erp.height;
  data.color = erp.color;
  data.series = erp.series;
  data.system = erp.system;
  data.materialQuality = erp.materialQuality;
  data.unit = erp.unit;
}

export async function upDateProductStatus(body) {
  return await _productService.publishProducts(body);
}

export async function uploadProductImage(id, file) {
  return await _productService.uploadProductImage(id, file);
}
