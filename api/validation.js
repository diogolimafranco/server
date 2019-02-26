
module.exports = app => {
    function isSetOrError(value, msg) {
        if(!value) throw msg
        if(Array.isArray(value) && value.length === 0) throw msg
        if(typeof(value) === 'string' && !value.trim()) throw msg
    }
    
    function isNotsetOrError(value, msg) {
        try {
            isSetOrError(value, msg)
        } catch (msg) {
            return
        }
        throw msg
    }
    
    function isEqualsOrError(valueA, valueB, msg) {
        if (valueA !== valueB) throw msg
    }

    return { isSetOrError, isNotsetOrError, isEqualsOrError }
}