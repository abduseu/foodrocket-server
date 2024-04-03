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
        const favorites = database.collection('favorites')
        const checkout_cart = database.collection('cart')
        const foodbank = database.collection('foodbank')



        /* START USERS */

        //Users >> Create
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
        //Users >> update one (change userInfo)
        app.put('/manage-users/:id', async (req, res) => {
            const id = req.params.id
            const userInfo = req.body

            const filter = { _id: new ObjectId(id) }
            const updatedUser = {
                $set: { ...userInfo }
            }
            const options = { upsert: true }

            const result = await users.updateOne(filter, updatedUser, options)
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
        /* CART START */


        //cart >> Create
        app.post('/cart', async (req, res) => {
            const item = req.body

            const result = await checkout_cart.insertOne(item)
            res.send(result)
        })
        //Cart?email >> Read query
        app.get('/cart', async (req, res) => {
            const email = req.query.email;

            const filter = { userId: email };
            const result = await checkout_cart.find(filter).toArray();
            res.send(result);
        });
        //Cart/_id >> Delete
        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id

            const filter = { _id: new ObjectId(id) }
            const result = await checkout_cart.deleteOne(filter)
            res.send(result)
        })


        /* CART END */
        /* FAVORITE START */


        //favorite >> Create
        app.post('/favorite', async (req, res) => {
            const restaurant = req.body

            const result = await favorites.insertOne(restaurant)
            res.send(result)
        })
        //favorite?email >> Read query
        app.get('/favorite', async (req, res) => {
            const email = req.query.email;

            const filter = { userId: email };
            const result = await favorites.find(filter).toArray();
            res.send(result);
        });
        //favorite/_id >> Delete
        app.delete('/favorite/:id', async (req, res) => {
            const id = req.params.id

            const filter = { _id: new ObjectId(id) }
            const result = await favorites.deleteOne(filter)
            res.send(result)
        })


        /* FAVORITE END */
        /* ORDERS START */


        //orders >> Create
        app.post('/orders', async (req, res) => {
            const order = req.body

            const result = await orders.insertOne(order)
            res.send(result)
        })
        //orders >> read all
        app.get('/orders', async (req, res) => {
            const result = await orders.find().toArray()
            res.send(result)
        })
        //orders/_id >> Read one
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id

            const filter = { _id: new ObjectId(id) }
            const result = await orders.findOne(filter)
            res.send(result)
        })
        //orders?email >> Read query (placed orders)
        app.get('/placed-orders', async (req, res) => {
            const email = req.query.email;

            const filter = { userId: email };
            const result = await orders.find(filter).sort({ _id: -1 }).toArray()
            res.send(result)
        })
        //orders?id >> Read query (received orders)
        app.get('/received-orders', async (req, res) => {
            const id = req.query.id;

            const filter = { restaurantId: id };
            const result = await orders.find(filter).sort({ _id: -1 }).toArray()
            res.send(result)
        })
        //orders/_id >> Update
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id
            const orderInfo = req.body

            const filter = { _id: new ObjectId(id) }
            const updateOrder = {
                $set: { ...orderInfo }
            }
            const options = { upsert: true }

            const result = await orders.updateOne(filter, updateOrder, options)
            res.send(result)
        })
        //orders/_id >> Delete
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id

            const filter = { _id: new ObjectId(id) }
            const result = await orders.deleteOne(filter)
            res.send(result)
        })


        /* ORDERS END */
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
        //restaurant-email?email >> Read one (query)
        app.get('/restaurant-email', async (req, res) => {
            const email = req.query.email

            const filter = { email: email }
            const result = await restaurants.findOne(filter)
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
        /* FOODBANK START */


        //foodbank >> create
        app.post('/foodbank', async (req, res) => {
            const donation = req.body

            const result = await foodbank.insertOne(donation)
            res.send(result)
        })
        //foodbank >> read all
        app.get('/foodbank', async (req, res) => {
            const result = await foodbank.find().toArray()
            res.send(result)
        })
        //foodbank?email >> Read query (placed donations)
        app.get('/placed-donations', async (req, res) => {
            const email = req.query.email;

            const filter = { restaurantEmail: email };
            const result = await foodbank.find(filter).sort({ _id: -1 }).toArray()
            res.send(result)
        })
        //foodbank/_id >> Update
        app.put('/foodbank/:id', async (req, res) => {
            const id = req.params.id
            const donationInfo = req.body

            const filter = { _id: new ObjectId(id) }
            const updateDonation = {
                $set: { ...donationInfo }
            }
            const options = { upsert: true }

            const result = await foodbank.updateOne(filter, updateDonation, options)
            res.send(result)
        })
        //foodbank/_id >> Delete
        app.delete('/foodbank/:id', async (req, res) => {
            const id = req.params.id

            const filter = { _id: new ObjectId(id) }
            const result = await foodbank.deleteOne(filter)
            res.send(result)
        })


        /* FOODBANK END */


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