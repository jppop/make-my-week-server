import { data } from './fakedata';

const createDemoData = async (models) => {
  const { users, projects, tasks } = data;
  return Promise.all([models.User.bulkCreate(users), models.Project.bulkCreate(projects)]).then(
    async () => models.Task.bulkCreate(tasks),
  );
};

export default createDemoData;
