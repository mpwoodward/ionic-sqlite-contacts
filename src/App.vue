<template>
  <ion-app>
    <suspense>
      <div>
        <ion-split-pane content-id="main-content">
          <menu-component />
          <ion-router-outlet id="main-content"></ion-router-outlet>
        </ion-split-pane>
        <ion-alert
          :is-open="alertInfo.isOpen"
          header="IONIC VUE SQLITE"
          :sub-header="alertInfo.subHeader"
          :message="alertInfo.message"
          :buttons="['OK']"
          @onDidDismiss="alertInfo.isOpen = false"
        ></ion-alert>
      </div>
      <template #fallback>
        <div><h1>Loading ...</h1></div>
      </template>
    </suspense>
  </ion-app>
</template>

<script setup lang="ts">
import { getCurrentInstance, reactive } from 'vue'
import {
  IonApp, 
  IonRouterOutlet, 
  IonSplitPane,
  IonAlert,
} from '@ionic/vue'
import { useSQLite } from 'vue-sqlite-hook'
import MenuComponent from '@/components/MenuComponent.vue'

const alertInfo = reactive({
  isOpen: false,
  subHeader: '',
  message: '',
})
const app = getCurrentInstance()

if (app != null) {
  try {
    app.appContext.config.globalProperties.$sqlite = useSQLite()
  } catch (e: any) {
    alertInfo.subHeader = 'Error initializing database'
    alertInfo.message = e.message
    alertInfo.isOpen = true
  }
}
</script>
