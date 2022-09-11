<script setup lang="ts">
import { Lock } from '@element-plus/icons-vue'

defineProps({
        name: {
            type: String,
            default: 'Default User'
        },
        avatarPic: {
            type: String,
            default: ''
        }
    });
</script>

<template>
    <div id="container">
        <el-avatar size="default" form="circle" :src="avatarPic"></el-avatar>
        <span id="username">{{name}}</span>
        <el-button id="logout-btn" plain circle>
            <el-icon slot="icon"><Lock /></el-icon>
        </el-button>
    </div>
</template>

<style scoped>
    #container {
        margin: 1rem;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
    }

    .el-avatar {
        margin-right: 0.5rem;
        flex-grow: 0;
        flex-shrink: 0;
    }

    #username {
        display: block;
        flex-grow: 1;
        font-weight: 500;
        color: var(--el-text-color-primary);
        font-size: 1rem;
    }

    #logout-btn {
        border-width: 1px;
        background: transparent;
        color: rgb(50, 50, 50, 0.8);
        border-color: rgb(50, 50, 50, 0.3);
        transition: 200ms all ease-out;
    }

    #logout-btn:hover {
        background: rgb(255, 255, 255, 0.5);
    }

    #logout-btn:active {
        background: rgb(0, 0, 0, 0.1);
    }
</style>