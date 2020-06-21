'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Database = use('Database')

class UserSchema extends Schema {
    up () {
        this.create('users', (table) => {
            table.increments()
            table.string('username', 80).notNullable().unique()
            table.string('email', 254).notNullable().unique()
            table.string('password', 60).notNullable()
            table.string('name', 254)
            table.string('identity_number', 60).notNullable()
            table.string('token_recuperacion', 400)
            table.timestamp('created_at').defaultTo(this.fn.now())
            table.timestamp('updated_at').defaultTo(Database.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
            table.datetime('deleted_at')
        })
    }

    down () {
        this.drop('users')
    }
}

module.exports = UserSchema
