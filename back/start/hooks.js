const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
    const View = use('View')
    const Config = use('Config')
    const moment = require('moment')

    View.global('appUrl', function () {
        return Config.get("app.appUrl")
    })

    View.global('momentParser', function (date, format = 'DD-MM-YYYY') {
        return moment(date).format(format);
    })
})
