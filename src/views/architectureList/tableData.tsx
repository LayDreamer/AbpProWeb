import { Tag } from 'ant-design-vue';
import { h } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { ArchitectureListPublishStatus } from '/@/services/ServiceProxies';

export function mainTableColumn(): BasicColumn[] {
  return [
    {
      title: '状态',
      width: 80,
      customRender: ({ record }) => {
        let text = '';
        switch (record.status) {
          case ArchitectureListPublishStatus.InMark:
            text = '上市';
            break;
          case ArchitectureListPublishStatus.DelayInMark:
            text = '待上市';
            break;
          case ArchitectureListPublishStatus.OutMark:
            text = '下市';
            break;
          case ArchitectureListPublishStatus.DelayOutMark:
            text = '待下市';
            break;
        }
        return h('div', text);
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 300,
      minWidth: 250,
      maxWidth: 500,
      resizable: true,
      sorter: true,
      customRender: ({ text }) => {
        return h(
          'div',
          {
            style: {
              textAlign: 'left !important',
            },
          },
          text,
        );
      },
    },
    {
      title: '类别',
      dataIndex: 'category',
      sorter: true,
      width: 100,
    },
    {
      title: '型号',
      dataIndex: 'model',
      width: 200,
      minWidth: 180,
      maxWidth: 400,
      resizable: true,
      sorter: true,
      customRender: ({ text }) => {
        return h(
          'div',
          {
            style: {
              textAlign: 'left !important',
            },
          },
          text,
        );
      },
    },
    {
      title: '加工方式',
      dataIndex: 'processingMode',
      width: 120,
      minWidth: 100,
      maxWidth: 300,
      resizable: true,
      sorter: true,
      customRender: ({ text }) => {
        return h(
          'div',
          {
            style: {
              textAlign: 'left !important',
            },
          },
          text,
        );
      },
    },
    {
      title: '加工码',
      dataIndex: 'processingCode',
      sorter: true,
      width: 100,
    },
    {
      title: '长(mm)',
      dataIndex: 'length',
      width: 80,
    },
    {
      title: '宽(mm)',
      dataIndex: 'width',
      width: 80,
    },
    {
      title: '高(mm)',
      dataIndex: 'height',
      width: 80,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      sorter: true,
      width: 100,
    },
    {
      title: '选配',
      width: '60',
      customRender: ({ record }) => {
        let text = '';
        let color = '';
        if (record.optional) {
          text = '是';
          color = 'yellow';
        } else {
          text = '否';
          color = 'blue';
        }
        return h(
          Tag,
          {
            color: color,
          },
          () => text,
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 400,
      minWidth: 350,
      maxWidth: 420,
      resizable: true,
      customRender: ({ text }) => {
        return h(
          'div',
          {
            style: {
              textAlign: 'left !important',
            },
          },
          text,
        );
      },
    },
    {
      title: '路径',
      dataIndex: 'path',
      width: 150,
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'creationTime',
      width: 200,
      sorter: true,
    },
    {
      title: '更新人',
      dataIndex: 'modifyUser',
      width: 100,
    },
    {
      title: '更新时间',
      dataIndex: 'lastModificationTime',
      width: 200,
      sorter: true,
    },
  ];
}

export function materialTableColumn(): BasicColumn[] {
  return [
    {
      title: '物料名称',
      dataIndex: 'composition',
      width: 120,
    },
    {
      title: '物料名称Ⅱ',
      dataIndex: 'name',
      width: 150,
      minWidth: 100,
      maxWidth: 400,
      resizable: true,
    },
    {
      title: '编码',
      dataIndex: 'code',
      width: 120,
    },
    {
      title: '长(mm)',
      dataIndex: 'length',
      width: 100,
    },
    {
      title: '宽(mm)',
      dataIndex: 'width',
      width: 100,
    },
    {
      title: '高(mm)',
      dataIndex: 'height',
      width: 100,
    },
    {
      title: '材质',
      dataIndex: 'materialQuality',
      width: 100,
    },
    {
      title: '用量',
      dataIndex: 'usage',
      width: 250,
      minWidth: 200,
      maxWidth: 350,
      resizable: true,
    },
    {
      title: '采购单位',
      dataIndex: 'unit',
      width: 90,
    },
    {
      title: '加工是/否',
      dataIndex: 'isProcess',
      width: 100,
    },
    {
      title: '基本性能要求',
      dataIndex: 'basicPerformance',
      width: '120',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];
}

export function processingTableColumn(): BasicColumn[] {
  return [
    {
      title: '物料名称',
      dataIndex: 'composition',
      width: 120,
    },
    {
      title: '物料名称Ⅱ',
      dataIndex: 'name',
      width: 150,
      minWidth: 100,
      maxWidth: 400,
      resizable: true,
    },
    {
      title: '编码',
      dataIndex: 'code',
      width: 120,
    },
    {
      title: '长(mm)',
      dataIndex: 'length',
      width: 100,
    },
    {
      title: '宽(mm)',
      dataIndex: 'width',
      width: 100,
    },
    {
      title: '高(mm)',
      dataIndex: 'height',
      width: 100,
    },
    {
      title: '材质',
      dataIndex: 'materialQuality',
      width: 100,
    },
    {
      title: '用量',
      dataIndex: 'usage',
      width: 250,
      minWidth: 200,
      maxWidth: 350,
      resizable: true,
    },
    {
      title: '采购单位',
      dataIndex: 'unit',
      width: 100,
    },
    {
      title: '安装码',
      dataIndex: 'installationCode',
      width: 80,
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];
}

export function optionalTableColumn(): BasicColumn[] {
  return [
    {
      title: '情况',
      dataIndex: 'name',
      customRender: ({ text }) => {
        return h(
          'div',
          {
            style: {
              textAlign: 'left !important',
            },
          },
          text,
        );
      },
    },
  ];
}

export function editTableColumn(): BasicColumn[] {
  return [
    {
      title: '名称',
      dataIndex: 'name',
      customRender: ({ record }) => {
        let group: any[] = [];
        let tagText = '';
        let color = '';
        switch (record.type) {
          case 1:
            tagText = '模块';
            color = 'rgb(248 113 113)';
            break;
          case 2:
            tagText = '物料';
            color = 'rgb(125 211 252)';
            break;
          case 4:
            tagText = '安装';
            color = 'rgb(196 181 253)';
            break;
        }
        group.push(h(Tag, { color: color }, () => tagText));
        group.push(h('div', record.name));
        return h(
          'div',
          {
            class: 'flex flex-row justify-start space-x-2',
          },
          group,
        );
      },
    },
    {
      title: '型号/编码',
      dataIndex: 'code',
      width: 200,
    },
    {
      title: '长(mm)',
      dataIndex: 'length',
      width: 100,
    },
    {
      title: '宽(mm)',
      dataIndex: 'width',
      width: 100,
    },
    {
      title: '高(mm)',
      dataIndex: 'height',
      width: 100,
    },
    {
      title: '选配序号',
      dataIndex: 'optionalNum',
      width: 100,
    },
  ];
}
