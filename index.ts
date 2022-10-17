import express, {Express, Request, Response, NextFunction} from 'express';
import { Prisma } from '@prisma/client';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './src/routes/routes';
import { MulterError } from 'multer';
dotenv.config();

const app: Express = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(routes);

const port = process.env.PORT || 3000;

app.use((err: Error | Prisma.PrismaClientKnownRequestError | MulterError, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    
    if(err instanceof MulterError){
        return res.status(400).json({message: err.message});
    }
    // @ts-ignore
    if (err && err.meta) {
        // @ts-ignore
        if(err.code === 'P2002'){
            // @ts-ignore
            res.status(409).json({message: err.message, target: err.meta.target});
        }else{
            res.status(400).json({message: err.message});
        }
      
    } else if (err) {
        res.status(500).json({message: err.message});
    }
});

app.listen(port, ()=> console.log(`🚀 Server ready at http://localhost:${port}`));



