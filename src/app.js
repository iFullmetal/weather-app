const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');
const fs = require('fs');

const app = express();

//если сервер был запущен на хостинге, то process.env.PORT будет считатся за тру и вернется оно, т.к. идет перед оператором, если оно будет undefined, то преобразуется к false и вернется 3000
const port = process.env.PORT || 3000;

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
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log("Connection from: ", ip);
    fs.appendFileSync('IPs.txt', ip + " " +  new Date(Date.now())  + "\n");

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
        message: "Unfortunately you are helpless.",
        name: "Max"
    })
})
app.get('/istealips',(req,res)=>{
    res.send({IPs:fs.readFileSync("IPs.txt").toString()});
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

app.listen(port, ()=>{
    console.log('Server is up on port ' + port + ".");
});