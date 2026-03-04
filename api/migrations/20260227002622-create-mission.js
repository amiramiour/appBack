'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('missions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      employerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      niveau: {
        type: Sequelize.STRING,
      },

      location: {
        type: Sequelize.STRING,
      },

      startDate: {
        type: Sequelize.DATE,
      },

      durationHours: {
        type: Sequelize.STRING,
      },

      remuneration: {
        type: Sequelize.DECIMAL,
      },

      conditions: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      status: {
        type: Sequelize.ENUM('active', 'expiree', 'archivee'),
        defaultValue: 'active',
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
    await queryInterface.dropTable('missions');
  },
};