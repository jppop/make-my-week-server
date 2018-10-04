const project = (sequelize, DataTypes) => {
  const Project = sequelize.define('project', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Project.associate = (models) => {
    Project.hasMany(models.Task, { as: 'Tasks', onDelete: 'SET NULL' });
    Project.hasMany(models.Work, { as: 'Works', onDelete: 'SET NULL' });
  };

  return Project;
};

export default project;
