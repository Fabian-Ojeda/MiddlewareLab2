const express = require('express');
const cors = require('cors');
const axios = require('axios');
var Jimp = require('jimp');
const { read } = require('jimp');
const fs = require('fs');
const exec = require('child_process').exec
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const cpUpload = multer()
var base64 = '';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//crea la imagen en base a la data que le llega
function createImageArrived(data, callback){
    console.log('data')
    setTimeout(function() {
        fs.writeFile("out.jpg", data, 'base64', function(err) {
            if (err) console.log(err);
          });
        },10000);
    setTimeout(() => {
        callback()
    }, 11000);    
   
}

function writeInImage(callback){
    var phrase = 'No se alcanzo a leer la frase de la api';
    var options = {
        method: 'GET',
        url: 'https://iiif.harvardartmuseums.org/manifests/object/216847',        
      };
//consulta de laa frase desde la api
    axios.request(options).then(function (response) {          
        phrase=response.data.label;
        console.log('Frase leida desde la api: '+phrase);
    }).catch(function (error) {
        console.error(error);
    });
//lectura de la imagen
    Jimp.read('out.jpg', (err, imageLoaded) => {
        if (err) throw err;
        console.log('la imagen se ha cargado')
        setTimeout(function() {
//escritura en la imagen
        Jimp.loadFont(Jimp.FONT_SANS_64_BLACK).then(font => {
            console.log('esto es la frase antes de imprimirla, creo: '+phrase)
            imageLoaded.print(font, 20, 20, {
                text: phrase
              });
        });
    },5000);
    //Guardar la imagen modificada
        setTimeout(function() {
            imageLoaded.write('img.jpg')        
            console.log('la nueva imagen se ha guardado')
        },10000);
    });
    setTimeout(() => {
        callback()
    }, 11000);
}
//codifica la imagen
function codifyNewImage(callback){
    exec('java -jar "Codificador de imagenes.jar"')
    setTimeout(() => {
        callback()
    }, 5000);
}
//carga la imagen codificada
function loadImageChanged(callback){
    fs.readFile('imgIncode.txt', 'utf8', (error, data) => {
        if (error) throw error;
        base64 = data;
    });
    setTimeout(() => {
        callback()
    }, 3000);
}

function sendImageModified(){
    axios.enviar
}

/*
function cargarImagen(){
    var phrase = 'No se alcanzo a leer la frase de la api';
    var options = {
        method: 'GET',
        url: 'https://iiif.harvardartmuseums.org/manifests/object/216847',        
      };
      
      axios.request(options).then(function (response) {          
          phrase=response.data.label;
          console.log('Frase leida desde la api: '+phrase);
      }).catch(function (error) {
          console.error(error);
      });

        Jimp.read('image.png', (err, imageLoaded) => {
        if (err) throw err;
        console.log('la imagen se ha cargado')
        setTimeout(function() {
        Jimp.loadFont(Jimp.FONT_SANS_64_BLACK).then(font => {
            console.log('esto es la frase antes de imprimirla, creo: '+phrase)
            imageLoaded.print(font, 50, 1000, {
                text: phrase
              });
        });
    },5000);
        setTimeout(function() {
            imageLoaded.write('nueva.png')        
            console.log('la nueva imagen se ha guardado')
        },10000);
        
        /*lenna
          .resize(256, 256) // resize
          .quality(60) // set JPEG quality
          .greyscale() // set greyscale
          .write('lena-small-bw.jpg'); // save
      });
}*/



app.get('/', (req, res) => {

     /*var options = {
        method: 'GET',
        url: 'https://iiif.harvardartmuseums.org/manifests/object/216847',        
      };
      
      axios.request(options).then(function (response) {
          console.log(response.data.label);
      }).catch(function (error) {
          console.error(error);
      });*/
    
    res.sendStatus(200);
});
//cargarImagen()

app.post('/image/', upload.none()   , function (req, res, next) {
    
    console.log(req.body.my_field)
    
    //------------
    /*createImageArrived(req.params.img, function(){
        writeInImage(function(){
            codifyNewImage(function(){
                loadImageChanged(function(){
                    sendImageModified()
                })
            })
        })
    })*/
    
})


    

const config = {
    application: {
        cors: {
            server: [
                {
                    origin: ('*'),
                    credentials: true
                }
            ]
        }
    }
}

app.use(cors(
    config.application.cors.server
));

app.listen(4001, () => {
    console.log('Instancia running on http://localhost:4001')
});

