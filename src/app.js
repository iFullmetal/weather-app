const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');
const fs = require('fs');

const app = express();

//устанавливаю handlbars(штука для динамической подгрузки страницы) и каталог, где лежат эти самые страницы(типа html, но динамические)
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '../templates/views'))

//устанавливаю папку для паршиалов(типа модули для встройки в html(hbs) страницу)
hbs.registerPartials(path.join(__dirname, '../templates/partials'))

//указываю путь к статическим ассетам(htrml, картиночки, js код)
app.use(express.static(path.join(__dirname, '../public')))


//добавляю динамическую рут страницу из hbs файла(не htm,l, он статический)
app.get('', (req, res)=>{
    //сохраняю айпишник того, кто подключился
    console.log("Connection from: ", req.ip);
    fs.appendFileSync('IPs.txt', req.ip + " " +  new Date(Date.now())  + "\n");

    res.render('index', {
        title: "Weather App",
        name:'Max'
    })
})
app.get('/about', (req, res)=>{
    res.render('about',{
        title:'About',
        name: "Max"
    })
})
app.get('/help', (req, res)=>{
    res.render('help', {
        title:"Help",
        message: "There is no help. You will die alone becouse you are weak and helpless.",
        name: "Max"
    })
})

app.get('/weather', (req, res)=>{
    if(!req.query.address){
        res.send({error:"you have to provide an address"})
        return
    }
    //в параметрах коллбэка сразу же деструктуризирую дату, заодно сделав дефолтным параметром пустой объект, на случай, если прийдет undefined
    geocode(req.query.address, (error, {latitude, longitude, location} = {})=>
    {
        if(error) {
            res.send({error})
            return
        }

        forecast(latitude, longitude, (error, forecastData)=>{
            if(error){
                res.send({error})
                return
            }
            res.send({location, forecastData})
        })
    })
})

app.get('/help/*', (req, res)=>{
    res.render('404',{
        error_message:"Help article is not found :c",
        title:"404",
        name:"Max"
    })
})
//под этот путь подходит любая страница, так что * должна идти в конце
app.get('*', (req, res)=>{
    res.render('404',{
        error_message: req.url + " doesn't exist.",
        title:"404",
        name:"Max"
    })
})

app.listen(3000, ()=>{
    console.log('Server is up on port 3000.');
});