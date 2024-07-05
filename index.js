const express= require("express");
const app= express();
const mongoose=require("mongoose");
const dotnev= require("dotenv");
const morgan= require("morgan")
const helmet= require("helmet");

dotnev.config();

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to MONGODB"))
    .catch((error) => {
        console.error("Error connecting to MONGODB:", error);
        process.exit(1);
    });

// Adding middleware 
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.get("/",(req,res)=>{
    res.send("Eshikha is a good girl")
});

app.get("/users",(req,res)=>{
    res.send("IT is for users")
});


app.listen(8800,()=>{
    console.log("Backend Server is running! SUIIIII")
}); 