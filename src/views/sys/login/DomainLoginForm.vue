<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="domainaccount" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.domainaccount"
          :placeholder="t('sys.login.domainUserName')"
          class="fix-auto-fill"
        />
      </FormItem>
      <FormItem name="domainpassword" class="enter-x">
        <InputPassword
          size="large"
          v-model:value="formData.domainpassword"
          :placeholder="t('sys.login.password')"
          class="fix-auto-fill"
        />
      </FormItem>
      <FormItem class="enter-x">
        <Button type="primary" size="large" block @click="domainLogin" :loading="loading">
          {{ t('sys.login.loginButton') }}
        </Button>
      </FormItem>
      <ARow class="enter-x">
        <ACol :md="8" :xs="24">
          <Button block @click="setLoginState(LoginStateEnum.LOGIN)">
            {{ t('sys.login.accountPasswordSignInFormTitle') }}
          </Button>
        </ACol>
      </ARow>
    </Form>
  </template>
</template>
<script lang="ts" setup>
  import { reactive, ref, computed, unref, toRaw } from 'vue';
  import { Form, Input, Button, Row, Col } from 'ant-design-vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useLoginState, useFormRules, useFormValid, LoginStateEnum } from './useLogin';
  import { getErpToken } from '/@/views/productlist/index';
  const InputPassword = Input.Password;
  const FormItem = Form.Item;
  const ACol = Col;
  const ARow = Row;
  import { useMessage } from '/@/hooks/web/useMessage';
  const { t } = useI18n();
  const { setLoginState, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();
  const { prefixCls } = useDesign('login');
  const formRef = ref();
  const loading = ref(false);
  import { useUserStore } from '/@/store/modules/user';
  const formData = reactive({
    domainaccount: '',
    domainpassword: '',
  });

  const { validForm } = useFormValid(formRef);
  const { notification, createErrorModal } = useMessage();
  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.DOMAIN);
  const userStore = useUserStore();
  async function domainLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.domainLogin(
        toRaw({
          username: data.domainaccount,
          password: data.domainpassword,
          mode: 'none', //不要默认的错误提示
        }),
      );
      if (userInfo != null) {
        if (userInfo.errorMsg == '' || userInfo.errorMsg == null) {
          notification.success({
            message: t('sys.login.loginSuccessTitle'),
            description: `${t('sys.login.loginSuccessDesc')}`,
            duration: 3,
          });
          await getErpToken();
        } else {
          createErrorModal({
            title: t('sys.api.errorTip'),
            content: userInfo.errorMsg,
          });
        }
      }
    } catch (error) {
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
    } finally {
      loading.value = false;
    }
  }
</script>
