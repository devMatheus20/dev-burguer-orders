const express = require('express')
const { request } = require('http')
const uuid = require('uuid')
const port = 3000
const app = express()

app.use(express.json())


const orders = []

// Middlewares
const checkIdUser = (request, response, next) => {
    const {id} = request.params

    const index = orders.findIndex(user => user.id === id)

    if(index < 0) response.status(404).json({message: "Not Found"})

    request.userId = id
    request.userIdex = index

    next()
}

const methodAndUrl = (request, response, next) => {
    console.log(`URL: ${request.url}\nMétodo: ${request.method}`)

    next()
}




// Rotas
app.post('/order', methodAndUrl, (request, response) => {
    const {order, clienteName, price, status} = request.body

    const newOrder = {id:uuid.v4(), order, clienteName, price, status}

    orders.push(newOrder)

    return response.status(201).json(newOrder)
})

app.get('/order', methodAndUrl, (request, response) => {
    return response.json(orders)
})

app.put('/order/:id', methodAndUrl, checkIdUser, (request, response) => {
    const {order, clienteName, price, status} = request.body

    const updateOrder = {id:request.userId, order, clienteName, price, status}

    orders[request.userIdex] = updateOrder

    return response.status(200).json({message: "Pedido atualizado!"})
})

app.get('/order/:id', methodAndUrl, checkIdUser, (request, response) => {
    return response.json(orders[request.userIdex])
})

app.patch('/order/:id', methodAndUrl, checkIdUser, (request, response) => {
    const index = request.userIdex

    const {id, clienteName, order, price} = orders[index]

    const updateStatusOrder = {
        id,
        clienteName,
        order,
        price,
        status: "Pronto"
    }

    orders[index] = updateStatusOrder

    return response.status(200).json(updateStatusOrder)
})


//Porta
app.listen(port)