<template>
  <PageWrapper :title="fileName + `的内容`" contentBackground @back="goBack">
    <div>
      <div id="mysheet" style="margin: 0px; padding: 0px; width: 100%; height: 800px"></div>
    </div>
  </PageWrapper>
</template>
<script>
  import LuckyExcel from 'luckyexcel';
  import { PageWrapper } from '/@/components/Page';
  import { useGo } from '/@/hooks/web/usePage';
  export default {
    name: 'ExcelDes',
    props: {
      msg: String,
    },
    components: {
      PageWrapper,
    },
    setup() {
      const go = useGo();
      const url = window.location.href.toString();
      const reg = /msg=([^&]*)/;
      const match = url.match(reg);
      const fileName = match ? decodeURIComponent(match[1]) : '';
      // 加载 excel 文件
      LuckyExcel.transformExcelToLuckyByUrl(
        'https://bds.chinayasha.com/bdsfileservice/ProcessingList/' + fileName,
        '',
        (exportJson, luckysheetfile) => {
          if (exportJson.sheets == null || exportJson.sheets.length == 0) {
            alert('文件读取失败!');
            return;
          }
          // 销毁原来的表格
          window.luckysheet.destroy();
          // 重新创建新表格
          window.luckysheet.create({
            container: 'mysheet', // 设定DOM容器的id
            showtoolbar: true, // 是否显示工具栏
            showinfobar: false, // 是否显示顶部信息栏
            showstatisticBar: false, // 是否显示底部计数栏
            sheetBottomConfig: false, // sheet页下方的添加行按钮和回到顶部按钮配置
            allowEdit: false, // 是否允许前台编辑
            enableAddRow: false, // 是否允许增加行
            enableAddCol: false, // 是否允许增加列
            sheetFormulaBar: false, // 是否显示公式栏
            enableAddBackTop: false, //返回头部按钮
            data: exportJson.sheets, //表格内容
            title: exportJson.info.name, //表格标题
          });
        },
      );
      function goBack() {
        go('/processingList/gyhProcessingList');
      }
      return {
        goBack,
        fileName,
      };
    },
  };
</script>
