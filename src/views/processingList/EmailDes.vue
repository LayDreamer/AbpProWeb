<template>
  <div>
    <BasicModal
      v-bind="$attrs"
      :title="title"
      :canFullscreen="false"
      :maskClosable="false"
      destroyOnClose
      @register="registerModal"
      @ok="ok"
    >
      <div class="m-4">
        <a-form
          ref="formRef"
          :model="formdata"
          :rules="rules"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-form-item label="收件人" name="recipient">
            <a-select
              v-model:value="formdata.recipient"
              mode="multiple"
              style="width: 100%"
              :options="selectOptions"
              allow-create
              filterable
            />
          </a-form-item>

          <a-form-item label="抄送人" name="copys">
            <a-select
              v-model:value="formdata.copys"
              mode="multiple"
              style="width: 100%"
              :options="selectOptions"
              allow-create
              filterable
            />
          </a-form-item>

          <a-form-item label="邮件标题" name="emailTitle">
            <a-input v-model:value="formdata.emailTitle" allow-clear />
          </a-form-item>
          <a-form-item label="邮件内容" name="emailContent">
            <a-input v-model:value="formdata.emailContent" allow-clear />
          </a-form-item>
        </a-form>
      </div>
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, toRaw } from 'vue';
  import type { SelectProps } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { sendEmail, getAllUsers, getCurrentUser } from '/@/views/processingList/index';
  import { PagingUserListInput } from '/@/services/ServiceProxies';
  export default defineComponent({
    components: {
      BasicModal,
    },
    setup(_, { emit }) {
      const { createMessage: msg } = useMessage();
      const { error, success, info } = msg;
      const title = ref('');
      let id = undefined;
      const formRef = ref();
      const fileInput = ref<HTMLElement | null>(null);
      const excelInfos = ref('');
      const currentUser = ref('');
      const formdata = ref({
        recipient: undefined,
        copys: undefined,
        emailTitle: '',
        emailContent: '',
      });
      const selectValue = ref([]);
      const rules = ref({});
      const selectOptions = ref<SelectProps['options']>([]);

      const [registerModal, { closeModal }] = useModalInner(async (e) => {
        var data = e.data;
        for (let i = 0; i < data.length; i++) {
          excelInfos.value += data[i].fileName + '\r\n';
        }

        const searchDto: PagingUserListInput = {
          Filter: '',
          pageSize: 1000,
        };
        var result = await getAllUsers(searchDto);
        for (let i = 0; i < result.items?.length; i++) {
          selectOptions.value.push({
            label: result.items[i].userName,
            value: result.items[i].userName,
          });
        }
        currentUser.value = await getCurrentUser();
        formdata.value.emailTitle = '工业化内加工清单下单通知';
        formdata.value.emailContent =
          '各位领导、同事：\r\n你们好！\r\n您的同事' +
          currentUser.value +
          '向您发来下单通知。\r\n以下内加工清单已生成:\r\n ' +
          excelInfos.value +
          '请登录亚厦工业化BIM数据管理系统查看!\r\n  http://bds.chinayasha.com  \r\n 账号密码为亚厦门户账号密码';
      });

      function ok() {
        const successMsg = id == undefined ? '提交成功' : '修改成功';
        const faildMsg = id == undefined ? '提交失败' : '修改失败';
        var a=JSON.parse(JSON.stringify(formdata.value.recipient));
        const json = {
          recipient: formdata.value.recipient,
          copys: formdata.value.copys,
          emailTitle: formdata.value.emailTitle,
          emailContent: formdata.value.emailContent,
        };
          formRef.value
            .validate()
            .then(async () => {
              try {
                var res = await sendEmail(json);
                if (res.includes('success')) {
                  info('发送邮件成功');
                } else {
                  info('发送失败');
                  console.log(res);
                }
              } catch (e) {
                error(faildMsg + e);
              }
            })
            .catch((e) => {
              error('表单输入有误' + e);
            });
      }
      return {
        title,
        fileInput,
        selectOptions,
        selectValue,
        formRef,
        formdata,
        rules,
        registerModal,
        ok,
      };
    },
  });
</script>
<style scoped>
  .custom-load {
    padding: 1px 5px;
  }
  .custom-load :deep() .app-iconify {
    width: 16px;
    font-size: 27px !important;
    display: block !important;
    line-height: 0;
  }
</style>
