<template>
  <el-button class="fixed bottom-8 right-8" @click="saveAsPng" type="primary" size="large" circle>
    <font-awesome-icon icon="fas fa-download" />
  </el-button>
</template>

<script setup>
import { ElButton } from 'element-plus';
import { Download } from '@element-plus/icons-vue';
import html2canvas from 'html2canvas';

function saveAsPng() {
  html2canvas(document.getElementById("tierList"), {
    allowTaint: true,
  }).then(function (canvas) {
    document.getElementById("downloadDialog").appendChild(canvas)
  });
}

</script>