const { UserTC } = require('../../user/user.model');

const UserMutation = {
  userCreateOne: UserTC.getResolver('createOne'),
  userUpdateById: UserTC.getResolver('updateById'),
  userUpdateOne: UserTC.getResolver('updateOne'),
  userRemoveById: UserTC.getResolver('removeById'),
  userRemoveOne: UserTC.getResolver('removeOne'),
};

module.exports = { UserMutation };
