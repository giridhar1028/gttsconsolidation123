var express = require('express');
var app = express();
var fileUpload = require('express-fileupload');
app.use(fileUpload());
var cors = require('cors');
app.use(cors());
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var sql = require("mssql");
var nodemailer = require('nodemailer');
// require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();
//login to mail
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mail2giridharsai@gmail.com',
    pass: 'Savechanges@@123'
  }
});

var mailsent =false;
setInterval(()=>{
  var date = new Date();
  var day = date.getDay();
  var time = date.getHours()
  if(day===5&& time ===18){
    if(mailsent===false){
      console.log(day,time);
      gttssendremindermail();
      mailsent=true;
    }
    else{
      console.log("mail already sent, don't send mail");
      if(time ===19){
        mailsent=false;
      }
    }
  }
          },3600000);
function gttssendremindermail(){ 

  let filename = "EmployeeData";
  var dropoffLocation = '/Files/';
  var filePath = __dirname + dropoffLocation + filename + '.json';


    var jsondata = fs.readFileSync(filePath);
    var mailids = JSON.parse(jsondata).Employee.map((emp)=>{ return emp.EmpMail });
   // console.log(mailids);
   console.log(mailids.join(';'));

  var mailOptions = {
    from: 'mail2giridharsai@gmail.com',
    to: mailids.join(';'),
    subject: 'GTTS Reminder',
    html: '<h1> GTTS Reminder </h1><p> Please fill GTTS, ignore if filled</p>'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      console.log("unable to send otp");
    } else {
      console.log('Email sent: ' + info.response);
    }
  });    

  return;
}


app.post('/checkfileexists', function (req, res) {

  let filename = req.body.filename.trim();
  var dropoffLocation = '/MonthlyJsonFiles/';
  var filePath = __dirname + dropoffLocation + filename + '.json';
  console.log(filePath)
  //console.log(fs.existsSync(filePath));
  res.send(fs.existsSync(filePath));
});

app.post('/createjsonfile', function (req, res) {

  let filename = req.body.filename.trim();
  let jsondata = req.body.jsondata.trim();
  var dropoffLocation = '/MonthlyJsonFiles/';
  var filePath = __dirname + dropoffLocation + filename + '.json';

fs.writeFileSync(filePath,jsondata );

var file_content = fs.readFileSync(filePath);
var content = JSON.parse(file_content);
//console.log(content)

  res.send(filePath);


});

app.post('/getjsondata', function (req, res) {

  let filename = req.body.filename.trim();
  var dropoffLocation = '/MonthlyJsonFiles/';
  var filePath = __dirname + dropoffLocation + filename + '.json';
  try {

    var jsondata = fs.readFileSync(filePath);
   
     //chatdata = chatdata.toString().replace(/,\s*$/, "");
     //console.log("filename ", jsondata)
     res.send( jsondata );
  }
  catch{
    //console.log("empty")
   res.send( jsondata );
  }


});

app.post('/updatejson', function (req, res) {

  let filename = req.body.filename.trim();
  let jsondata = req.body.jsondata.trim();
  var dropoffLocation = '/MonthlyJsonFiles/';
  var filePath = __dirname + dropoffLocation + filename + '.json';

fs.writeFileSync(filePath,jsondata );

var file_content = fs.readFileSync(filePath);
var content = JSON.parse(file_content);
//console.log(content)

  res.send(filePath);


});
app.post('/addEmployee', function (req, res) {

  let filename = req.body.filename.trim();
  let jsondata = req.body.jsondata.trim();
  var dropoffLocation = '/Files/';
  var filePath = __dirname + dropoffLocation + filename + '.json';

fs.writeFileSync(filePath,jsondata );


var file_content = fs.readFileSync(filePath);
var content = JSON.parse(file_content);
console.log(content)
InitiateProcess();
  res.send(filePath);


});
// edite on 7/2/2020 --- adding authentication
app.post('/getempdata', function (req, res) {

  let filename = req.body.filename.trim();
  var dropoffLocation = '/Files/';
  var filePath = __dirname + dropoffLocation + filename + '.json';
  try {

    var jsondata = fs.readFileSync(filePath);
   
     //chatdata = chatdata.toString().replace(/,\s*$/, "");
    // console.log("filename ", jsondata)
     res.send( jsondata );
  }
  catch{
    console.log("empty")
   res.send( jsondata );
  }


});

app.post('/sendotp', function (req, res) {

  let empname = req.body.empname.trim();
  let Mailid =  req.body.empmailid.trim();


  try {
    const Otp = Math.floor(100000 + Math.random() * 900000);

    var mailOptions = {
      from: 'mail2giridharsai@gmail.com',
      to: Mailid,
      subject: 'GTTS Login OTP',
      html: '<h1>'+Otp+'</h1><p> OTP Expires in 2 minutes. Please Hurry!</p>'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.send("unable to send otp");
      } else {
        console.log('Email sent: ' + info.response);
        res.send(Otp.toString());
      }
    });     
  }
  catch(error){
    console.log(error)
    res.send("unable to send otp");
  }


});


//Employee details ========================================================================================
//============================================================================================================

let holdArray = [];
let ERDlist = [];
let dummieERDlist = [];
let queue = [];
const date = new Date();





//this function executes when server starts
InitiateProcess();
app.get("/",(req,res) => {
  
     console.log("Initiating");
     
})

