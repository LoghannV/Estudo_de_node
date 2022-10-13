const puppeter = require("puppeteer");
const express = require("express")
const fs = require("fs");
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars')
const app = express()
const port = 8081
app.engine('handlebars',handlebars.engine({defaultLayout:'main'}))
app.set('view engine','handlebars')

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

async function pesq(pesquisa){
    const browser = await puppeter.launch()
    const page = await browser.newPage();

   
    await page.goto('https://pt.wikipedia.org/wiki/'+pesquisa);
    await page.screenshot({path: 'example3.png'})
    
    const TextArray = await page.evaluate(()=>{
    //     // FUNÇÃO SERA EXECUTADA NO DOM

    //     //vamos pegar todo texto que esta no corpo
      const nodeList = document.querySelectorAll("#bodyContent p")[1].innerHTML
    
    //     //transforma em js
         
         // tira da função
         return nodeList;
    })
     fs.writeFile("TextArea.txt",TextArray, err =>{
        if(err) throw new Error("something went wrong")
        console.log('FOi')
     })

     await browser.close()
     // CONVERTE PARA JSON JSON.stringify(TextArray)
     return TextArray
}

app.post('/pesquisar',async function(req,res){
     let texto = await pesq(req.body.item).then()
     res.render('pesquisa',{
          texto:texto
     })
})
app.get("/",function(req,res){
     res.render('pesquisa')

})
app.listen(port)