const Express = require('express');
const bodyParser = require('body-parser');
const Mongoose = require('mongoose');
const request = require('request');

var app = new Express();

app.use(Express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200' );

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

Mongoose.connect("mongodb://localhost:27017/rent");
// Mongoose.connect("mongodb+srv://dbcm:dbcm@clustermy-zwohv.mongodb.net/rent?retryWrites=true&w=majority")
const UserModel = Mongoose.model("users",{
    fname:String,
    uemail:String,
    uaddress:String,
    umobile:String,
    uname:String,
    upass:String,
    urole:{
        type:Number,
        default:null
    },
    jstatus:{
        type:Number,
        default:0
    }
});
 
const CarModel = Mongoose.model("carsses",{
    cname:String,
    cmodel:String,
    crent:String,
    cpicture:String,
    cdesc:String,
    cfuel:String,
    fdate:String,
    tdate:String,

    cstatus:{
        type:Number,
        default:0
    }
});
const BookModel = Mongoose.model("car",{
    cname:String,
    cmodel:String,
    crent:String,
    cpicture:String,
    cdesc:String,
    cfuel:String,
    fdate:String,
    tdate:String,

});
app.post('/booking',(req,res)=>{
    var item = req.body._id;
    var result = BookModel.save({_id:item},(error,data)=>{
        console.log(req.body);
        let query = Object.keys(req.body).map(key => key + '=' + req.body[key]).join('&');
        console.log(query.includes("startTime") + " " + query.includes("endTime"));
        if(query.includes("startTime") && query.includes("endTime")){   
            console.log(req.body.startTime);
            Booking.find( {"$or" : [{"booking_startTime" : {"$gte" : req.body.startTime, "$lt" : req.body.endTime}},{ "booking_endTime" : {"$gt" : req.body.startTime, "$lt" : req.body.endTime }}]},res);
        }
        else{    
            Booking.find(req.body,res);
        }
    });

});

       
    


app.post('/rentregister',(req,res)=>{

    var user = new UserModel(req.body);
    var useremail = user.uemail;

    UserModel.findOne({uemail:useremail},(error,data)=>{
        if(!data)
        {
            user.save((error,data)=>{
                if(error)
                {
                    throw error;
                    res.send(error);
                }
                else
                {
                    res.json("User Registered Successfully!!");
                }
            });
        }
        else
        {
            if(useremail == data.uemail)
            {
                console.log('Email already exists');
                res.json("Email already Exists!!");
            }
        }
    });

});

app.post('/rentforgotpwd',(req,res)=>{

    var user = new UserModel(req.body);
    var useremail = user.uemail;
    var userpwd = user.upass;

    UserModel.findOne({uemail:useremail},(error,data)=>{
        if(!data)
        {
            res.json("Cannot find Email ID !!");
        }
        else
        {
            UserModel.updateOne({uemail:useremail},{$set:{upass:userpwd}},(error,data)=>{
                if(error)
                {
                    throw error;
                    res.send(error);
                }
                else
                {
                    console.log(data);
                    res.json("Password Updated Successfully!!");
                }
            });
        }
    });

});

app.get('/login',(req,res)=>{
    var x = req.query.uemail;
    var y = req.query.upass;

    var result = UserModel.find({$and:[{uemail:x},{upass:y}]},(error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send(data);
        }
    });

});

const APIurl1 = "http://localhost:3003/login";

app.post('/rentlogin',(req,res)=>{
    var item1 = req.body.uemail;
    var item2 = req.body.upass;

  request(APIurl1+"/?uemail="+item1+"&&upass="+item2,(error,response,body)=>{
    var data = JSON.parse(body);
    res.send(data);
  });
});

app.get('/rentviewuser',(req,res)=>{
    UserModel.find({urole:{$ne:3}},(error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send(data);
        }
    });
});


app.post('/rentsingleuser',(req,res)=>{
    var user = new UserModel(req.body);
    var userfname = user.fname;
    UserModel.find({fname:userfname},(error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send(data);
        }
    });
});

app.post('/rentuserstatus',(req,res)=>{

    var userid = req.body.eid;
    var userrole = req.body.uroleset;
    var result = UserModel.updateOne({_id:userid},{$set:{urole:userrole}},(error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.json("Userrole Updated Successfully!!");
        }
    });
});
app.post('/addcar',(req,res)=>{
    console.log(req.body);
    var Car= new CarModel(req.body);
    var result = Car.save( (error,data)=>{
        if(error){
            throw error;
            res.send(error);
        }
        else{
            res.send('add car');
        }
    });
});

app.get('/vcar',(req,res)=>{
    var result = CarModel.find((error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send(data);
        }
    });
});

app.post('/addbookcar',(req,res)=>{
    console.log(req.body);
    var Car1= new CarModel(req.body);
    var result = Car1.save( (error,data)=>{
        if(error){
            throw error;
            res.send(error);
        }
        else{
            res.send('add car');
        }
    });
});
app.get('/vcar1',(req,res)=>{
    var result = CarModel.find((error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send(data);
        }
    });
});

app.post('/search',(req,res)=>{
    var item = req.body.cmodel;
    var result = CarModel.find({cmodel:item},(error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send(data);
        }
    });
  });

  app.post('/delete',(req,res)=>{
    var item = req.body._id;
    var result = CarModel.deleteOne({_id:item},(error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send(data);
        }
    });
  });    
  app.post('/delete1',(req,res)=>{
    var item = req.body._id;
    var result = BookModel.deleteOne({_id:item},(error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send(data);
        }
    });
  }); 
 
  app.post('/update',(req,res)=>{
    const x = req.body._id;
    const Carname= req.body.cname;
    const Model = req.body.cmodel;
    const Rent = req.body.crent;
    const Fuel = req.body.cfuel;
    const Description = req.body.cdesc;
    const Picture = req.body.cpicture;
    const Fromdate = req.body.fdate;
    const Todate = req.body.tdate;
    console.log(x);
    var result = CarModel.updateOne({_id:x},{$set:{cname:Carname,cmodel:Model,crent:Rent,cfuel:Fuel,cpicture:Picture,cdesc:Description,fdate:Fromdate,tdate:Todate}},(error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send(data);
        }
    });
  });
  app.post('/update1',(req,res)=>{
    const x = req.body._id;
    const Model = req.body.cmodel;
    const Fromdate = req.body.fdate;
    const Todate = req.body.tdate;
    console.log(x);
    var result = BookModel.find({_id:x},{$or:{
        crent:Rent,cfuel:Fuel,cpicture:Picture,cdesc:Description,fdate:Fromdate,tdate:Todate}},(error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send(data);
        }
    });
  });
 

app.listen(process.env.PORT || 3003,()=>{
    console.log("Server Running on PORT: http://localhost:3003");
});