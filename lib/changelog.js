var async = require('async');
var semver = require('semver');
var parseLink = require('parse-link-header');
var request = require('request').defaults({
  headers: {
    'User-Agent': 'hubot-changelog module'
  },
  json: true
});
var format = require('util').format;

function changelog(opts, cb) {
  if ((opts.base && opts.head) || (opts.compare && opts.date)){
    return range(opts, cb);
  }
  get(opts, cb);
}
function get(opts, cb) {
  var url;
  if (opts.base === 'latest') {
    url = format(
      'https://api.github.com/repos/%s/%s/releases/latest', opts.user,
      opts.repo
    );
  } else if (opts.base[0] === 'v') {
    url = format(
      'https://api.github.com/repos/%s/%s/releases/tags/%s', opts.user,
      opts.repo,
      opts.base
    );
  }

  request({
    url: url,
    qs: {
      access_token: opts.token
    }
  }, function(err, res, body) {
    if (err) {
      return cb(err);
    }
    if (res.statusCode > 399) {
      return cb(new Error(body.message || ('Unknown github response, status: ' + res.statusCode)));
    }
    cb(null, body);
  });
}
function range(opts, done) {
  if (opts.base && opts.head) {
    opts.comparer = function(release) {
      var cmp = '>=' + opts.base + ' <=' + opts.head;
      return semver.satisfies(release.tag_name, cmp);
    };
  } else if (opts.date && ~['on', 'since'].indexOf(opts.compare)) {
    opts.comparer = function(release) {
      var rlsDate = new Date(release.created_at);
      if (opts.compare === 'on') {
        return opts.date.toDateString() === rlsDate.toDateString();
      }
      return rlsDate > opts.date;
    };

  } else {
    return done(new Error('Unkown query'));
  }
  _range(opts, done);
}

function _range(opts, done) {
  var nextPage = 0;
  var matchedVersions = [];
  var stillMatching = true;
  async.doWhilst(function(cb) {
    var url;
    url = format('https://api.github.com/repos/%s/%s/releases', opts.user, opts.repo);
    request({
      url: url,
      qs: {
        access_token: opts.token,
        page: nextPage,
        per_page: 100
      }
    }, function(err, res, body) {
      if (err) {
        return cb(err);
      }
      if (res.statusCode > 399) {
        return cb(new Error(body.message || ('Unknown github response, status: ' + res.statusCode)));
      }

      var links, releases, _ref;

      links = parseLink(res.headers.link);
      if (links && links.next) {
        nextPage = links.next.page;
      } else {
        nextPage = null;
      }

      body.forEach(function(release) {
        stillMatching = opts.comparer(release);
        if (stillMatching) {
          return matchedVersions.push(release);
        }
      });
      return cb();
    });
  }, function() {
    if (nextPage === null) {
      return false;
    }
    if (stillMatching === false && matchedVersions.length !== 0) {
      return false;
    }
    return true;
  }, function(err) {
    if (err) {
      done(err);
      return;
    }
    done(null, matchedVersions);
  });
}

module.exports = changelog;
