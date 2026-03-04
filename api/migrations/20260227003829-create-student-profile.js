'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('student_profiles', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      localisation: {
        type: Sequelize.STRING,
      },

      langues_parlees: {
        type: Sequelize.STRING,
      },

      missions_recherchees: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      nationalites: {
        type: Sequelize.STRING,
      },

      competences: {
        type: Sequelize.TEXT,
      },

      disponibilites: {
        type: Sequelize.TEXT,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('student_profiles');
  },
};