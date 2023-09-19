<template>
  <div>
    <BasicModal
      :title="t('common.createText')"
      :canFullscreen="false"
      @ok="submit"
      :maskClosable="false"
      @cancel="cancel"
      @register="registerModal"
      :minHeight="100"
      :destroyOnClose="true"
    >
      <BasicForm @register="registerForm" />
    </BasicModal>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { FormSchema } from '/@/components/Table';
  import { createStandardAndPolicyTreesAsync } from './index';

  export default defineComponent({
    name: 'CreateOrganizationUnit',
    components: {
      BasicModal,
      BasicForm,
    },

    setup(_, { emit }) {
      const { t } = useI18n();
      const [registerModal, { closeModal, changeOkLoading }] = useModalInner((data) => {
        setFieldsValue({ id: data.id });
      });
      const formSchema: FormSchema[] = [
        {
          field: 'id',
          label: '',
          component: 'Input',
          colProps: {
            span: 18,
          },
          ifShow: false,
        },
        {
          field: 'name',
          label: '名称',
          component: 'Input',
          colProps: {
            span: 18,
          },
          rules: [{ required: true }],
        },
      ];
      const [registerForm, { resetFields, getFieldsValue, validate, setFieldsValue }] = useForm({
        labelWidth: 120,
        schemas: formSchema,
        showActionButtonGroup: false,
      });
      const submit = async () => {
        try {
          let request = getFieldsValue();
          changeOkLoading(true);
          await validate();
          await createStandardAndPolicyTreesAsync(request.id, request.name);
          resetFields();
          changeOkLoading(false);
          closeModal();
          emit('reload');
        } catch (error) {
          changeOkLoading(false);
        }
      };

      const cancel = () => {
        resetFields();
        closeModal();
      };

      return {
        registerModal,
        registerForm,
        submit,
        t,
        cancel,
      };
    },
  });
</script>

<style lang="less" scoped></style>
