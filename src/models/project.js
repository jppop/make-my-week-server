const project = (sequelize, DataTypes) => {
  const Project = sequelize.define('project', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
  });

  Project.associate = (models) => {
    Project.hasMany(models.Task, { onDelete: 'CASCADE' });
  };

  return Project;
};

export default project;
