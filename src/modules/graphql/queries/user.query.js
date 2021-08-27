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
const UserQuery = {
  userById: UserTC.getResolver('findById'),
  userByIds: UserTC.getResolver('findByIds'),
  userOne: UserTC.getResolver('findOne'),
  userMany: UserTC.getResolver('findMany'),
  userCount: UserTC.getResolver('count'),
  userConnection: UserTC.getResolver('connection'),
  userPagination: UserTC.getResolver('pagination'),

};

module.exports = { UserQuery };
