const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const https = require('https')

const port = process.env.PORT || 3000;

const app = express()

app.use(express.static('public')); // use for css, images and etc.,
app.use(bodyParser.urlencoded({ extended: true })); // use this for accessing the html files

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/signup.html');
})

app.post('/', (req, res) => {

   const firstName = req.body.firstname;
   const lastName = req.body.lastname;
   const email = req.body.email;

   const data = {
      members: [
         {
            email_address: email,
            status: 'subscribed',
            merge_fields: {
               FNAME: firstName,
               LNAME: lastName
            }
         }
      ]
   }

   const jsonData = JSON.stringify(data);

   const url = 'https://us19.api.mailchimp.com/3.0/lists/3ffe9814a2';

   const options = {
      method: 'POST',
      auth: 'test1:08034a3a9fbc1ec0390bfbfa7fa9a6e5-us19'
   }

   const request = https.request(url, options, (response) => {

      if (response.statusCode === 200) {
         res.sendFile(__dirname + '/success.html');
      } else {
         res.sendFile(__dirname + '/failure.html');
      }

      response.on('data', (data) => {
         console.log(JSON.parse(data));
      })
   })

   request.write(jsonData);
   request.end();

})

app.post('/failure', (req, res) => {
   res.redirect('/');
})

app.listen(port, () => {
   console.log(`Listening on port : ${port}`);
})

// API Key
// 08034a3a9fbc1ec0390bfbfa7fa9a6e5-us19

// List ID
// 3ffe9814a2