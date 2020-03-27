Template.registerHelper('higherBytes', (bytes) => {
  const units = [
    'Bytes',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB'
  ];
  let l = 0,
    n = parseInt(bytes, 10) || 0;
  while (n >= 1024) {
    n = n / 1024;
    l++;
  }
  return (parseFloat(n.toFixed(
    n > 0 ?
    1 :
    0)) + ' ' + units[l]);
});


Template.registerHelper('firstCapital', (str) => {
  return str;
});

Template.registerHelper('userIsInRole', function(user, role) {
  let roles,
    comma = (role || '').indexOf(',');
  if (!user)
    return false;
  if (!Match.test(role, String))
    return false;
  if (comma !== -1) {
    roles = _.reduce(role.split(','), function(memo, r) {
      if (!r || !r.trim()) {
        return memo
      }
      memo.push(r.trim())
      return memo
    }, [])
  } else {
    roles = [role]
  }
  return Roles.userIsInRole(user, roles);
});


Template.registerHelper('betterDate', (dt) => {
  return moment(dt).format("ddd MMM Do YYYY");
});
Template.registerHelper('dateTime', (dt) => {
  return moment(dt).format('MMMM Do YYYY, h:mm a');
  //  return moment(dt).format("ddd MMM Do YYYY");
});

Template.registerHelper('betterDateTime', (dt) => {
  return moment(dt).calendar();
});

Template.registerHelper('userEmail', (id) => {
  const user = Meteor.users.findOne({
    _id: id
  });
  return user && user.emails && user.emails[0].address;
});

Template.registerHelper('getCount', function(str) {
  console.log(str, Counts.get(str));
  return Counts.get(str);
});

Template.registerHelper('getCountDiff', function(str1, str2) {
  return Counts.get(str1) - Counts.get(str2);
});

Template.registerHelper('getCountSum', function(str1, str2) {
  return Counts.get(str1) + Counts.get(str2);
});