export default {
  Query: {
    tasks: (parent, args, { models }) => models.Task.findAll(),

    task: (parent, { id }, { models }) => models.Task.findById(id),
  },
  Task: {
    project: async (task, args, { models }) => models.Project.findById(task.projectId),
  },

  Mutation: {},
};
