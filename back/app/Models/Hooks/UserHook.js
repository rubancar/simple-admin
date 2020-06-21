'use strict'

const Hash = use('Hash')

const UserHook = exports = module.exports = {}

UserHook.hashPassword = async (user) => {
    console.log(user.password)
    user.password = await Hash.make(user.password)
}
