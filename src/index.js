const express = require('express');
const app = express();

app.use(express.json());

const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://Bhagaban:L2vSe5ZRZjoVfhOA@cluster0.ojbuh.mongodb.net/cowinclone",{
    useNewUrlParser: true,
})
.then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log(err);
})


const route = require('./routes/route');
app.use('/', route);

app.listen(process.env.PORT || 3000, function () {
    console.log(`Server Connected at port ${process.env.PORT || 3000}`)
});