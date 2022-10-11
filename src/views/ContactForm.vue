<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>{{ inEditMode ? 'UPDATE CONTACT' : 'CREATE CONTACT' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$router.push({ name: 'home' })">CANCEL</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-item>
        <ion-label position="fixed">First Name</ion-label>
        <ion-input type="text" v-model="firstName"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="fixed">Last Name</ion-label>
        <ion-input type="text" v-model="lastName"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="fixed">Email</ion-label>
        <ion-input type="email" v-model="email"></ion-input>
      </ion-item>
      <ion-button
        v-if="inEditMode"
        style="margin:12px;"
        @click="doUpdateContact"
      >
        UPDATE CONTACT
      </ion-button>
      <ion-button
        v-else
        style="margin:12px;"
        @click="doCreateContact"
      >
        SAVE CONTACT
      </ion-button>

      <!-- error alert -->
      <ion-alert
        :is-open="alertInfo.isOpen"
        header="IONIC VUE SQLITE"
        :sub-header="alertInfo.subHeader"
        :message="alertInfo.message"
        :buttons="['OK']"
        @onDidDismiss="alertInfo.isOpen = false"
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
import { reactive, ref } from 'vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonAlert,
  IonToast,
  onIonViewWillEnter,
} from '@ionic/vue'
import { useRouter } from 'vue-router'

import { SQLiteService } from '@/services/sqlite-service'

const sqliteService: SQLiteService = new SQLiteService('ionic-vue-db')
await sqliteService.init()

const router = useRouter()
const firstName = ref<string>('')
const lastName = ref<string>('')
const email = ref<string>('')
const inEditMode = ref(false)
const contactId = ref()

const alertInfo = reactive({
  isOpen: false,
  subHeader: '',
  message: '',
})
const toastInfo = reactive({
  isOpen: false,
  header: '',
  message: '',
})

onIonViewWillEnter(async () => {
  if (router.currentRoute.value.params.id !== undefined) {
    try {
      inEditMode.value = true
      contactId.value = router.currentRoute.value.params.id

      const contact = await sqliteService.getContactById(parseInt(contactId.value))
      
      firstName.value = contact.first_name
      lastName.value = contact.last_name
      email.value = contact.email
    } catch (e: any) {
      alertInfo.subHeader = 'Error retrieving contact'
      alertInfo.message = e.message
      alertInfo.isOpen = true
    }
  } else {
    firstName.value = ''
    lastName.value = ''
    email.value = ''
  }
})

const doCreateContact = (async () => {
  try {
    await sqliteService.createContact(firstName.value, lastName.value, email.value)

    toastInfo.isOpen = true
    toastInfo.header = 'Contact Created'
    toastInfo.message = `Contact ${email.value} successfully created`
    
    setTimeout(() => {
      router.push({ name: 'home' })
    }, 2000)
  } catch (e: any) {
    alertInfo.subHeader = 'Error creating contact'
    alertInfo.message = e.message
    alertInfo.isOpen = true
  }
})

const doUpdateContact = (async () => {
  try {
    await sqliteService.updateContact(contactId.value, firstName.value, lastName.value, email.value)

    toastInfo.isOpen = true
    toastInfo.header = 'Contact Updated'
    toastInfo.message = `Contact ${email.value} successfully updated`

    setTimeout(() => {
      router.push({ name: 'home' })
    }, 2000)
  } catch (e: any) {
    alertInfo.subHeader = 'Error updating contact'
    alertInfo.message = e.message
    alertInfo.isOpen = true
  }
})
</script>
