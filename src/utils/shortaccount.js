

export const shortAccount = (address) => {
    if (address.length > 0) {
    const upAccount = address
    return (upAccount.slice(0,5) + '...' + upAccount.slice(37,42))
    } else {
        return ''
    }
}
