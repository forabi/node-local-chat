const Sequelize = require('sequelize');
const { UUID, DATE, ENUM, STRING, BLOB } = require('sequelize/lib/data-types');

const db = new Sequelize('localchat', null, null, {
  dialect: 'sqlite',
});

const User = db.define('user', {
  name: STRING(50),
  status: STRING(200),
  picture: BLOB,
});

const Group = db.define('group', {
  name: STRING(50),
  createdBy: UUID.v4,
  picture: BLOB,
});

Group.hasMany(User, { foreignKey: 'createdBy' });

const Destination = db.define('destination', {
  id: {
    type: UUID.v4,
    primaryKey: true,
  },
  type: ENUM('group', 'user'),
});

const Message = db.define('message', {
  id: {
    type: UUID.v4,
    primaryKey: true,
  },
  status: ENUM('sent', 'delivered', 'read'),
  from: UUID.v4,
  to: UUID.v4,
  toGroup: UUID.v4,
  type: ENUM('text', 'image', 'video', 'audio', 'document', 'link'),
  text: STRING,
  blob: BLOB,
  dateSent: DATE,
  dateReceived: DATE,
  dateRead: DATE,
});

Message.belongsTo(User, { foreignKey: 'from' });
Message.belongsTo(Destination, { foreignKey: 'to' });

module.export = db;

