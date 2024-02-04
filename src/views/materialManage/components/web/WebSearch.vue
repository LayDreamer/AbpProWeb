<template>
  <div class="h-15 flex flex-row justify-between items-center">
    <img src="../../../../assets/images/倍睿丽BREALY-绿色.png" style="width: 280px; height: 100%" />
    <a-input
      v-model:value="searchValue"
      style="border-radius: 20px; width: 45%; height: 60%"
      placeholder="输入顺序码、物料编码、供应商编码"
      @pressEnter="searchClick"
    >
      <template #prefix>
        <span
          class="iconify"
          data-icon="material-symbols:search"
          style="font-size: 20px; color: gray"
        ></span>
      </template>
      <template #suffix>
        <div style="cursor: pointer" @click="cameraSearch">
          <span
            class="iconify"
            data-icon="zondicons:camera"
            style="font-size: 20px; color: rgb(55, 116, 197)"
          ></span>
        </div>
      </template>
    </a-input>
    <div
      v-if="hasPermission('YaSha.DataManager.MaterialManage.Create')"
      class="flex items-center"
      style="cursor: pointer"
      @click="manageClick"
    >
      <span
        class="iconify"
        style="font-size: 20px; color: gray"
        data-icon="lets-icons:setting-fill"
      >
      </span>
      <span
        style="
          margin-left: 10px;
          color: rgb(127, 127, 127);
          font-family: '微软雅黑 Light';
          font-size: 20px;
        "
        >材质管理</span
      >
    </div>
    <div class="w-20" v-if="!hasPermission('YaSha.DataManager.MaterialManage.Create')"> </div>
  </div>
  <div
    ref="imageRef"
    v-show="imgData.show"
    class="image-fixed"
    @mousedown="imgMouseDown"
    @touchstart="imgtouchStart"
  >
    <img :src="imgData.url" />
    <div class="image-bottom"> 原图 </div>
    <div class="image-top-right" @click="closeImgClick" @touchstart="closeImgClick">
      <span class="iconify" data-icon="fa:close"></span>
    </div>
  </div>
  <input
    ref="file"
    type="file"
    style="display: none"
    accept=".png,.jpg,.jpeg"
    @change="handleFileChange"
  />
  <div class="image-clip" v-if="clipData.url">
    <div class="image-clip-cancel" @click="cancelClipImgClick">
      <span>取消</span>
    </div>
    <div class="image-clip-sure" @click="sureClipImgClick">
      <span>识图</span>
    </div>
    <CropperImage
      ref="refCropper"
      :src="clipData.url"
      @cropend="handleCropend"
      style="width: 100%; height: 100%"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
