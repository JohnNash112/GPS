// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
const coordlist = [];
var stop_value = 0;

const send_data = async function() {

  json_type = coordlist.map(points => {
    return{
    "timestamp": points[0].toString(),
    "latitude" : points[1].toString(),
    "longitude" : points[2].toString(),
    "speed" : points[3]
    }
    
  });
  // const myJSON = JSON.stringify(json_type);
  console.log(json_type)
  axios.post('https://dbanalysis.herokuapp.com/getClass', json_type)
                .then(res => console.log(res))
  
  // json_type.forEach(tiny => {
  //  axios.post('http://localhost:8000/analyse', tiny)
  //               .then(res => console.log(res))
  // });

  
        }

const start = document.querySelector("#start");
const end = document.querySelector("#end");


const getGPS = function () {

      setInterval(() => {
        if (!stop_value) {
            navigator.geolocation.watchPosition(
                data => {
                    console.log(data);
                    // var d = new Date(0);
                    // d.setUTCSeconds(Math.floor(data.timestamp / 1000));
                    if (data.coords.speed == null) {
                        coordlist.push([data.timestamp, data.coords.latitude, data.coords.longitude, 0]);
                    }
                    else{
                        coordlist.push([data.timestamp, data.coords.latitude, data.coords.longitude, data.coords.speed]);
                    }
                    window.localStorage.setItem("coordinates", JSON.stringify(coordlist.map(String)))
                },
                error => console.log(error),
                {
                    enableHighAccuracy: true
                });
        }
      }, 1000);  
        
};
const stopGPS = function () {
    stop_value = 1;
}
start.addEventListener("click", getGPS);
end.addEventListener("click", stopGPS);

const download = function (data) {

    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob)
    console.log(url);
    const a = document.createElement('a')
    a.setAttribute('href', url)

    a.setAttribute('download', 'download.csv');
    a.click();
    a.innerText = 'CSV';
    // document.body.appendChild(a);
}
const get = async function () {
    var csv_data = coordlist.map(function (d) {
        return d.join();
    }).join('\n');
    download(csv_data);
}

const btn = document.getElementById('action');
btn.addEventListener('click', get);

const send_btn = document.getElementById('send');
send_btn.addEventListener('click', send_data);
