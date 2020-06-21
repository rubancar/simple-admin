'use strict'
const { validarRequest } = use('App/Services/ValidationRequestService')
const User = use('App/Models/User')
const Logger = use('Logger')
const jwt = require('jsonwebtoken')
const Config = use('Config')
const Mail = use('Mail')

class UserController {


    async login ({ request, response, auth }) {

        const { email, password } = request.all()

        console.log('email', email)
        console.log('password', password)

        const authenticated = await auth.attempt(email, password)

        const user = await User.query().where('email', email).first()

        Logger.debug(`authenticated for userId %j:`, authenticated)
        const userInfo = user.toJSON()
        return response.send({
            userInfo: { ...userInfo	},
            tokens: authenticated
        });

    }

    async userInfo({ auth, response }) {
        const { user } = auth

        Logger.debug(`auth %j`, user)

        let userInfo = await User.query().where('id', user.id).first()
        userInfo = userInfo.toJSON()

        return response.send({...userInfo })

    }

    async logout({ auth, response }) {

        const { user: { id: usuario_id }, jwtPayload: { data: { suid } } } = auth

        Logger.info(`user_id ${usuario_id}`)
        Logger.info(`Sesion id ${suid}`)

        // revoked the sesion
        // await Sesion.query().where('id', suid).update({ 'is_revoked': true })

        // Se asume que informacion sobre la session existe ya que pasa por el middleware de SesionUsuario
        // await SesionUsuario.query().where('id', sesion_id).where('usuario_id', usuario_id).delete()

        ///*** Eliminar la sesión del usuario
        // response.clearCookie('Session-Contribuyente', { path: '/api' })
        return response.send({ message: 'Sesión cerrada exitosamente' })
    }

    /**
     * Sends a recovery password email
     */
    async forgotPassword({ request, response }) {

        const data = await validarRequest(request, {
            email: { rule: 'required|email' }
        })

        const user = await User.findBy('email', data.email)

        if (!user)
            return response.status(404).send({ error: 'El usuario ingresado no existe en nuestros registros.' })

        const token = jwt.sign({ uid: user.id }, Config.get('app.appKey'), { expiresIn: '10m' })

        user.token_recuperacion = token
        const response_mail = await Mail.send('forgotPasswordEmail', {
            nombres: user.name,
            email: user.email,
            token,
        }, (message) => {
            message
                .to(user.email)
                .from(Config.get('mail.from'))
                .subject('Ha solicitado recuperar contraseña')
        })
        await user.save()
        console.log('response_mail', response_mail)
        return response.send({ message: 'Se ha enviado las instrucciones a su correo electrónico.' })
    }

    /**
     * Recover user password
     */
    async recoverPassword({ request, response }) {
        const data = await validarRequest(request, {
            email: { rule: 'required|email' },
            token: { rule: 'required|string'},
            password: { rule: 'required|min:6|confirmed' },
            password_confirmation: { rule: 'required' }
        })

        const { email, token, password } = data;

        console.log('password', password)
        try {
            const { uid } = jwt.verify(token, Config.get('app.appKey'));

            if (!uid)
                return response.status(412).send({ error: 'Código erróneo.' })

            const user = await User.findBy('email', email)

            if (!user)
                return response.status(404).send({ error: 'El usuario no existe en nuestros registros.' })

            if (user.token_recuperacion !== token)
                return response.status(412).send({ error: 'Código no coincide con el registrado en el sistema.' })

            if (user.id !== uid)
                return response.status(404).send({ error: 'Datos del código erroreos' })

            user.password = password;
            user.token_recuperacion = null;

            await user.save();

            return response.send({ message: 'Contraseña recuperada exitosamente' })

        } catch (error) {

            if (error.name === 'TokenExpiredError')
                return response.status(412).send({ error: 'Código expirado.' })

            return response.status(412).send({ error: 'Código inválido' })

        }
    }
}

module.exports = UserController
