<template>
	<el-button class="fixed bottom-8 right-8" type="primary" size="large" circle :icon="ElIconDownload" @click="saveAsPng" />
</template>

<script setup>
import { ElButton } from "element-plus";
import html2canvas from "html2canvas";

function saveAsPng() {
	html2canvas(document.getElementById("tierList"), {
		allowTaint: true,
	}).then(function (canvas) {
		document.getElementById("downloadDialog").appendChild(canvas);
	});
}
</script>
