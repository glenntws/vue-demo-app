<script setup lang="ts">
import { RouterView} from "vue-router";
import { PieChart, Setting } from '@element-plus/icons-vue'
import UserEntry from './components/UserEntry.vue'
import { useUserDataStore } from "./stores/UserData";

const userDataStore = useUserDataStore();
</script>

<template>

  <el-container class="main-layout-container">
    <el-aside>
      <el-scrollbar>
        <h1>Demo App</h1>
        <UserEntry :name="userDataStore.fullName" :avatar-pic="userDataStore.profilePic"></UserEntry>
        <el-menu :default-active="$route.path" :default-openeds="['1']" router>
          <el-sub-menu index="1">
            <template #title>
              <el-icon><PieChart /></el-icon>My finances
            </template>
            <el-menu-item index="/" v-on:click="">Dashboard</el-menu-item>
            <el-menu-item index="/transactions">Transactions</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/Settings">
              <el-icon><Setting /></el-icon>Settings
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>

  </el-container>

</template>

<style scoped>

  .main-layout-container {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .main-layout-container .el-aside {
    color: var(--el-text-color-primary);
    background: rgb(255, 255, 255, 0.5);
    backdrop-filter: blur(20px);
    box-shadow: 0px 0px 15px rgb(0, 0, 0, 0.1);
    width: 25%;
    max-width: 300px;
    min-width: 200px;
  }

  .main-layout-container .el-menu {
    border-right: none;
    user-select: none;
  }

  .main-layout-container .el-main {
    padding: 0;
  }

  .main-layout-container .toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 20px;
  }

/* default page transition */

.fade-enter-active {
  transition: all 200ms ease-out;
}
.fade-leave-active {
  transition: all 200ms ease-out;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(1rem);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-3rem);
}
</style>
