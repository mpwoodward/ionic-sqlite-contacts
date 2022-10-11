import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* SQLite imports */
import { defineCustomElements as jeepSqlite, applyPolyfills } from 'jeep-sqlite/loader'
import { Capacitor } from '@capacitor/core'
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite'
import { useState } from '@/composables/state'
import { deleteDatabase } from '@/utils/sqlite/delete-db'

applyPolyfills().then(() => {
  jeepSqlite(window)
})

window.addEventListener('DOMContentLoaded', async () => {
  const platform = Capacitor.getPlatform()
  const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite)

  const app = createApp(App)
    .use(IonicVue)
    .use(router);
  
  // existing connections store
  const [existConn, setExistConn] = useState(false)
  app.config.globalProperties.$existingConn = { existConn: existConn, setExistConn: setExistConn }

  try {
    if (platform === 'web') {
      // create the 'jeep-sqlite' Stencil component
      const jeepSqlite = document.createElement('jeep-sqlite')
      document.body.appendChild(jeepSqlite)
      await customElements.whenDefined('jeep-sqlite')
      
      // initialize the web store
      await sqlite.initWebStore()
    }

    // SQLITE STUFF
    const ret = await sqlite.checkConnectionsConsistency()
    const isConn = (await sqlite.isConnection('ionic-vue-db', false)).result

    let db: SQLiteDBConnection

    if (ret.result && isConn) {
      db = await sqlite.retrieveConnection('ionic-vue-db', false)
    } else {
      db = await sqlite.createConnection('ionic-vue-db', false, 'no-encryption', 1, false)
    }

    // DELETE THE DATABASE TO START CLEAN
    //await deleteDatabase(db)

    // CREATE SCHEMA AND PUT SOME TEST CONTACTS IN
    await db.open()

    const createContactsTableRes = await db.execute(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      );
    `)

    if (
      createContactsTableRes.changes && 
      createContactsTableRes.changes.changes && 
      createContactsTableRes.changes.changes < 0
    ) {
      throw new Error('Error: creating contacts table failed')
    }

    // const contactsToInsert = [] as any[]
    // contactsToInsert.push(
    //   ['Person', 'One', 'person1@person1.com'],
    //   ['Person', 'Two', 'person2@person2.com'],
    //   ['Person', 'Three', 'person3@person3.com'],
    // )
    // const contactsPlaceholders = contactsToInsert.map(() => '(?, ?, ?)').join(',')
    // const insertTestContactsQuery = `
    //   INSERT INTO contacts (first_name, last_name, email) VALUES ${contactsPlaceholders};
    // `

    // await db.run(insertTestContactsQuery, contactsToInsert.flatMap((el) => el))

    console.log(await db.query('SELECT * FROM contacts;'))

    await sqlite.closeConnection('ionic-vue-db', false)

    router.isReady().then(() => {
      app.mount('#app');
    })
  } catch (err) {
    console.log(`Error: ${err}`)
    throw new Error(`Error: ${err}`)
  }
})
