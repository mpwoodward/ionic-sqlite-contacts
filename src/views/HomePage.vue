<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>HOME</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$router.push({ name: 'create-contact' })">ADD CONTACT</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <h1>HOME PAGE</h1>
      <ion-list>
        <ion-item v-for="contact in contacts" :key="contact.id">
          <ion-label @click="$router.push({ name: 'edit-contact', params: { id: contact.id} })">
            <div>{{ contact.first_name }} {{ contact.last_name }}</div>
            <div>{{ contact.email }}</div>
          </ion-label>
          <ion-button
            slot="end"
            @click="confirmDelete(contact.id)"
            color="danger"
          >DELETE</ion-button>
        </ion-item>
      </ion-list>

      <!-- error alert -->
      <ion-alert
        :is-open="errorAlertInfo.isOpen"
        header="IONIC VUE SQLITE"
        :sub-header="errorAlertInfo.subHeader"
        :message="errorAlertInfo.message"
        :buttons="['OK']"
        @onDidDismiss="errorAlertInfo.isOpen = false"
      ></ion-alert>

      <!-- confirmation alert -->
      <ion-alert
        :is-open="confirmationAlertInfo.isOpen"
        header="IONIC VUE SQLITE"
        :sub-header="confirmationAlertInfo.subHeader"
        :message="confirmationAlertInfo.message"
        :buttons="confirmationAlertInfo.buttons"
        @onDidDismiss="confirmationAlertInfo.isOpen = false"
      ></ion-alert>

      <!-- confirmation toast -->
      <ion-toast
        :is-open="toastInfo.isOpen"
        :header="toastInfo.header"
        :message="toastInfo.message"
        duration="2000"
        @onDidDismiss="toastInfo.isOpen = false"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import {
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonAlert,
  IonToast,
  onIonViewWillEnter,
} from '@ionic/vue'
import { SQLiteService } from '@/services/sqlite-service'

const sqliteService: SQLiteService = new SQLiteService('ionic-vue-db')
await sqliteService.init()

const contacts = ref()
const errorAlertInfo = reactive({
  isOpen: false,
  subHeader: '',
  message: '',
})
const confirmationAlertInfo = reactive({
  isOpen: false,
  subHeader: '',
  message: '',
  buttons: [] as any[],
})
const toastInfo = reactive({
  isOpen: false,
  header: '',
  message: '',
})

onIonViewWillEnter(async () => {
  try {
    contacts.value = await sqliteService.getContacts()
  } catch (e: any) {
    errorAlertInfo.subHeader = 'Error retrieving contacts'
    errorAlertInfo.message = e.message
    errorAlertInfo.isOpen = true
  }
})

const confirmDelete = (contactId: string) => {
  confirmationAlertInfo.subHeader = 'Delete Contact?'
  confirmationAlertInfo.message = `Are you sure you want to DELETE this contact ID ${contactId}?`
  confirmationAlertInfo.buttons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        confirmationAlertInfo.isOpen = false
      }
    },
    {
      text: 'YES, DELETE CONTACT',
      role: 'confirm',
      handler: async () => {
        await deleteContact(parseInt(contactId))
        confirmationAlertInfo.isOpen = false
      },
    },
  ]
  confirmationAlertInfo.isOpen = true
}

const deleteContact = async (contactId: number) => {
  try {
    await sqliteService.deleteContact(contactId)
    contacts.value = await sqliteService.getContacts()
    toastInfo.header = `Contact ID ${contactId} Deleted`
    toastInfo.message = `Contact ID ${contactId} was successfully deleted`
    toastInfo.isOpen = true
  } catch (e: any) {
    errorAlertInfo.subHeader = 'Error deleting contact'
    errorAlertInfo.message = e.message
    errorAlertInfo.isOpen = true
  }
}

onMounted(async () => {
  try {
    contacts.value = await sqliteService.getContacts()
  } catch (e: any) {
    errorAlertInfo.subHeader = 'Error retrieving contacts'
    errorAlertInfo.message = e.message
    errorAlertInfo.isOpen = true
  }
})
</script>