function InitiateProcess() {

    let Employeedetails = require("./Files/EmployeeData.json");
   // //console.log(Employeedetails);
    
    holdArray = [];
    ERDlist = [];
    dummieERDlist = [];
    queue = [];

    Employeedetails.Employee.map(Emp => {
         
        const ERD = new Date(Emp.LWD);//ERD- Employee Release Date
        const presentDate = new Date();
       
        if(ERD > presentDate){

                    let obj = {
                                empid : Emp.EmpId,
                                LWD : ERD,
                                empName: Emp.EmpNmae,
                                EmpMail : Emp.EmpMail,
                            }

                    if(Emp.Hold){
                    
                        holdArray.push(obj)

                    }else{

                        // makking an array of Employees Release dates
                            ERDlist.push(obj);
                            dummieERDlist.push(obj);
                    }
        }
    })

    //sorting the ERDList(array) according to latest release date(Ascending order)
     queue =  dummieERDlist.sort((a,b) => a.LWD - b.LWD);

     //calling Handlesendmail function
     handleSendMail();


}


function handleSendMail(){

    const presentdate = date.toLocaleDateString();
    const presentdateInMilliSeconds = Date.parse(presentdate);

    let threeDaysInMilliseconds = -259200000;

    if(queue.length > 0 ){

        const LWD  = queue[0].LWD;
        const LwdInMilliSeconds = Date.parse(LWD);
   
       timeout = ((LwdInMilliSeconds - 259200000) - presentdateInMilliSeconds);
        //triggering mails
   

        if(timeout > 0 ){

                    var trigger = setTimeout(() => {

                                        var mailOptions = {
                                            from: 'mail2giridharsai@gmail.com',
                                            to: queue[0].EmpMail,
                                            subject: 'Sending Email using Node.js',
                                            html: '<h1>Welcome</h1><p>That was'+queue[0].empName+' easy!</p>'
                                        };
                                        
                                        transporter.sendMail(mailOptions, function(error, info){
                                            if (error) {
                                            //console.log(error);
                                            } else {
                                            //console.log('Email sent: ' + info.response);
                                            }
                                        });
                        
                                        queue.shift();
                                        handleSendMail(); 
                                    }, timeout);

        }else if( parseInt(threeDaysInMilliseconds) < parseInt(timeout) && parseInt(timeout) <= 0) {
            
                var mailOptions = {
                    from: 'mail2giridharsai@gmail.com',
                    to: queue[0].EmpMail,
                    subject: 'testing',
                    html: '<h6>Hi All</h6><p>Our team mate <b>'+queue[0].empName+'</b> is going to release on '+LWD.toDateString()+' make sure we get a party before '+LWD+' from him/her</p>'
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      //console.log(error);
                    } else {
                      //console.log('Email sent: ' + info.response);
                    }
                  });
            
            queue.shift();
            handleSendMail();
            
        }else{
            
        }

    }else{
    }

}

app.post("/EployeedatatList" , (req,res) => {

    let Employeedetails = require("./Files/EmployeeData.json");
    //console.log(req);
    
    let Emp =  Employeedetails.Employee.filter(emp => {return emp.EmpId === req.body.EmpId})
    res.send(Emp)

})

//Hold Employees from queue
app.post('/HoldEmp', (req,res) => {
//console.log(req.body)
    let Employeedetails = require("./Files/EmployeeData.json");

    Employeedetails.Employee.map(Emp => {
        if(Emp.EmpId === req.body.id.trim())
        {
            Emp.Hold = true;
            fs.writeFileSync("./Files/EmployeeData.json",JSON.stringify(Employeedetails));
            InitiateProcess();
            
        }
    })
    //console.log(holdArray);
    
    res.send(holdArray)

})

//UnHold Employees from queue
app.post('/UnHoldEmp', (req,res) => {

    let Employeedetails = require("./Files/EmployeeData.json");

    //console.log(Employeedetails)

    Employeedetails.Employee.map(Emp => {
        if(Emp.EmpId === req.body.id)
        {
            Emp.Hold = false;
            fs.writeFileSync("./Files/EmployeeData.json",JSON.stringify(Employeedetails));
            InitiateProcess();
            
        }
    })
    //console.log(holdArray);
    
    res.send(holdArray)

})

//Add details to queue.
app.post('/Addqueue' , (req,res) => {
    //console.log(req.body);

    let Employeedetails = require("./Files/EmployeeData.json");

    Employeedetails.Employee.map(Emp => {
            if(Emp.EmpId === req.body.EmployeId)
            {
                const EmpLWWD = req.body.lastday;
                Emp.LWD = EmpLWWD;
                fs.writeFileSync("./Files/EmployeeData.json",JSON.stringify(Employeedetails));
                //console.log("inside details");
                
            }
        })
        //console.log(Employeedetails);
        
        let employee = Employeedetails.Employee.filter(emp => {return emp.EmpId === req.body.EmployeId})
        InitiateProcess();
        res.send({Employee:employee});
      

    // }else{
    //     res.send("error");
    // }

   

})

//axios get queue(release dates)
app.get('/Addqueue' , (req,res) => {

    res.send(queue);

})

//get Hold employees
app.get('/getHoldArray',(req,res) => {
    res.send(holdArray);
})


//end Employee detail=================================================
//===================

app.listen(8002, function () {
  console.log('App running on port 8002');
});

