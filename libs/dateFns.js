export function convertDate(date, options = { delimeter: '/', order: 'dmy' }) {
    const dateParts = date.split(options.delimeter)
    const year = options.order.indexOf('y')
    const month = options.order.indexOf('m')
    const day = options.order.indexOf('d')

    return `20${dateParts[year]}/${dateParts[month]}/${dateParts[day]}`
}

export function isOnOrAfterToday(date) {
    const now = new Date()
    const rd = new Date(convertDate(date))
    const isOnOrAfterToday = rd >= now
    return isOnOrAfterToday ? date : 'Released'
}