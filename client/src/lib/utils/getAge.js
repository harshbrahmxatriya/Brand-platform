const getAge = (date) => {
    
    const currentDate = new Date()
    
    const age = currentDate.getFullYear() - date.getFullYear()

    const isBirthdayPassed =
        currentDate.getMonth() < date.getMonth() ||
        (currentDate.getMonth() === date.getMonth() &&
        currentDate.getDate() < date.getDate())

    if (!isBirthdayPassed) {
        age--
    }
        
    return age
}

export default getAge