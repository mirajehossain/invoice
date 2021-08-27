const { UserTC } = require('../../user/user.model');

UserTC.addRelation(
  'friends',
  {
    resolver: () => UserTC.getResolver('findByIds'),
    prepareArgs: { // resolver `findByIds` has `_ids` arg, let provide value to it
      _ids: source => source.friendsIds,
    },
    projection: { friendsIds: 1 }, // point fields in source object, which should be fetched from DB
  },
);
const UserMutation = {
  userCreateOne: UserTC.getResolver('createOne'),
  userCreateMany: UserTC.getResolver('createMany'),
  userUpdateById: UserTC.getResolver('updateById'),
  userUpdateOne: UserTC.getResolver('updateOne'),
  userUpdateMany: UserTC.getResolver('updateMany'),
  userRemoveById: UserTC.getResolver('removeById'),
  userRemoveOne: UserTC.getResolver('removeOne'),
  userRemoveMany: UserTC.getResolver('removeMany'),
  friends: UserTC.addRelation(
    'friends',
    {
      resolver: () => UserTC.getResolver('findByIds'),
      prepareArgs: { // resolver `findByIds` has `_ids` arg, let provide value to it
        _ids: source => source.friendsIds,
      },
      projection: { friendsIds: 1 },
      // point fields in source object, which should be fetched from DB
    },
  ),
};

module.exports = { UserMutation };
