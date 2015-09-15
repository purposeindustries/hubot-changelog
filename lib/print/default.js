var format = require('util').format;
var ago = require('damals');

exports.zero = zero;
exports.error = error;
exports.single = single;
exports.help = help;
exports.range = range;
function error(err, opts) {
  return format('Error occured:( (%s)', err.toString());
}

function zero(options) {
  return format(
    'There isnt any releases in %s/%s',
    options.user,
    options.repo);
}

function single(rls, options) {
  return format('The latest release is %s in %s/%s, it was released %s\n%s', rls.tag_name, options.user, options.repo, ago(new Date(rls.created_at)), rls.body);
}

function range(releases, options) {
  return releases.map(function(rls) {
    return format(
      '%s in %s/%s was released %s\n%s\n',
      rls.tag_name,
      options.user,
      options.repo,
      ago(new Date(rls.created_at)),
      rls.body
    );
  }).join('\n');
}

function help() {
  return [
    'This plugin will list the release notes of releases',
    '- hubot changelog: shows the release note of the latest release in default user\'s default repo',
    '- hubot ch: shortcut for hubot changelog, you can use it everywhere',
    '- hubot changelog in jquery: shows the release note of latest release in default user\'s jquery repo',
    '- hubot changelog in johnsmith/jquery: shows the release notes of the latest release in user named johnsmith\'s jquery repository',
    '- hubot changelog v2.3.4: shows the release note of release v2.3.4 in default user\'s default repo (you can use 2.3.4 and v2.3.4 as well)',
    '- hubot changelog 2.3.4 in jquery: shows the release note of release v2.3.4 in default user\'s jquery repo',
    '- hubot changelog v2.3.4 in johnsmith/jquery: shows the release note of release v2.3.4 in johnsmith\'s jquery repo',
    '- hubot changelog v2.3.4...v2.3.9: shows the release notes between v2.3.4 and v2.3.9 using semver (>=2.3.4 <=2.3.9) in default user\'s default repo',
    '- hubot changelog v2.3.4...v2.3.9 in jquery: shows the release notes between v2.3.4 and v2.3.9 using semver (>=2.3.4 <=2.3.9) in default user\'s jquery repo',
    '- hubot changelog v2.3.4...v2.3.9 in johnsmith/jquery: shows the release notes between v2.3.4 and v2.3.9 using semver (>=2.3.4 <=2.3.9) in johnsmith\'s jquery repo',
    '- hubot changelog on yesterday: shows the release notes for release which were released yesterday in default user\'s default repo, you can use relative date (today, last wednesday) or exact date: 2015-09-15 or 2015.09.15',
    '- hubot changelog on yesterday in jquery: shows the release notes for release which were released yesterday in default user\'s jquery repo',
    '- hubot changelog on yesterday in johnsmith/jquery: shows the release notes for release which were released yesterday in johnsmith\'s jquery repo',
    '- hubot changelog since yesterday: shows the release notes for release which were released since yesterday in default user\'s default repo, you can use relative date (today, last wednesday) or exact date: 2015-09-15 or 2015.09.15',
    '- hubot changelog since yesterday in jquery: shows the release notes for release which were released since yesterday in default user\'s jquery repo',
    '- hubot changelog since yesterday in johnsmith/jquery: shows the release notes for release which were released since yesterday in johnsmith\'s jquery repo',
  ].join('\n');
}
