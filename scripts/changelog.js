var changelog = require('../lib/changelog')
var objectAssign = require('object-assign');
var format = require('util').format;
var addVersion = require('../lib/add-version');
var messyTime = require('parse-messy-time');
var print = require('../lib/print/default');
var slack = require('../lib/print/slack');

module.exports = function(robot) {
  var options = objectAssign({}, {
    defaultUser: process.env.HUBOT_CHANGELOG_GITHUB_USER,
    defaultRepo: process.env.HUBOT_CHANGELOG_GITHUB_REPO,
    token: process.env.HUBOT_CHANGELOG_GITHUB_TOKEN,
    slack: process.env.HUBOT_CHANGELOG_SLACK
  }, {/* options */});

  robot.respond(/ch(angelog)? h(elp)?$/i, function(msg) {
    if (options.slack) {
      return robot.emit('slack-attachment', slack.help({
        room: msg.message.room
      }));
    }
    return msg.send(print.help());
  });

  robot.respond(/ch(angelog)?$/i, function(msg) {
    var opts = {
      user: options.defaultUser,
      repo: options.defaultRepo,
      base: 'latest',
      token: options.token
    };
    handler(opts, msg);
  });

  robot.respond(/ch(angelog)? in ([a-zA-Z0-9-_]+\/)?([a-zA-Z0-9-_]+)$/i, function(msg) {
    var user = (msg.match[2] || '').slice(0, -1);
    var repo = msg.match[3];
    var opts = {
      user: user || options.defaultUser,
      repo: repo,
      base: 'latest',
      token: options.token
    };
    handler(opts, msg);
  });

  robot.respond(/ch(angelog)? (v?\d+\.\d+\.\d+)(\.\.)?$/i, function(msg) {
    var opts = {
      user: options.defaultUser,
      repo: options.defaultRepo,
      base: addVersion(msg.match[2]),
      token: options.token
    };
    handler(opts, msg);
  });

  robot.respond(/ch(angelog)? (v?\d+\.\d+\.\d+)(\.\.)? in ([a-zA-Z0-9-_]+\/)?([a-zA-Z0-9-_]+)$/i, function(msg) {
    var user = (msg.match[4] || '').slice(0, -1);
    var repo = msg.match[5];
    var opts = {
      user: user || options.defaultUser,
      repo: repo,
      base: addVersion(msg.match[2]),
      token: options.token
    };
    handler(opts, msg);
  });

  robot.respond(/ch(angelog)? (v?\d+\.\d+\.\d+)((\.\.\.?)|(-))(v?\d+\.\d+\.\d+)$/i, function(msg) {
    var opts = {
      user: options.defaultUser,
      repo: options.defaultRepo,
      base: addVersion(msg.match[2]),
      head: addVersion(msg.match[6]),
      token: options.token
    };
    handler(opts, msg);
  });

  robot.respond(/ch(angelog)? (v?\d+\.\d+\.\d+)((\.\.\.?)|(-))(v?\d+\.\d+\.\d+) in ([a-zA-Z0-9-_]+\/)?([a-zA-Z0-9-_]+)$/i, function(msg) {
    var user = (msg.match[7] || '').slice(0, -1);
    var repo = msg.match[8];
    var opts = {
      user: user || options.defaultUser,
      repo: repo,
      base: addVersion(msg.match[2]),
      head: addVersion(msg.match[6]),
      token: options.token
    };
    handler(opts, msg);
  });

  robot.respond(/ch(angelog)? ((on)|(since)) (.*) in ([a-zA-Z0-9-_]+\/)?([a-zA-Z0-9-_]+)$/i, function(msg) {
    msg.finish();
    var user = (msg.match[6] || '').slice(0, -1);
    var repo = msg.match[7];
    var date = new Date(msg.match[5]);
    if (isNaN(date.getTime())) {
      date = messyTime(msg.match[5]);
    }

    var opts = {
      user: user || options.defaultUser,
      repo: repo,
      date: date,
      compare: msg.match[2],
      token: options.token
    };
    handler(opts, msg);
  });

  robot.respond(/ch(angelog)? ((on)|(since)) (.*)$/i, function(msg) {
    var date = new Date(msg.match[5]);
    if (isNaN(date.getTime())) {
      date = messyTime(msg.match[5]);
    }

    var opts = {
      user: options.defaultUser,
      repo: options.defaultRepo,
      date: date,
      compare: msg.match[2],
      token: options.token
    };
    handler(opts, msg);
  });

  function handler(opts, msg) {
    opts.room = msg.message.room;
    changelog(opts, function(err, changes) {
      if (err) {
        robot.logger.error(err);
        if (options.slack) {
          return robot.emit('slack-attachment', slack.error(err, opts));
        }
        return msg.send(print.error(err, opts));
      }
      if (Array.isArray(changes) && changes.length === 0) {
        if (options.slack) {
          return robot.emit('slack-attachment', slack.zero(opts));
        }
        return msg.send(print.zero(opts));
      }

      if (!Array.isArray(changes)) {
        // single release
        if (options.slack) {
          return robot.emit('slack-attachment', slack.single(changes, opts));
        }
        return msg.send(print.single(changes, opts));
      }

      if (options.slack) {
        return robot.emit('slack-attachment', slack.range(changes, opts));
      }
      msg.send(print.range(changes, opts));
    });
  }
};
