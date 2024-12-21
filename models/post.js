'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      // Association with User: A Post belongs to a User
      Post.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      
      // Association for future: Post can have many Comments
      Post.hasMany(models.Comment, { foreignKey: 'post_id', onDelete: 'CASCADE' });
    }
  }
  Post.init(
    {
      id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      caption: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      visibility: {
        type: DataTypes.ENUM('all', 'me'),
        allowNull: false,
        defaultValue: 'all'
      }
    },
    {
      sequelize,
      modelName: 'Post',
    }
  );
  return Post;
};
