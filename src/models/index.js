import Sequelize from 'sequelize';
import path from 'path';
import fs from 'fs';
import appRoot from 'app-root-path';
import { logger } from '../config/logger';

const dataRoot = path.join(appRoot.toString(), 'data');
if (!fs.existsSync(dataRoot)) {
  fs.mkdirSync(dataRoot);
}
const dbPath = path.join(dataRoot, 'mmw.db');
const sequelize = new Sequelize('mmw', null, null, {
  dialect: 'sqlite',
  storage: dbPath,
  sync: { force: true },
  logging: logger.debug,
  operatorsAliases: false,
});

const models = {
  Project: sequelize.import('./project'),
  Task: sequelize.import('./task'),
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

// sequelize
//   .sync()
//   .then(() => {
//     const project = models.Project.build({ id: 1 });
//     const task = models.Task.build({ id: 2 });
//     project.addTask(task);
//     project.save().then(() => {
//       logger.debug('saved project: %j', project);
//       models.Project.findAll({ include: [{ model: models.Task }] }).then(p => logger.debug('projects: %j', p));
//     });
//   })
//   .catch(e => logger.error('error: %j', e));

let seq = 0;
const nextSeq = () => ++seq;

// without transaction
// sequelize
//   .sync({ force: true })
//   .then(() => Promise.all([models.Project.create({ id: nextSeq() }), models.Task.create({ id: nextSeq() })]))
//   .spread((project, task) => task.setProject(project))
//   .then(() => models.Project.findAll({ include: [{ model: models.Task }] }))
//   .then(p => logger.debug('projects: %j', p));

// sequelize
//   .sync({ force: true })
//   .then(() => Promise.all([models.Project.build({ id: nextSeq() }), models.Task.build({ id: nextSeq() })]))
//   .spread((project, task) => {
//     task.setProject(project, { save: false });
//     return sequelize.transaction((tx) => {
//       project.save({ transaction: tx });
//       task.save({ transaction: tx });
//     });
//   })
//   .catch(e => logger.debug('error: %j', e))
//   .then(() => models.Project.findAll({ include: [{ model: models.Task }] }))
//   .then(p => logger.debug('projects: %j', p));

sequelize
  .sync({ force: true })
  .then(() => models.Project.create({ id: nextSeq() }))
  .then(project => sequelize.transaction(tx => Promise.all([
    models.Task.create({ id: nextSeq(), projectId: project.id }, { transaction: tx }),
    models.Task.create({ id: nextSeq(), projectId: project.id }, { transaction: tx }),
    models.Task.create({ id: nextSeq(), projectId: project.id }, { transaction: tx }),
  ])))
  .then(() => models.Project.findAll({ include: [{ model: models.Task }] }))
  .then(p => logger.debug('projects: %j', p))
  .catch(e => logger.error('Error: %j', e));

//   .then(() => sequelize.transaction((tx) => {
//     const project = models.Project.create({ id: 1 }, { transaction: tx });
//     const task = models.Task.create({ id: 1 }, { transaction: tx });
//     const association = task.setProject(project, { transaction: tx });
//     return Promise.all([project, task, association]);
//   }))
//   .then(() => models.Project.findAll({ include: [{ model: models.Task }] }))
//   .then(p => logger.debug('projects: %j', p));

export default models;
