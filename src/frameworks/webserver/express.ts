import express,{Application} from 'express';
import cors from 'cors';
// app.use(cors());


const expressConfig=(app:Application)=>{
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));

 // CORS options
const corsOptions = {
    origin: 'http://localhost:5173', // Frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
};

// Use CORS middleware
app.use(cors(corsOptions));

//routes for each endpoint


}

export default expressConfig;