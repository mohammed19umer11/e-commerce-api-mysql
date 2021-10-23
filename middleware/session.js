import session from 'express-session';
import connectRedis from 'connect-redis';
import client from '../db/redis-connection.js';

const RedisStore = connectRedis(session);
export default session({
    store: new RedisStore({client}),
    secret: process.env.SESSION_SECRET_KEY || 'secret',
    saveUninitialized: false,
    resave: false,
    name: 'SESSIONID',
    cookie: {
            secure: false, //true for https || true in production
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 3 //3 days
    }
})