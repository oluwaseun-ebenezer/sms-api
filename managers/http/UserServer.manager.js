const http              = require('http');
const express           = require('express');
const cors              = require('cors');
const app               = express();
const rateLimit         = require('express-rate-limit');
const helmet            = require('helmet');
const mongoSanitize     = require('express-mongo-sanitize');
const xss               = require('xss-clean')
const morgan            = require('morgan');

module.exports = class UserServer {
    constructor({config, managers}){
        this.config        = config;
        this.userApi       = managers.userApi;
    }
    
    /** for injecting middlewares */
    use(args){
        app.use(args);
    }

    /** server configs */
    run(){
        const limiter = rateLimit({
            windowMs: 1 * 60 * 1000, // 1 minute
            limit: 100, // Limit each IP to 100 requests per `window` (here, per 1 minute).
            standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
            legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
        })

        app.use(limiter)

        app.use(cors({origin: '*'}));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true}));
        app.use('/static', express.static('public'));

        app.use(helmet());
        // By default, $ and . characters are removed completely from user-supplied input in the following places:
        // - req.body
        // - req.params
        // - req.headers
        // - req.query

        // To remove data using these defaults:
        // Prevent NoSQL injection
        app.use(mongoSanitize());

        // Prevent XSS attacks
        app.use(xss())

        app.use(morgan('combined'));

        /** an error handler */
        app.use((err, req, res, next) => {
            console.error(err.stack)
            res.status(500).send('Something broke!')
        });
        
        /** a single middleware to handle all */
        app.all('/api/:moduleName/:fnName', this.userApi.mw);

        let server = http.createServer(app);
        server.listen(this.config.dotEnv.USER_PORT, () => {
            console.log(`${(this.config.dotEnv.SERVICE_NAME).toUpperCase()} is running on port: ${this.config.dotEnv.USER_PORT}`);
        });
        
        // server is returned so that it can be used for tests
        return server
    }
}