'use strict'

const Logger = use('Logger')
const BaseExceptionHandler = use('BaseExceptionHandler')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
    /**
     * Handle exception thrown during the HTTP lifecycle
     *
     * @method handle
     *
     * @param  {Object} error
     * @param  {Object} options.request
     * @param  {Object} options.response
     *
     * @return {void}
     */
    async handle(error, { response }) {
        if (error.name == 'InvalidJwtToken')
            return response.status('401').send({ error: 'No autorizado' })
        if (error.name == 'ValidationException')
            return response.status('412').send({ error: 'Parámetros erroneos' })
        return response.status(error.status).send('Ha ocurrido un error')
    }

    /**
     * Report exception for logging or debugging.
     *
     * @method report
     *
     * @param  {Object} error
     * @param  {Object} options.request
     *
     * @return {void}
     */
    async report(error, { request }) {
        Logger.error('Error request details ',error)
    }
}

module.exports = ExceptionHandler
