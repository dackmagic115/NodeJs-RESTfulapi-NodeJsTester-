const app = require('./app')
const PORT = process.env.PORT || 8574


app.listen(PORT , () =>{
    console.log('------------------------------')
    console.log(`Server API RUNNING ON ${PORT}...`)
    console.log('------------------------------')

})