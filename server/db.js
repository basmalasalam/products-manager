import mysql from "mysql2";
const db=mysql.createConnection({
    host:'localhost',
    user:"root",
    password:"",
    database:"Products_db"
});
db.connect((err)=>{
    if(err){
        console.log("error connecting database");
        
    }
    else{
    console.log("connected to db successfully");}
    
});
export default db;