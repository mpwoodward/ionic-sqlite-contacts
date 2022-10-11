import { getCurrentInstance } from 'vue'
import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook/dist'

export class SQLiteService {
  app: any
  dbName: string
  sqliteHook: SQLiteHook
  db: SQLiteDBConnection

  constructor(dbName: string) {
    this.app = getCurrentInstance()
    this.dbName = dbName
    this.sqliteHook = {} as SQLiteHook
    this.db = {} as SQLiteDBConnection
  }
  
  async init() {
    this.sqliteHook = this.app?.appContext.config.globalProperties.$sqlite
    this.getConnection()
  }

  async getConnection() {
    const ret = await this.sqliteHook.checkConnectionsConsistency()
    const isConn = (await this.sqliteHook.isConnection(this.dbName, false)).result

    if (ret.result && isConn) {
      this.db = await this.sqliteHook.retrieveConnection(this.dbName, false)
    } else {
      this.db = await this.sqliteHook.createConnection(this.dbName, false, 'no-encryption', 1, false)
    }
  }

  async closeConnection() {
    await this.sqliteHook.closeConnection(this.dbName, false)
  }

  async getContacts() {
    await this.getConnection()
    await this.db.open()
    
    const contactsRes = await this.db.query('SELECT * FROM contacts;')
    await this.closeConnection()
    
    return contactsRes?.values
  }

  async getContactById(contactId: number) {
    await this.getConnection()
    await this.db.open()

    const contactRes = await this.db.query('SELECT * FROM contacts WHERE id = ?;', [contactId])
    await this.closeConnection()

    if (contactRes?.values) {
      return contactRes.values[0]
    }
  }

  async createContact(firstName: string, lastName: string, email: string) {
    await this.getConnection()
    await this.db.open()

    await this.db.run(`
        INSERT INTO contacts (first_name, last_name, email) 
        VALUES (?, ?, ?);
      `, 
      [firstName, lastName, email]
    )
    await this.closeConnection()
  }

  async updateContact(contactId: number, firstName: string, lastName: string, email: string) {
    await this.getConnection()
    await this.db.open()

    await this.db.run(`
        UPDATE contacts 
        SET first_name = ?,
            last_name = ?,
            email = ? 
        WHERE id = ?
      `,
      [firstName, lastName, email, contactId]
    )
    await this.closeConnection()
  }

  async deleteContact(contactId: number) {
    await this.getConnection()
    await this.db.open()
    await this.db.run('DELETE FROM contacts WHERE id = ?;', [contactId])
    await this.closeConnection()
  }
}