import { CropperImage } from '/@/components/Cropper';
import { useGo } from '/@/hooks/web/usePage';
import { usePermission } from '/@/hooks/web/usePermission';
  export default defineComponent({
    components: {
      CropperImage,
    },
    props: {
      showImg: String,
    },
    emits: ['update:showImg', 'searchByInput', 'searchByCamera', 'phoneMenu'],
    watch: {
      showImg(newVal) {
        if (newVal == 'open') {
          this.imgData.show = true;
        }
      },
    },
    setup(_, { emit }) {
      const go = useGo();
      const { hasPermission } = usePermission();
      const file = ref();
      const searchValue = ref();
      const imageRef = ref();
      const imgData = ref({
        show: false,
        url: '',
      });
      const clipData = ref({
        name: '',
        url: '',
      });
      const cropperImg = ref('');
      const searchClick = () => {
        emit('searchByInput', searchValue.value);
      };
      const cameraSearch = () => {
        let oBtn = file.value as HTMLInputElement;
        oBtn.click();
      };
      const manageClick = () => {
        go('/materialLibrary/materialLibrayManage');
      };
      const handleCropend = ({ imgBase64 }) => {
        cropperImg.value = imgBase64;
      };
      const handleFileChange = async (event: { target: any }) => {
        const fileInput = event.target;

        if (fileInput.files && fileInput.files[0]) {
          const file = fileInput.files[0];
          clipData.value = {
            name: file.name,
            url: URL.createObjectURL(file),
          };
        }
        fileInput.value = '';
      };
      const cancelClipImgClick = () => {
        clipData.value = {
          name: '',
          url: '',
        };
      };
      const sureClipImgClick = () => {
        const dataURLtoFile = (dataurl, filename) => {
          var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          return new File([u8arr], filename, { type: mime });
        };
        var file = dataURLtoFile(cropperImg.value, clipData.value.name);
        console.log(file);
        imgData.value = {
          show: true,
          url: cropperImg.value,
        };
        clipData.value = {
          name: '',
          url: '',
        };
        emit('update:showImg', 'open');
        emit('searchByCamera', file);
      };
      const imgMouseDown = (event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        const shiftX = event.clientX - imageRef.value.getBoundingClientRect().left;
        const shiftY = event.clientY - imageRef.value.getBoundingClientRect().top;
        moveAt(event.pageX, event.pageY);

        function moveAt(pageX, pageY) {
          const maxX = window.innerWidth - imageRef.value.offsetWidth;
          const maxY = window.innerHeight - imageRef.value.offsetHeight;

          let newLeft = pageX - shiftX;
          let newTop = pageY - shiftY;

          // 边界检查
          newLeft = Math.min(Math.max(0, newLeft), maxX);
          newTop = Math.min(Math.max(0, newTop), maxY);

          imageRef.value.style.left = newLeft + 'px';
          imageRef.value.style.top = newTop + 'px';
          imageRef.value.style.cursor = 'move';
        }

        function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
        }

        function onMouseUp() {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          imageRef.value.style.cursor = 'default';
        }
      };
      function closeImgClick() {
        imgData.value.show = false;
        emit('update:showImg', 'close');
      }
      const imgtouchStart = (event) => {
        event.preventDefault();
        document.addEventListener('touchmove', onTouchMove);
        document.addEventListener('touchend', onTouchUp);
        const touch = event.touches[0];
        const shiftX = touch.clientX - imageRef.value.getBoundingClientRect().left;
        const shiftY = touch.clientY - imageRef.value.getBoundingClientRect().top;
        moveAt(event.pageX, event.pageY);

        function moveAt(pageX, pageY) {
          const maxX = window.innerWidth - imageRef.value.offsetWidth;
          const maxY = window.innerHeight - imageRef.value.offsetHeight;

          let newLeft = pageX - shiftX;
          let newTop = pageY - shiftY;

          // 边界检查
          newLeft = Math.min(Math.max(0, newLeft), maxX);
          newTop = Math.min(Math.max(0, newTop), maxY);

          imageRef.value.style.left = newLeft + 'px';
          imageRef.value.style.top = newTop + 'px';
        }

        function onTouchMove(event) {
          const touch = event.touches[0];
          moveAt(touch.pageX, touch.pageY);
        }

        function onTouchUp() {
          document.removeEventListener('touchmove', onTouchMove);
          document.removeEventListener('touchend', onTouchUp);
          imageRef.value.style.cursor = 'default';
        }
      };
      return {
        file,
        imageRef,
        searchValue,
        imgData,
        clipData,
        hasPermission,
        searchClick,
        cameraSearch,
        manageClick,
        handleFileChange,
        imgMouseDown,
        closeImgClick,
        imgtouchStart,
        handleCropend,
        cancelClipImgClick,
        sureClipImgClick,
      };
    },
  });
</script>
<style scoped>
  :deep() .ant-input {
    font-size: 16px !important;
  }
  .image-clip {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 9999;
  }

  .image-clip img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-clip-cancel {
    font-size: 20px;
    font-weight: 700;
    position: absolute;
    bottom: 10px;
    left: 50px;
    color: #ed6f6f;
    z-index: 10000;
  }

  .image-clip-sure {
    font-size: 20px;
    font-weight: 700;
    position: absolute;
    bottom: 10px;
    right: 50px;
    color: #0188fb;
    z-index: 10000;
  }

  .image-fixed {
    position: fixed;
    left: 50%;
    top: 20%;
    z-index: 2000;
    width: 240px;
    height: 240px;
    padding: 10px;
    overflow: hidden;
  }

  .image-fixed img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 5px -3px 6px 1px rgba(0, 0, 0, 0.5);
  }

  .image-bottom {
    position: absolute;
    bottom: 10px;
    left: 10px;
    right: 10px;
    height: 40px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    background-color: rgba(242, 242, 242, 0.73);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image-top-right {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 24px;
    color: rgb(46, 176, 194);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
</style>
