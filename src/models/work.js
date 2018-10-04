const work = (sequelize, DataTypes) => {
  const Work = sequelize.define('work', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
    },
    label: {
      type: DataTypes.STRING,
    },
    projectId: {
      type: DataTypes.UUID,
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    taskId: {
      type: DataTypes.UUID,
      references: {
        model: 'tasks',
        key: 'id',
      },
    },
    ownerId: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    lunchTime: {
      type: DataTypes.BOOLEAN,
    },
  });

  Work.associate = (models) => {
    Work.belongsTo(models.Project, { foreignKey: 'projectId', targetKey: 'id' });
    Work.belongsTo(models.Task, { foreignKey: 'taskId', targetKey: 'id' });
    Work.belongsTo(models.User, { foreignKey: 'ownerId', targetKey: 'id' });
  };

  return Work;
};

export default work;
