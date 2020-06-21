'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Logger = use('Logger')

class UserSeeder {
  async run () {
      // Create users - Asignar rol
      let users = [
          {
              email: 'rubenandres92@gmail.com',
              name: 'Rubén Carvajal',
          },
          {
              email: 'yolanda@mailinator.com',
              name: 'Yolanda Ulloa',
          }
      ]

      for (const user of users) {
          await Factory.model('App/Models/User').create(user)
      }

      Logger.info('Users successfully created')

  }
}

module.exports = UserSeeder
