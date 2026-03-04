'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('feedbacks', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      nom: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      prenom: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      typeProfil: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      note: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      tags: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      accepteConditions: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.dropTable('feedbacks');
  },
};