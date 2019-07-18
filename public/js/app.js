//alert("Hello from browser-side javascript!")
console.log("Hello from browser-side javascript!");

//получаю элементы документа
const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#text-box1');
const messageTwo = document.querySelector('#text-box2');



function getForecast(address){
    //посылаю запрос на api моего же сервера
    fetch('/weather?address=' + address).then((response)=>{
        response.json().then((data)=>{
            if(data.error){
                messageOne.textContent = "Error";
                messageTwo.textContent = data.error;
                return;
            }
            console.log(data.location);
            messageOne.textContent = data.location
            messageTwo.textContent = data.forecastData
        })
    })
}

//добавляю обработчик события на нажатие на клавишу
weatherForm.addEventListener('submit', (event)=>{
    event.preventDefault();//не дает обновлять страницу при нажатии на кнопку
    messageOne.textContent = "Loading..."
    console.log(search.value);
    getForecast(search.value);

})