import express from "express";
import dotenv from "dotenv";


const router = express.Router();


router.post("/body",body)

router.get("/query",query)

router.get("/params/:id",Params)


function body(req,res){
    console.log("inside")
   console.log("Body",req.body)
}

function query(req,res){
console.log("query",req.query)
  
res.json("heyy")

}
function Params(req,res){
console.log("Params",req.params)

res.json("heyy== PArams herer")
}


export default router