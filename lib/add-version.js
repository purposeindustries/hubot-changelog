module.exports = addVersion;

function addVersion(txt){
  var name = txt || '';
  if (name[0] === 'v') {
    return name;
  }
  return 'v' + name;
}
