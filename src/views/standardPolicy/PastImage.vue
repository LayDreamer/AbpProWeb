<template>
  <div
    class="p-5 w-full h-full bg-slate-200 overflow-auto"
    @paste="handlePaste"
    :contenteditable="false"
    style="max-height: 930px"
  >
    <div class="flex flex-col">
      <div
        v-for="(item, index) in images"
        :key="index"
        style="position: relative; margin-bottom: 10px"
      >
        <a-image :src="item.data.imagePath" :alt="item.alt" />
        <div @click="deleteImage(item)" style="cursor: pointer">
          <span
            class="iconify"
            style="font-size: 22px; color: red; position: absolute; top: -10px; right: -10px"
            data-icon="mdi:remove-bold"
          >
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  export default defineComponent({
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup(_) {
      const { hasPermission } = usePermission();
      const { createMessage: msg } = useMessage();
      const { error, info } = msg;
      const images: any = ref([]);
      onMounted(async () => {
        var result = await getClipImageList(_.id);
        for (let item of result) {
          images.value.push({
            data: item,
            alt: 'Pasted Image',
          });
        }
      });
      async function handlePaste(event) {
        if (!hasPermission('YaSha.DataManager.StandardPolicy.Update')) {
          error('无粘贴权限');
          return;
        }
        const items = event.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            // var result = await insertClipImage({
            //   id: _.id,
            //   file: {
            //     data: file,
            //     fileName: file.name,
            //   },
            // });
            // images.value.push({ data: result.data, alt: 'Pasted Image' });
          }
        }
        event.preventDefault();
      }
      async function deleteImage(image) {
        images.value = images.value.filter((item) => item !== image);
        // var result = await deleteClipImage(image.data.id);
        // if (!result.success) {
        //   error('删除失败' + result.error);
        // }
      }
      return {
        images,
        handlePaste,
        deleteImage,
        hasPermission,
      };
    },
  });
</script>
<style scoped></style>
