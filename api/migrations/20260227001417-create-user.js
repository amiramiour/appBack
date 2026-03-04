'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      role: {
        type: Sequelize.ENUM('student', 'company'),
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      photoUrl: {
        type: Sequelize.STRING,
        defaultValue: 'uploads/default-avatar.png',
      },

      firstName: {
        type: Sequelize.STRING,
      },

      lastName: {
        type: Sequelize.STRING,
      },

      age: {
        type: Sequelize.INTEGER,
      },

      phone: {
        type: Sequelize.STRING,
      },

      training: {
        type: Sequelize.STRING,
      },

      school: {
        type: Sequelize.STRING,
      },

      companyName: {
        type: Sequelize.STRING,
      },

      companyType: {
        type: Sequelize.ENUM('SARL', 'SAS', 'AUTO_ENTREPRENEUR'),
      },

      companyId: {
        type: Sequelize.STRING,
      },

      address: {
        type: Sequelize.STRING,
      },

      resetToken: {
        type: Sequelize.STRING,
      },

      resetTokenExpiry: {
        type: Sequelize.DATE,
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
  await queryInterface.dropTable('users');
}
};