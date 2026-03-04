'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('documents', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      missionId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'missions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      docType: {
        type: Sequelize.ENUM(
          'photo_identite',
          'titre_sejour',
          'certificat_scolarite',
          'diplome',
          'rib',
          'justificatif_domicile',
          'charte_engagement',
          'autre'
        ),
        allowNull: false,
      },

      fileUrl: {
        type: Sequelize.STRING,
      },

      kycStatus: {
        type: Sequelize.ENUM(
          'CREATED',
          'VALIDATION_ASKED',
          'VALIDATED',
          'REFUSED'
        ),
        defaultValue: 'CREATED',
      },

      statusComment: {
        type: Sequelize.TEXT,
      },

      isGeneral: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      sentAt: {
        type: Sequelize.DATE,
      },

      reviewStartedAt: {
        type: Sequelize.DATE,
      },

      decisionAt: {
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
    await queryInterface.dropTable('documents');
  },
};