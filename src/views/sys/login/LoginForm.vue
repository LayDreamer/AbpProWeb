<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <FormItem name="account" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.account"
        :placeholder="t('sys.login.userName')"
        class="fix-auto-fill"
      />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
      />
    </FormItem>
    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        {{ t('sys.login.loginButton') }}
      </Button>
      <Button size="large" block class="mt-4" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </Button>
    </FormItem>
  </Form>
</template>
<script lang="ts" setup>
  import { Button, Form, Input } from 'ant-design-vue';
  import { computed, reactive, ref, toRaw, unref } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { LoginStateEnum, useFormRules, useFormValid, useLoginState } from './useLogin';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { getErpToken } from '/@/views/productlist/index';

  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { notification, createErrorModal, createMessage: msg } = useMessage();
  const { error, success } = msg;
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();
  const { getLoginState, handleBackLogin } = useLoginState();
  const { getFormRules } = useFormRules();
  const formRef = ref();
  const loading = ref(false);
  const rememberMe = ref(false);
  const formData = reactive({});
  const { validForm } = useFormValid(formRef);
  //onKeyStroke('Enter', handleLogin);
  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);
  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login(
        toRaw({
          password: data.password,
          username: data.account,
          tenantId: '',
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
          // error(userInfo.errorMsg);
          createErrorModal({
            title: t('sys.api.errorTip'),
            content: userInfo.errorMsg,
            getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
          });
        }
      }
    } catch {
    } finally {
      loading.value = false;
    }
  }
</script>
