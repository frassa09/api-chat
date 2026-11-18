import { Message } from "./Message.model.js";
import { Session } from "./Session.model.js";
import { User } from "./User.model.js";



Session.hasMany(Message, {foreignKey: 'sessionId'})
Message.belongsTo(Session, {foreignKey: 'sessionId'})

User.hasMany(Session, {foreignKey: 'userId'})
Session.belongsTo(User, {foreignKey: 'userId'})

