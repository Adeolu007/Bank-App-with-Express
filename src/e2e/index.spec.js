const request = require('supertest')
const express = require('express')

const app = express()

app.get("hello", (req, res)=> res.sendStatus(200))

describe('hello endpoint', ()=>{
    it('get /hello and expect 200',()=>{
request(app).get("/hello").expect(200)
    })
})