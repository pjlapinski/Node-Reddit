const config = require('./config/config');
const router = require('./routes');
const express = require('express');
const client = require('./config/postgresClient');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.set('socketio', io);

app.use(cors({ origin: config.CLIENT_HOST, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const redisClient = redis.createClient();
redisClient.on('error', err => {
  console.error(`Redis: ${err}`);
});

const sessionStore = new RedisStore({
  client: redisClient,
});
const sessionMiddleware = session({
  secret: config.PASSPORT_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await client.query(`SELECT * FROM reddit_user WHERE email='${username}'`);
    if (user.rowCount === 0) {
      return done(null, false, { message: `No user with email ${username} exists` });
    }
    if (user.rows[0].password !== password) {
      return done(null, false, { message: 'Invalid password' });
    }
    return done(null, user.rows[0]);
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  const user = await client.query(`SELECT * FROM reddit_user WHERE id=${id}`);
  if (user.rowCount === 0) {
    return cb(null, false, { message: `No user with id ${id}` });
  }
  return cb(null, user.rows[0]);
});

app.use((req, res, next) => {
  const savedBody = { ...req.body };
  for (let key in savedBody) {
    if (key.toLowerCase().includes('password') || key === 'image') {
      delete savedBody[key];
    }
  }
  console.log(`${req.method} ${req.headers.origin} ${req.originalUrl} ${JSON.stringify(savedBody)}`);
  next();
});

app.use((req, res, next) => {
  req.flash = (severity, msg) => {
    res.json({ error: msg, severity });
  };
  next();
});

app.use('/', router);

app.get('/', (req, res) => {
  res.sendStatus(200);
});

// errors
if (config.DEVELOPMENT) {
  app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(err.status || 500);

    res.json({
      error: {
        message: err.message,
        status: err.status,
        trace: err.stack,
      },
    });
  });
} else {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);

    res.json({
      error: {
        message: err.message,
        status: err.status,
      },
    });
  });
}

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.on('connect', socket => {
  socket.on('whoami', () => {
    socket.emit('whoami', socket.request.user);
  });
  socket.on('new-comment', comment => {
    client
      .query(
        `INSERT INTO comment (content, user_id, post_id)
        VALUES ('${comment.content}', ${socket.request.user.id}, ${comment.post})
        RETURNING id`
      )
      .then(id => {
        const commentWithAuthor = { ...comment, id: id.rows[0].id, author: socket.request.user.email };
        io.emit('new-comment', commentWithAuthor);
      });
  });
  const session = socket.request.session;
  session.socketId = socket.id;
  session.save();
});

client.connect().then(() => {
  server.listen(config.PORT, () =>
    console.log(`Started ${config.DEVELOPMENT ? 'development' : 'production'} server on ${config.HOST}`)
  );
});
