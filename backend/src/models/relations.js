import { Message } from "./Message.model";
import { Session } from "./Session.model";
import { User } from "./User.model";



Session.hasMany(Message, {foreignKey: 'sessionId'})
Message.belongsTo(Session, {foreignKey: 'sessionId'})

User.hasMany(Session, {foreignKey: 'userId'})
Session.belongsTo(User, {foreignKey: 'userId'})

