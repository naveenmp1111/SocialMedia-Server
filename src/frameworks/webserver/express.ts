import express,{Application} from 'express';
import cors from 'cors';
// app.use(cors());


const expressConfig=(app:Application)=>{
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));

 // CORS options
const corsOptions = {
    origin: 'http://localhost:5173', // Frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
};

// CORS middleware
app.use(cors(corsOptions));

}

export default expressConfig;