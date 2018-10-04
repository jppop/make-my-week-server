const task = (sequelize, DataTypes) => {
  const Task = sequelize.define('task', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    planned: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    completed: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    projectId: {
      type: DataTypes.UUID,
      references: {
        model: 'projects',
        key: 'id',
      },
    },
  });

  Task.associate = (models) => {
    Task.belongsTo(models.Project, { foreignKey: 'projectId', targetKey: 'id' });
  };

  return Task;
};

export default task;
