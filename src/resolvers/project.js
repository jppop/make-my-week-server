export default {
  Query: {
    projects: (parent, _, { models }) => models.Project.findAll(),

    project: (parent, { id }, { models }) => models.Project.findById(id),

    projectByName: (parent, { name }, { models }) => models.Project.findOne({
      where: {
        name,
      },
    }),
  },

  Project: {
    tasks: (project, args, { models }) => models.Task.findAll({ where: { projectId: project.id } }),
  },

  Mutation: {},
};
