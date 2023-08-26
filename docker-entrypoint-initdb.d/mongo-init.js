db = db.getSiblingDB('nestTgGpt');
db.createUser({
  user: 'nestUser',
  pwd: 'nestPassword',
  roles: [{ role: 'readWrite', db: 'nestTgGpt' }],
});
