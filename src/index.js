import express from 'express';
import morgan from 'morgan';
import dataServer from './data-server';
import { logger, accessLogger, ACCESS_FORMAT } from './config/logger';
import models, { sequelize } from './models';
import createDemoData from './demo-seeder';

const { PORT = 9000 } = process.env;

const app = express();

app.use(morgan(ACCESS_FORMAT, { stream: accessLogger.stream }));

dataServer.applyMiddleware({ app, path: '/graphql' });

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  logger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
  );

  // render the error page
  res.status(err.status || 500).json({ error: err.message, status: err.status });
  //   res.status(err.status || 500);
  //   res.render('error');
});

sequelize.sync({ force: true }).then(async () => {
  createDemoData(models).then(async () => {
    app.listen(PORT, () => {
      logger.info(`🚀  Server ready at http://localhost:${PORT}${dataServer.graphqlPath}`); // eslint-disable-line no-console
    });
  });
});
