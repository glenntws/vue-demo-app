<script setup lang="ts">

defineProps({
    fullWidth: {
        type: Boolean,
        default: false
    },
    contentAlign: {
        Type: String,
        default: "right"
    }
})
</script>
    
<template>
    <div class="container" :class="(fullWidth ? 'full-width' : '') + ' ' + ('content-align-' + contentAlign)">
        <div class="header">
            <h1>
                <slot name="title"></slot>
            </h1>
            <h3>
                <slot name="subtitle"></slot>
            </h3>
        </div>
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-items: stretch;
        justify-content: space-between;
        border-radius: 1rem;
        box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.1);
        background: rgb(255, 255, 255, 0.5);
        backdrop-filter: blur(20px);
        padding: 1rem;
        overflow: hidden;
        min-width: 200px;
    }

    .full-width {
        width: 100%;
    }

    .header {
        flex-grow: 0 !important;
    }

    h1 {
        display: block;
        font-weight: 600 !important;
        font-size: 1.25rem !important;
        color: var(--el-text-color-primary);
        text-align: left;
        width: 100%;
    }

    h3 {
        display: block;
        font-weight: 600 !important;
        font-size: 0.75rem !important;
        color: var(--el-text-color-regular);
        text-align: left;
        width: 100%;
    }

    .content {
        width: 100%;
        line-height: normal;
        flex-grow: 0 !important;
    }

    .content-align-left .content {
        text-align: left;
    }

    .content-align-center .content {
        text-align: center;
    }

    .content-align-right .content {
        text-align: right;
    }

    .content :slotted(.big-text) {
        font-weight: 600;
        font-size: 2rem;
        color: var(--el-text-color-primary);
    }

    .content :slotted(.normal-text) {
        font-weight: 400;
        font-size: 1rem;
        color: var(--el-text-color-regular);
    }

    .content :slotted(.small-text) {
        font-weight: 400;
        font-size: 0.8rem;
        color: var(--el-text-color-regular);
    }


</style>