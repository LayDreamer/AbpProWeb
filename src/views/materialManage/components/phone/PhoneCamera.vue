<template>
  <div>
    <div ref="imageRef" v-show="imgData.show" class="image-fixed" @touchstart="imgtouchStart">
      <img :src="imgData.url" />
      <div class="image-bottom"> 原图 </div>
      <div class="image-top-right" @touchstart="closeImgClick" @click="closeImgClick">
        <span class="iconify" data-icon="fa:close"></span>
      </div>
    </div>
    <div v-if="imgData.url && !imgData.show" class="imgage-close-botton" @touchstart="phoneImgClick"
      >原图悬浮</div
    >
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
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
import { CropperImage } from '/@/components/Cropper';
  export default defineComponent({
    components: {
      CropperImage,
    },
    setup(_, { emit }) {
      const file = ref();
      const imageRef = ref();
      const imgData = ref({
        show: false,
        url: '',
      });
      const clipData = ref({
        name: '',
        url: '',
      });
      let cropperImg: any;

      const cameraSearch = () => {
        let oBtn = file.value as HTMLInputElement;
        oBtn.click();
      };

      const handleCropend = ({ imgBase64 }) => {
        cropperImg = imgBase64;
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

        var file = dataURLtoFile(cropperImg, clipData.value.name);
        emit('clipResult', file);
        imgData.value = {
          show: true,
          url: cropperImg,
        };
        clipData.value = {
          name: '',
          url: '',
        };
      };

      function closeImgClick(e) {
        e.preventDefault();
        imgData.value.show = false;
      }

      const phoneImgClick = (e) => {
        e.preventDefault();
        imgData.value.show = true;
      };

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
          const maxY = window.innerHeight - imageRef.value.offsetHeight - 48;

          let newLeft = pageX - shiftX;
          let newTop = pageY - shiftY;

          //console.log('max' + maxY + '-' + newTop);
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

      const reset = () => {
        imgData.value = {
          show: false,
          url: '',
        };
        clipData.value = {
          name: '',
          url: '',
        };
      };

      return {
        file,
        imageRef,
        imgData,
        clipData,
        cameraSearch,
        handleFileChange,
        imgtouchStart,
        closeImgClick,
        phoneImgClick,
        handleCropend,
        cancelClipImgClick,
        sureClipImgClick,
        reset,
      };
    },
  });
</script>
<style scoped>
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

  .phone-media {
    position: sticky;
    top: 32px;
    z-index: 100;
    background-color: rgb(240, 242, 245);
  }

  .image-fixed {
    position: fixed;
    left: 50%;
    top: 20%;
    z-index: 2000;
    width: 150px;
    height: 150px;
    padding: 5px;
    overflow: hidden;
  }

  .image-fixed img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
    box-shadow: 5px -3px 6px 1px rgba(0, 0, 0, 0.5);
  }

  .image-bottom {
    position: absolute;
    bottom: 5px;
    left: 5px;
    right: 5px;
    height: 20px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    background-color: rgba(242, 242, 242, 0.73);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image-top-right {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 15px;
    color: rgb(46, 176, 194);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .imgage-close-botton {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 2000;
    padding: 4px 8px;
    font-family: 微软雅黑;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    color: rgb(255, 255, 255);
    border-radius: 6px;
    background: rgb(115, 109, 109);
  }
</style>
