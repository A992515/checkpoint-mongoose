const express = require ('express');
const app = express();
const mongoose=require('mongoose')

// install and setup mongoose
require('dotenv').config({path:'./config/.env'});
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true, useFindAndModify: false 
  })
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error");
  });
//   Create a person having this prototype

let Schema=mongoose.Schema;
let personSchema=new Schema({
  name:{type:String,required:true},
  age:Number,
  favoriteFoods:[String]
});
// Create and Save a Record of a Model

let personModel=mongoose.model('Person',personSchema); 
let person=personModel({
  name:"Ahlem",
  age:28,
  favoriteFoods:["coscous","pizza"]
});
person.save(function(err,data){
  err ?
    console.log("error")
  :console.log("person is added")
});
//Create Many Records with model.create()

let arrayOfPeople=[
    {name:"Maher",age:22,favoriteFoods:["Kefteji","spaggete"]},
    {name:"Khaled",age:25,favoriteFoods:["Makloub","Riz","Tajin"]},
    {name:"Rania",age:17,favoriteFoods:["Mloukhia","Jelbena"]}
  ];
  personModel.create(arrayOfPeople,(err,data)=>{
    err ? console.log("error") : console.log(data)
  });
  //Use model.find() to Search Your Database

personModel.find({name:"Khaled"}).
then(doc=>{console.log(doc)}).catch(()=>{console.log(err)
});
// Use model.findOne() to Return a Single Matching Document from Your Database

personModel.findOne({favoriteFoods:{$in:["Tajin"]}}).
then(doc=>{console.log(doc)}).catch(()=>{console.log(err)
});
// Use model.findById() to Search Your Database By _id

var findPersonById = (personId, done) => {
    personModel.findById(personId, (err, data) => err ? done(err) : done(null, data)); 
  };
//Perform Classic Updates by Running Find, Edit, then Save

var findEditThenSave = function(personId, done) {
    var foodToAdd = 'hamburger';
    personModel.findById(personId, function(err, data) {
      person.favoriteFoods.push(foodToAdd).save();
      if (err) {
        return done(err);
      }
      else {
        done(null, data);
      }
    });
  };
//Perform New Updates on a Document Using model.findOneAndUpdate()
  personModel.findOneAndUpdate(
      {name: "Khaled"},
      {$set: {age:20}},
      {new : true},
      function(err,done){
        if(err){
          console.log("Error Ocurred")
        }
        console.log(done)
      }    
  );
  //  Delete One Document Using model.findByIdAndRemove

var findByIdAndRemove = (personId, done) => {
    personModel.findOneAndRemove(personId, (err, data) => err ? done(err) : done(null, data)); 
  };
//MongoDB and Mongoose - Delete Many Documents with model.remove()

personModel.remove({name:"Mary"},(err,person)=>{
    err ? console.log(err):console.log("persons with name Mary are deleted")
  });
// Chain Search Query Helpers to Narrow Search Results
personModel.find({favoriteFoods:{$in:["burrito"]}})
.sort({name:1})
.limit(2)
.select("-age")
.exec()
.then((doc)=>console.log(doc))
.catch(err=>console.log(err));

  






const port = 5000
  app.listen(port,()=>{console.log(`server running on port ${port}`)})