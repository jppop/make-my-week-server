/* eslint-disable */
import { data } from '../config/fakedata';
import project from '../models/project';

export default {
  up: (queryInterface, Sequelize) => {
    const { users, projects, tasks, works } = data;
    users.forEach(user => {
      const now = new Date();
      user.createdAt = now;
      user.updatedAt = now;
    });
    projects.forEach(project => {
      const now = new Date();
      project.createdAt = now;
      project.updatedAt = now;
    });
    tasks.forEach(project => {
      const now = new Date();
      project.createdAt = now;
      project.updatedAt = now;
    });
    return Promise.all([
      queryInterface.bulkInsert('Users', users, {}),
      queryInterface.bulkInsert('Projects', projects, {}),
    ]).then(() => Promise.all([queryInterface.bulkInsert('Tasks', tasks, {})]));
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('Works', null, {}),
      queryInterface.bulkDelete('Tasks', null, {}),
    ]).then(() =>
      Promise.all([
        queryInterface.bulkDelete('Users', null, {}),
        queryInterface.bulkDelete('Projects', null, {}),
      ]),
    );
  },
};
