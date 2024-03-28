const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.rkpusfk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // await client.connect();
        //Users code start from here:
        const database = client.db('foodrocket')
        const users = database.collection('users')
        const restaurants = database.collection('restaurants')
        const menu = database.collection('menu')
        const orders = database.collection('orders')
        const favorite = database.collection('favorite')



        /* START USERS */

        //Users >> Create (upsert)
        app.post('/users', async (req, res) => {
            const user = req.body;

            const query = { email: user.email }
            const existingUser = await users.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exists', insertedId: null })
            }
            const result = await users.insertOne(user);
            res.send(result);
        });
        //Users >> read all
        app.get('/users', async (req, res) => {
            const result = await users.find().toArray()
            res.send(result)
        })
        //Users >> read one
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id

            const filter = { email: id }
            const result = await users.findOne(filter)
            res.send(result)
        })
        //Users >> update one (change role)
        app.put('/manage-users/:id', async (req, res) => {
            const id = req.params.id
            const changeRole = req.body

            const filter = { _id: new ObjectId(id) }
            const updatedUser = {
                $set: {
                    role: changeRole.role
                }
            }
            const result = await users.updateOne(filter, updatedUser)
            res.send(result)
        })
        //users/_id >> Delete
        app.delete('/manage-users/:id', async (req, res) => {
            const id = req.params.id

            const filter = { _id: new ObjectId(id) }
            const result = await users.deleteOne(filter)
            res.send(result)
        })


        /* USERS END */
        /* RESTAURANTS START */


        //restaurants >> Create
        app.post('/restaurants', async (req, res) => {
            const restaurant = req.body

            const result = await restaurants.insertOne(restaurant)
            res.send(result)
        })
        //restaurants >> Read
        app.get('/restaurants', async (req, res) => {
            const result = await restaurants.find().toArray()
            res.send(result)
        })
        //restaurants/_id >> Read one
        app.get('/restaurants/:id', async (req, res) => {
            const id = req.params.id

            const filter = { _id: new ObjectId(id) }
            const result = await restaurants.findOne(filter)
            res.send(result)
        })
        //restaurants/_id >> update one
        app.put('/restaurants/:id', async (req, res) => {
            const id = req.params.id
            const restaurant = req.body

            const filter = { _id: new ObjectId(id) }
            const updatedRestaurant = {
                $set: { ...restaurant }
            }
            const options = { upsert: true }

            const result = await restaurants.updateOne(filter, updatedRestaurant, options)
            res.send(result)
        })
        //restaurants/_id >> Delete
        app.delete('/restaurants/:id', async (req, res) => {
            const id = req.params.id

            const filter = { _id: new ObjectId(id) }
            const result = await restaurants.deleteOne(filter)
            res.send(result)
        })


        /* RESTAURANTS END */
        /* MENU START */

        //menu >> Create
        app.post('/menu', async (req, res) => {
            const item = req.body

            const result = await menu.insertOne(item)
            res.send(result)
        })
        //menu/_id >> Read one
        app.get('/menu/:id', async (req, res) => {
            const id = req.params.id

            const filter = { _id: new ObjectId(id) }
            const result = await menu.findOne(filter)
            res.send(result)
        })
        //menu?email= >> Read query
        app.get('/menu-query', async (req, res) => {
            const email = req.query.email;
            const filter = { restaurantId: email };
            const result = await menu.find(filter).toArray();
            res.send(result);
        });
        //menu/restaurantId >> Read (filter)
        app.get('/menu-restaurantId/:id', async (req, res) => {
            const id = req.params.id

            const filter = { restaurantId: id }
            const result = await menu.find(filter).toArray();
            res.send(result)
        })
        //menu/_id >> update one
        app.put('/menu/:id', async (req, res) => {
            const id = req.params.id
            const item = req.body

            const filter = { _id: new ObjectId(id) }
            const updatedMenu = {
                $set: { ...item }
            }

            const result = await menu.updateOne(filter, updatedMenu)
            res.send(result)
        })
        //menu/_id >> Delete
        app.delete('/menu/:id', async (req, res) => {
            const id = req.params.id

            const filter = { _id: new ObjectId(id) }
            const result = await menu.deleteOne(filter)
            res.send(result)
        })



        /* MENU END */


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Welcome to express-server')
})

app.listen(port, () => {
    console.log(`express-server is running on ${port}`)
})