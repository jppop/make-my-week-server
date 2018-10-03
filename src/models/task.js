const task = (sequelize, DataTypes) => {
  const Task = sequelize.define('task', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
  });

  Task.associate = (models) => {
    Task.belongsTo(models.Project);
  };

  return Task;
};

export default task;
