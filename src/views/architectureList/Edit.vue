<template>
  <BasicModal
    v-bind="$attrs"
    :title="modalTitle"
    width="50%"
    :height="750"
    loadingTip="加载中"
    :loading="loading"
    :canFullscreen="false"
    :draggable="false"
    :maskClosable="false"
    destroyOnClose
    @register="registerModal"
    @cancel="close"
  >
    <template #footer> </template>
    <div class="h-full flex flex-col">
      <div style="max-height: 300px" class="overflow-y-auto">
        <BasicTable
          class="h-full"
          @register="registerTable"
          @row-click="tableRowClick"
          @row-contextmenu="menuClick"
          :dataSource="tableData"
          :rowClassName="rowClassName"
        >
          <template #headerCell="{ column }">
            <template v-if="column.dataIndex === 'name'">
              <div class="flex flex-row justify-between">
                <p style="height: 5px; line-height: 30px">{{ column.customTitle }}</p>
                <a-button
                  type="primary"
                  :hidden="addBtnHide"
                  style="width: 80px"
                  @click="addNewModule"
                  >{{ '新增' }}</a-button
                >
              </div>
            </template>
            <template v-if="column.dataIndex === 'code'">
              {{ column.customTitle }}
            </template>
            <template v-if="column.dataIndex === 'length'">
              {{ column.customTitle }}
            </template>
            <template v-if="column.dataIndex === 'width'">
              {{ column.customTitle }}
            </template>
            <template v-if="column.dataIndex === 'height'">
              {{ column.customTitle }}
            </template>
            <template v-if="column.dataIndex === 'optionalNum'">
              {{ column.customTitle }}
            </template>
          </template>
        </BasicTable>
      </div>
      <div class="flex bg-gray-300 h-px mt-5"></div>
      <div class="overflow-auto bg-gray-200" style="max-height: 450px" ref="editDetailInfo">
        <div class="flex p-4 flex-col" v-if="selectData != null">
          <div class="flex flex-row justify-between w-full">
            <p class="text-2xl font-bold">{{ titleInfo }}</p>
            <a-button :loading="saveLoading" type="primary" @click="saveClick">保存</a-button>
          </div>
          <div class="flex-1 flex flex-col ml-3 mr-3">
            <div class="flex justify-between">
              <div>
                <a-card
                  :title="selectData?.type != 1 ? '物料名称Ⅱ' : '模块名称'"
                  size="small"
                  style="text-align: center"
                  :style="selectData?.type != 1 ? 'width:150px' : 'width:250px'"
                  :head-style="{ background: 'rgb(203 213 225)' }"
                  :body-style="{ padding: '0' }"
                >
                  <a-textarea
                    v-model:value="selectData.name"
                    :auto-size="{ minRows: 1, maxRows: 1 }"
                    :style="{ textAlign: 'center' }"
                  />
                </a-card>
              </div>
              <div>
                <a-card
                  :title="selectData?.type != 1 ? '编码' : '型号'"
                  size="small"
                  style="width: 170px; text-align: center"
                  :head-style="{ background: 'rgb(203 213 225)' }"
                  :body-style="{ padding: '0' }"
                >
                  <a-textarea
                    v-model:value="selectData.code"
                    :auto-size="{ minRows: 1, maxRows: 3 }"
                    :style="{ textAlign: 'center' }"
                  />
                </a-card>
              </div>
              <div v-if="selectData?.type != 1">
                <a-card
                  title="物料名称"
                  size="small"
                  style="width: 100px; text-align: center"
                  :head-style="{ background: 'rgb(203 213 225)' }"
                  :body-style="{ padding: '0' }"
                >
                  <a-textarea
                    v-model:value="selectData.composition"
                    :auto-size="{ minRows: 1, maxRows: 3 }"
                    :style="{ textAlign: 'center' }"
                  />
                </a-card>
              </div>
              <div>
                <a-card
                  title="长(mm)"
                  size="small"
                  style="width: 100px; text-align: center"
                  :head-style="{ background: 'rgb(203 213 225)' }"
                  :body-style="{ padding: '0' }"
                >
                  <a-textarea
                    v-model:value="selectData.length"
                    :auto-size="{ minRows: 1, maxRows: 3 }"
                    :style="{ textAlign: 'center' }"
                  />
                </a-card>
              </div>
              <div>
                <a-card
                  title="宽(mm)"
                  size="small"
                  style="width: 100px; text-align: center"
                  :head-style="{ background: 'rgb(203 213 225)' }"
                  :body-style="{ padding: '0' }"
                >
                  <a-textarea
                    v-model:value="selectData.width"
                    :auto-size="{ minRows: 1, maxRows: 3 }"
                    :style="{ textAlign: 'center' }"
                  />
                </a-card>
              </div>
              <div>
                <a-card
                  title="高(mm)"
                  size="small"
                  style="width: 100px; text-align: center"
                  :head-style="{ background: 'rgb(203 213 225)' }"
                  :body-style="{ padding: '0' }"
                >
                  <a-textarea
                    v-model:value="selectData.height"
                    :auto-size="{ minRows: 1, maxRows: 3 }"
                    :style="{ textAlign: 'center' }"
                  />
                </a-card>
              </div>
            </div>
            <div class="flex justify-between mt-5" v-if="selectData?.type == 1">
              <div>
                <a-card
                  title="类别"
                  size="small"
                  style="width: 120px; text-align: center"
                  :head-style="{ background: 'rgb(203 213 225)' }"
                  :body-style="{ padding: '0' }"
                >
                  <a-textarea
                    v-model:value="selectData.category"
                    :auto-size="{ minRows: 1, maxRows: 3 }"
                    :style="{ textAlign: 'center' }"
                  />
                </a-card>
              </div>
              <div>
                <a-card
                  title="系统"
                  size="small"
                  style="width: 120px; text-align: center"
                  :head-style="{ background: 'rgb(203 213 225)' }"
                  :body-style="{ padding: '0' }"
                >
                  <a-textarea
                    v-model:value="selectData.system"
                    :auto-size="{ minRows: 1, maxRows: 3 }"
                    :style="{ textAlign: 'center' }"
                  />
                </a-card>
              </div>
              <div>
                <a-card
                  title="加工方式"
                  size="small"
                  style="width: 120px; text-align: center"
                  :head-style="{ background: 'rgb(203 213 225)' }"
                  :body-style="{ padding: '0' }"
                >
                  <a-textarea
                    v-model:value="selectData.processingMode"
                    :auto-size="{ minRows: 1, maxRows: 3 }"
                    :style="{ textAlign: 'center' }"
                  />
                </a-card>
              </div>
              <div>
                <a-card
                  title="加工码"
                  size="small"
                  style="width: 100px; text-align: center"
                  :head-style="{ background: 'rgb(203 213 225)' }"
                  :body-style="{ padding: '0' }"
                >
                  <a-textarea
                    v-model:value="selectData.processingCode"
                    :auto-size="{ minRows: 1, maxRows: 3 }"
                    :style="{ textAlign: 'center' }"
                  />
                </a-card>
              </div>
              <div>
                <a-card
                  title="单位"
                  size="small"
                  style="width: 100px; text-align: center"
                  :head-style="{ background: 'rgb(203 213 225)' }"
                  :body-style="{ padding: '0' }"
                >
                  <a-textarea
                    v-model:value="selectData.unit"
                    :auto-size="{ minRows: 1, maxRows: 3 }"
                    :style="{ textAlign: 'center' }"
                  />
                </a-card>
              </div>
              <div>
                <a-card
                  title="供货方式"
                  size="small"
                  style="width: 120px; text-align: center"
                  :head-style="{ background: 'rgb(203 213 225)' }"
                  :body-style="{ padding: '0' }"
                >
                  <a-textarea
                    v-model:value="selectData.supplyMode"
                    :auto-size="{ minRows: 1, maxRows: 3 }"
                    :style="{ textAlign: 'center' }"
                  />
                </a-card>
              </div>
            </div>
            <div class="flex justify-between mt-5">
              <div v-if="selectData?.type != 1">
                <a-card
                  title="材质"
                  size="small"
                  style="width: 100px; text-align: center"
                  :head-style="{ background: 'rgb(203 213 225)' }"
                  :body-style="{ padding: '0' }"
                >
                  <a-textarea
                    v-model:value="selectData.materialQuality"
                    :auto-size="{ minRows: 1, maxRows: 3 }"
                    :style="{ textAlign: 'center' }"
                  />
                </a-card>
              </div>
              <div v-if="selectData?.type != 1">
                <a-card
                  title="采购单位"
                  size="small"
                  style="width: 100px; text-align: center"
                  :head-style="{ background: 'rgb(203 213 225)' }"
                  :body-style="{ padding: '0' }"
                >
                  <a-textarea
                    v-model:value="selectData.unit"
                    :auto-size="{ minRows: 1, maxRows: 3 }"
                    :style="{ textAlign: 'center' }"
                  />
                </a-card>
              </div>
              <div v-if="selectData?.type == 2">
                <a-card
                  title="加工是/否"
                  size="small"
                  style="width: 100px; text-align: center"
                  :head-style="{ background: 'rgb(203 213 225)' }"
                  :body-style="{ padding: '0' }"
                >
                  <a-textarea
                    v-model:value="selectData.isProcess"
                    :auto-size="{ minRows: 1, maxRows: 3 }"
                    :style="{ textAlign: 'center' }"
                  />
                </a-card>
              </div>
              <div v-if="selectData?.type == 4">
                <a-card
                  title="安装码"
                  size="small"
                  style="width: 120px; text-align: center"
                  :head-style="{ background: 'rgb(203 213 225)' }"
                  :body-style="{ padding: '0' }"
                >
                  <a-textarea
                    v-model:value="selectData.installationCode"
                    :auto-size="{ minRows: 1, maxRows: 3 }"
                    :style="{ textAlign: 'center' }"
                  />
                </a-card>
              </div>
              <div v-if="selectData?.type == 2">
                <a-card
                  title="基本性能"
                  size="small"
                  style="width: 120px; text-align: center"
                  :head-style="{ background: 'rgb(203 213 225)' }"
                  :body-style="{ padding: '0' }"
                >
                  <a-textarea
                    v-model:value="selectData.basicPerformance"
                    :auto-size="{ minRows: 1, maxRows: 3 }"
                    :style="{ textAlign: 'center' }"
                  />
                </a-card>
              </div>
              <div>
                <a-card
                  title="备注"
                  size="small"
                  style="width: 200px; text-align: center"
                  :head-style="{ background: 'rgb(203 213 225)' }"
                  :body-style="{ padding: '0' }"
                >
                  <a-textarea
                    v-model:value="selectData.remark"
                    :auto-size="{ minRows: 1, maxRows: 3 }"
                    :style="{ textAlign: 'center' }"
                  />
                </a-card>
              </div>
              <div v-if="selectData?.type != 1">
                <a-card
                  title="用量"
                  size="small"
                  style="width: 200px; text-align: center"
                  :head-style="{ background: 'rgb(203 213 225)' }"
                  :body-style="{ padding: '0' }"
                >
                  <a-textarea
                    v-model:value="selectData.usage"
                    :auto-size="{ minRows: 1, maxRows: 3 }"
                    :style="{ textAlign: 'center' }"
                  />
                </a-card>
              </div>
            </div>
            <div class="flex mt-5" v-if="selectData?.type == 1">
              <div>
                <a-card
                  title="节点图图号"
                  size="small"
                  style="width: 150px; text-align: center"
                  :head-style="{ background: 'rgb(203 213 225)' }"
                  :body-style="{ padding: '0' }"
                >
                  <div class="flex justify-start w-full">
                    <a-tooltip :title="calcutedDetailNum">
                      <a-input
                        class="custom-input-disabled"
                        v-model:value="calcutedDetailNum"
                        :disabled="true"
                      />
                    </a-tooltip>
                    <a-button
                      class="custom-setting-button"
                      type="primary"
                      preIcon="lets-icons:setting-fill"
                      @click="selectFileClick(ArchitectureListFileStatus.Detail)"
                    ></a-button>
                  </div>
                </a-card>
              </div>
              <div class="ml-2">
                <a-card
                  title="装配图图号"
                  size="small"
                  style="width: 150px; text-align: center"
                  :head-style="{ background: 'rgb(203 213 225)' }"
                  :body-style="{ padding: '0' }"
                >
                  <div class="flex justify-start w-full">
                    <a-tooltip :title="calcutedAssemblyNum">
                      <a-input
                        class="custom-input-disabled"
                        v-model:value="calcutedAssemblyNum"
                        :disabled="true"
                      />
                    </a-tooltip>
                    <a-button
                      class="custom-setting-button"
                      type="primary"
                      preIcon="lets-icons:setting-fill"
                      @click="selectFileClick(ArchitectureListFileStatus.Assembly)"
                    ></a-button>
                  </div>
                </a-card>
              </div>
              <div class="ml-2">
                <a-card
                  title="加工图图号"
                  size="small"
                  style="width: 150px; text-align: center"
                  :head-style="{ background: 'rgb(203 213 225)' }"
                  :body-style="{ padding: '0' }"
                >
                  <div class="flex justify-start w-full">
                    <a-tooltip :title="calcutedProcessingNum">
                      <a-input
                        class="custom-input-disabled"
                        v-model:value="calcutedProcessingNum"
                        :disabled="true"
                      />
                    </a-tooltip>
                    <a-button
                      class="custom-setting-button"
                      type="primary"
                      preIcon="lets-icons:setting-fill"
                      @click="selectFileClick(ArchitectureListFileStatus.Processing)"
                    ></a-button>
                  </div>
                </a-card>
              </div>
            </div>
            <div class="flex mt-5" v-if="selectData?.type == 1">
              <div class="w-full">
                <a-card
                  title="模块定制规范"
                  size="small"
                  style="width: 100%; text-align: center"
                  :head-style="{ background: 'rgb(203 213 225)' }"
                  :body-style="{ padding: '0' }"
                >
                  <a-textarea
                    v-model:value="selectData.moduleSpecification"
                    :auto-size="{ minRows: 1, maxRows: 3 }"
                    :style="{ textAlign: 'left' }"
                  />
                </a-card>
              </div>
            </div>
            <div class="flex flex-col mt-5" v-if="selectData?.type == 1">
              <div class="flex flex-row">
                <p style="margin-right: 5px; color: #004496; font-weight: 600">是否选配: </p>
                <a-switch v-model:checked="optionalChecked" />
              </div>
              <div v-show="optionalChecked">
                <a-button @click="addOption">+</a-button>
                <div class="flex flex-row mt-4 h-8 w-full" v-for="(item, index) in optionalData">
                  <span style="width: 36px; margin-right: 10px; line-height: 32px">情况: </span>
                  <a-input
                    v-model:value="item.name"
                    style="text-align: left; width: 35%; margin-right: 10px"
                  />
                  <a-select
                    mode="multiple"
                    style="width: 55%"
                    v-model:value="item.select"
                    :options="selectOptions"
                    :max-tag-count="9"
                  >
                    <template #option="{ value, label, disabled, key, title }">
                      {{ title }}
                    </template>
                    <template #maxTagPlaceholder="omittedValues">
                      <span style="color: red">+ {{ omittedValues.length }} ...</span>
                    </template>
                  </a-select>
                  <a-button type="link" @click="deleteOption(index)">删除</a-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FileSelect @register="registerFileSelectModal" @selectSave="selectSave"></FileSelect>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { cloneDeep } from 'lodash-es';
  import { v4 as guid } from 'uuid';
  import { computed, defineComponent, nextTick, ref, watch, watchEffect } from 'vue';
  import { getEditDataSource, initSelect, insertModuleAsync, updateModuleAsync } from './index';
  import { editTableColumn } from './tableData';
  import { BasicModal, useModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useContextMenu } from '/@/hooks/web/useContextMenu';
  import {
    ArchitectureListFileStatus,
    ArchitectureListModifyStatus,
  } from '/@/services/ServiceProxies';
  import FileSelect from '/@/views/architectureList/EditFileSelect.vue';

  export default defineComponent({
    components: {
      BasicModal,
      BasicTable,
      FileSelect,
    },
    setup(_, { emit }) {
      let init = false;
      const modalTitle = ref('');
      const addBtnHide = ref(true);
      const editDetailInfo = ref();
      const loading = ref(true);
      const saveLoading = ref(false);
      const tableData = ref<any[]>([]);
      const selectData = ref();
      const deleteLists = ref<any[]>([]);
      const [createContextMenu, destroyContextMenu] = useContextMenu();
      selectData.value = null;
      //initSelect();
      let parentId = '';
      const titleInfo = computed(() => {
        if (selectData) {
          switch (selectData.value?.type) {
            case 1:
              return '模块信息';
            case 2:
              return '物料信息';
            case 4:
              return '安装信息';
          }
        }
      });
      const optionalChecked = ref(false);

      watch(
        optionalChecked,
        () => {
          if (tableData.value) {
            if (optionalChecked.value) {
              let i = 1;

              if (
                selectData &&
                selectData.value &&
                selectData.value.type == 1 &&
                selectData.value.children
              ) {
                for (let item of selectData.value.children) {
                  if (item.type == 4) {
                    item.optionalNum = i.toString();
                    i++;
                  }
                }
              }
            } else {
              if (
                selectData &&
                selectData.value &&
                selectData.value.type == 1 &&
                selectData.value.children
              ) {
                for (let item of selectData.value.children) {
                  if (item.type == 4) {
                    item.optionalNum = '';
                  }
                }
              }
            }
          }
        },
        { deep: true },
      );

      const optionalData = ref<any[]>([]);
      const selectOptions = ref<any[]>([]);

      watch(
        [tableData, optionalData],
        () => {
          if (selectData.value == null) {
            return;
          }
          if (init) {
            init = false;
            return;
          }
          if (selectData.value.modifyStatus == ArchitectureListModifyStatus.Normal) {
            selectData.value.modifyStatus = ArchitectureListModifyStatus.Modify;
          }
        },
        { deep: true },
      );

      const [registerFileSelectModal, { openModal }] = useModal();
      const [registerModal, { closeModal }] = useModalInner((data) => {
        optionalChecked.value = false;
        selectIndex.value = {
          index: -1,
          select: false,
        };
        deleteLists.value = [];
        modalTitle.value = data.title;
        addBtnHide.value = data.addEnable;
        if (data.type == 'add') {
          parentId = data.id;
          loading.value = false;
          return;
        }
        init = true;
        parentId = data.selectData.parentId;
        tableData.value = getEditDataSource(data.selectData);
        selectOptions.value = [];
        let i = 1;
        for (let item of tableData.value[0].children) {
          //选配下拉框只放入安装物料数据
          if (item.type == 4) {
            selectOptions.value?.push({
              value: item.id,
              title: i + ': ' + item.name + '-' + item.code,
              disabled: false,
              key: item.id,
              label: i.toString(),
            });
            i++;
          }
        }
        selectData.value = tableData.value[0];
        optionalData.value = [];
        //设置选配信息
        if (data.selectData.optional) {
          optionalChecked.value = true;
          const json = JSON.parse(selectData.value.optional);
          for (let item of json) {
            var ids = item.value.split('+');
            optionalData.value.push({
              name: item.name,
              value: item.value,
              select: selectOptions.value.filter((x) => ids.includes(x.key)).map((x) => x.key),
            });
          }
        } else {
          optionalChecked.value = false;
        }

        nextTick(expandAll);
        loading.value = false;
      });
      const [registerTable, { expandAll, expandRows }] = useTable({
        rowKey: 'id',
        size: 'small',
        striped: false,
        loading: false,
        pagination: false,
        canResize: false,
        isCanResizeParent: true,
        showIndexColumn: false,
        isTreeTable: true,
        columns: editTableColumn(),
      });

      function tableRowClick(record, index, e) {
        //同一行重复点击 点击效果轮显 新的一行显示点击效果
        if (selectIndex.value.index == index) {
          selectIndex.value.select = !selectIndex.value.select;
        } else {
          selectIndex.value.select = true;
        }
        selectIndex.value.index = index;
        selectData.value = record;
        destroyMenu(e);
      }

      function destroyMenu(e: MouseEvent) {
        destroyContextMenu({
          event: e,
        });
      }

      async function saveClick() {
        saveLoading.value = true;
        let success = true;
        let error;
        try {
          //没有勾选选配信息 清空选配信息
          if (!optionalChecked.value) {
            tableData.value[0].optional = '';
          } else if (tableData.value[0].modifyStatus == ArchitectureListModifyStatus.Modify) {
            let o: any[] = [];
            for (let item of optionalData.value) {
              o.push({
                name: item.name,
                value: item.select.join('+'),
              });
            }
            tableData.value[0].optional = JSON.stringify(o);
          }
        } catch (e) {
          success = false;
          error = e;
        }

        setTimeout(async (e) => {
          try {
            if (addBtnHide.value) {
              await updateModuleAsync(tableData.value[0]).then(() => {
                saveLoading.value = false;
                closeModal();
                emit('save', {
                  success: success,
                  error: error,
                });
              });
            } else {
              await insertModules(tableData.value);
              closeModal();
              saveLoading.value = false;
              emit('save', {
                success: success,
                error: error,
              });
            }
          } catch (ex) {
            saveLoading.value = false;
          }
        }, 100);
      }

      async function insertModules(data) {
        for (let item of data) {
          await insertModuleAsync(item);
        }
      }

      function close(e) {
        tableData.value = [];
        selectData.value = null;
        saveLoading.value = false;
        destroyMenu(e);
      }

      function addOption() {
        optionalData.value.push({
          name: '',
          value: '',
          select: [],
        });
        nextTick(() => {
          // var modalBody = document.getElementsByClassName('ant-modal-body');
          // if (modalBody.length > 0) {
          //   var scrolbar = modalBody[0].getElementsByClassName(
          //     'scrollbar__wrap scrollbar__wrap--hidden-default',
          //   );
          //   if (scrolbar.length > 0) {
          //     scrolbar[0].scrollTop = scrolbar[0].scrollHeight;
          //   }
          // }
          editDetailInfo.value.scrollTop = editDetailInfo.value.scrollHeight;
        });
      }

      function deleteOption(index) {
        optionalData.value.splice(index, 1);
      }

      function selectFileClick(data: ArchitectureListFileStatus) {
        openModal(true, {
          title:
            data == ArchitectureListFileStatus.Detail
              ? '节点图'
              : data == ArchitectureListFileStatus.Assembly
              ? '装配图'
              : '加工图',
          type: data,
          parentId: parentId,
          ids: selectData.value.files.filter((x) => x.type == data).map((x) => x.id),
        });
      }

      function selectSave(value) {
        if (value.type == ArchitectureListFileStatus.Detail) {
          selectData.value.files = selectData.value.files.filter(
            (x) => x.type != ArchitectureListFileStatus.Detail,
          );
        } else if (value.type == ArchitectureListFileStatus.Assembly) {
          selectData.value.files = selectData.value.files.filter(
            (x) => x.type != ArchitectureListFileStatus.Assembly,
          );
        } else {
          selectData.value.files = selectData.value.files.filter(
            (x) => x.type != ArchitectureListFileStatus.Processing,
          );
        }
        for (let item of value.data) {
          selectData.value.files.push(item);
        }
      }
      const calcutedDetailNum = computed(() => {
        var files = selectData.value.files.filter(
          (x) => x.type == ArchitectureListFileStatus.Detail,
        );
        if (files.length > 0) {
          return files.map((x) => x.fileName.substr(0, 10)).join('、');
        } else {
          return selectData.value.detailNum;
        }
      });

      const calcutedAssemblyNum = computed(() => {
        var files = selectData.value.files.filter(
          (x) => x.type == ArchitectureListFileStatus.Assembly,
        );
        if (files.length > 0) {
          return files.map((x) => x.fileName.substr(0, 10)).join('、');
        } else {
          return selectData.value.assemblyDrawingNum;
        }
      });

      const calcutedProcessingNum = computed(() => {
        var files = selectData.value.files.filter(
          (x) => x.type == ArchitectureListFileStatus.Processing,
        );
        if (files.length > 0) {
          return files.map((x) => x.fileName.substr(0, 10)).join('、');
        } else {
          return selectData.value.processNum;
        }
      });

      function menuClick(record, index, e) {
        const menu0 = [];
        const menu1 = [
          {
            label: '物料',
            icon: 'icon-park:add',
            handler: () => {
              addNewMaterial(record, 2);
            },
          },
          {
            label: '安装',
            icon: 'icon-park:add',
            handler: () => {
              addNewMaterial(record, 4);
            },
          },
          {
            label: '复制',
            icon: 'icon-park:copy',
            handler: () => {
              copyModule(record);
            },
          },
          {
            label: '删除',
            icon: 'icon-park:delete-five',
            handler: () => {
              deleteModule(record);
            },
          },
        ];

        const menu2 = [
          {
            label: '复制',
            icon: 'icon-park:copy',
            handler: () => {
              copyMaterial(record);
            },
          },
          {
            label: '删除',
            icon: 'icon-park:delete-five',
            handler: () => {
              deleteMateial(record);
            },
          },
        ];
        const menu3 = [
          {
            label: '物料',
            icon: 'icon-park:add',
            handler: () => {
              addNewMaterial(record, 2);
            },
          },
          {
            label: '安装',
            icon: 'icon-park:add',
            handler: () => {
              addNewMaterial(record, 4);
            },
          },
        ];

        createContextMenu({
          event: e,
          items:
            record.type === 1
              ? addBtnHide.value
                ? menu3
                : menu1
              : record.type === 2 || record.type === 4
              ? menu2
              : menu0,
        });
      }

      function scrollToInsertRow(id) {
        setTimeout(function () {
          var trElement = document.querySelector('tr[data-row-key="' + id + '"]');
          trElement?.scrollIntoView();
        }, 50);
      }

      ///新增模块
      function addNewModule() {
        const module = initSelect();
        module.name = '(空白模块)';
        module.type = 1;
        module.id = guid();
        tableData.value.push(module);
        selectData.value = module;
        if (module.children === undefined) {
          module.children = [];
        }
        expandRows([module.id]);
        scrollToInsertRow(module.id);
      }

      ///新增物料
      function addNewMaterial(data, type) {
        const material = initSelect();
        material.name = type == 2 ? '(空白物料)' : '(空白安装)';
        material.id = guid();
        material.type = type;
        material.modifyStatus = ArchitectureListModifyStatus.Insert;
        data.modifyStatus = ArchitectureListModifyStatus.Modify;
        data.children.push(material);
        selectData.value = material;
        scrollToInsertRow(material.id);
      }

      ///复制模块
      function copyModule(data) {
        var clone = cloneDeep(data);
        setCopyId(clone, clone.parentId);
        tableData.value.push(clone);
        selectData.value = clone;
        expandRows([clone.id]);
        scrollToInsertRow(clone.id);
      }

      ///复制物料
      function copyMaterial(data) {
        var father = findParent(data.id);
        if (father) {
          var clone = cloneDeep(data);
          setCopyId(clone, clone.parentId);
          father.children.push(clone);
          selectData.value = clone;
          scrollToInsertRow(clone.id);
        }
      }

      ///删除模块
      function deleteModule(data) {
        data.modifyStatus = ArchitectureListModifyStatus.Delete;
        tableData.value = tableData.value.filter((e) => e !== data);
        selectData.value = tableData.value[0];
      }

      ///删除物料
      function deleteMateial(data) {
        data.modifyStatus = ArchitectureListModifyStatus.Delete;
        const parent = findParent(data.id);
        parent.modifyStatus = ArchitectureListModifyStatus.Modify;
        if (parent && parent.children) {
          parent.children = parent.children.filter((e) => e !== data);
          if (parent.children.length == 0) {
            selectData.value = parent;
          } else {
            selectData.value = parent.children[0];
          }
        }
      }

      ///根据子id找父级
      function findParent(id) {
        if (tableData && id) {
          for (let item of tableData.value) {
            var find = findTableData(item, id);
            if (find !== null) {
              return item;
            }
          }
        }
        return null;
      }
      function findTableData(data, id) {
        if (data) {
          if (data.id == id) {
            return data;
          } else if (data.children) {
            for (let item of data.children) {
              const result = findTableData(item, id);
              if (result) {
                return result;
              }
            }
          }
        }
        return null;
      }
      function setCopyId(clone, parentId) {
        clone.modifyStatus = ArchitectureListModifyStatus.Insert;
        clone.id = guid();
        clone.code = '';
        clone.parentId = parentId;
        if (clone.children) {
          for (let item of clone.children) {
            setCopyId(item, clone.id);
          }
        }
      }

      const selectIndex = ref({
        index: -1,
        select: false,
      });

      function rowClassName(record, index) {
        if (selectIndex.value.index == index && selectIndex.value.select) {
          return 'modaltreeselectblue';
        } else {
          return 'modaltreeselectwhite';
        }
      }

      return {
        modalTitle,
        addBtnHide,
        editDetailInfo,
        loading,
        saveLoading,
        tableData,
        titleInfo,
        selectData,
        optionalChecked,
        optionalData,
        selectOptions,
        ArchitectureListFileStatus,
        calcutedDetailNum,
        calcutedAssemblyNum,
        calcutedProcessingNum,
        registerModal,
        registerTable,
        close,
        saveClick,
        tableRowClick,
        addOption,
        deleteOption,
        registerFileSelectModal,
        selectFileClick,
        selectSave,
        menuClick,
        addNewModule,
        rowClassName,
      };
    },
  });
</script>
<style>
  .scroll-container .scrollbar__wrap {
    margin-bottom: 0 !important;
  }

  .ant-modal-content {
    margin-top: -50px;
  }

  .ant-modal .ant-modal-body > .scrollbar {
    padding: 0px !important;
  }

  .ant-modal-footer {
    padding: 0;
    border-top: 0px;
  }

  .vben-basic-title-normal {
    font-weight: 900 !important;
  }

  .context-menu {
    z-index: 9999;
  }

  .custom-input-disabled {
    color: rgba(0, 0, 0, 0.85) !important;
    background-color: #fff !important;
    text-align: center;
  }

  .custom-setting-button {
    padding: 0;
    width: 20px;
  }
  .custom-setting-button :deep() .app-iconify {
    font-size: 15px !important;
    display: block !important;
    line-height: 0;
  }

  .ant-cascader {
    width: 100%;
  }

  .modaltreeselectwhite {
    background-color: white;
  }
  .modaltreeselectblue {
    background-color: rgb(227, 244, 252);
  }
</style>
