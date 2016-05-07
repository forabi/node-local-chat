import Sequelize from 'sequelize';
import { UUID, DATE, ENUM, STRING, BLOB } from 'sequelize/lib/data-types';

const db = new Sequelize('localchat', null, null, {
  dialect: 'sqlite',
  log: () => null,
});

const User = db.define('user', {
  name: STRING(50),
  status: STRING(200),
  picture: BLOB,
});

const Token = db.define('token');
User.hasMany(Token);

const Group = db.define('group', {
  name: STRING(50),
  createdBy: UUID,
  picture: BLOB,
});

Group.hasMany(User);
Group.belongsTo(User, { foreignKey: 'createdBy' });

const UndeliveredMessage = db.define('undeliveredMessage', {
  id: {
    type: UUID,
    primaryKey: true,
  },
  status: ENUM('sent', 'delivered', 'read'),
  from: UUID,
  to: UUID,
  type: ENUM('text', 'image', 'video', 'audio', 'document', 'link'),
  text: STRING,
  blob: BLOB,
  dateSent: DATE,
  dateReceived: DATE,
  dateRead: DATE,
});

UndeliveredMessage.belongsTo(User, { foreignKey: 'from' });
UndeliveredMessage.belongsTo(User, { foreignKey: 'to' });

export { UndeliveredMessage, User, Group, Token };
export default db;
