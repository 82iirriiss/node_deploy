const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
//const helmet = require('helmet');
//const hpp = require('hpp');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

dotenv.config();
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD
});

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const { sequelize } = require('./models');
const passportConfig = require('./passport');
const logger = require('./logger');

const app = express();
passportConfig(); // 패스포트 설정
app.set('port', process.env.PORT || 8005);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });
//morgan 개발/운영에 따른 설정
if( process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')); // 'dev'에 비하여 더 많은 사용자 정보를 남기므로 추후 버그 해결에 더 유용함.
  //app.use(helmet());
  //app.use(hpp({contentSecurityPolicy: false}));
} else {
  app.use(morgan('dev'));
}
// app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  store: new RedisStore({client: redisClient})
};

// 배포환경에서는 proxy와 cookie.secure를 true로 바꿈. 
// 하지만 모든 환경이 그런 것은 아니고, https 적용을 위해서 앞에 다른 서버를 두었을 때.
if( process.env.NODE_ENV === 'production') {
  sessionOption.proxy = true;
  //sessionOption.cookie.secure = rtrue; <= false
}
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  logger.info('hello');
  logger.error(error.message);
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// app.listen(app.get('port'), () => {
//   console.log(app.get('port'), '번 포트에서 대기중');
// });


module.exports = app;