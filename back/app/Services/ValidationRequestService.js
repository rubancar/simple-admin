'use strict'
const Logger = use('Logger')
const { validate, sanitize, ValidationException } = use('Validator')

module.exports = {

    validarRequest: async function (request, campos) {

        // los campos a validar deben vanir en array
        if (campos instanceof Object) {
            const validateObject = {}
            const sanitizeObject = {}
            let ejecutarSanitize = false
            const filtroCampos = Object.entries(campos).map(([key, value]) => {
                if (value instanceof Object) {
                    if (value.rule)  // obtenemos la regla de filtrado para el campo
                        validateObject[key] = value.rule
                    if (value.sanitize) { // obtenemos la regla para sanitize
                        sanitizeObject[key] = value.sanitize
                        ejecutarSanitize = true
                    }
                }
                return key
            })

            let data
            if (ejecutarSanitize) data = sanitize(request.only(filtroCampos), sanitizeObject)
            else data = request.only(filtroCampos)
            const validation = await validate(data, validateObject)

            if (validation.fails()) {
                Logger.warning('Validation messages %j', validation.messages())
                throw new ValidationException(validation.messages())
            } 
            else return data

        } else {
            throw { name: "Error en formato", message: "Formato de campos a validar no es un objecto" }
        }
    }
}
