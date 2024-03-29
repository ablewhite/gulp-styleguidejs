var assert = require('assert'),
    chai = require('chai'),
    should = chai.should(),
    fs = require('fs'),
    gutil = require('gulp-util'),
    styleguidejs = require('./index.js');

var FIXTURE = new gutil.File({
  cwd: __dirname,
  base: __dirname + '/fixture',
  path: __dirname + '/fixture/FIXTURE1.css',
  contents: new Buffer('\/***\n  title: Links\n***\/')
});

describe('gulp-styleguide', function() {

  it('should pass file when it isNull()', function(done) {

    var stream = styleguidejs();

    var emptyFile = {
      'isNull': function () {
        return true;
      }
    };

    stream.on('data', function(data) {
      data.should.equal(emptyFile);
      done();
    });
    
    stream.write(emptyFile);
  });

  it('should emit error when file isStream()', function (done) {

    var stream = styleguidejs();

    var streamFile = {
      'isNull': function () {
        return false;
      },
      'isStream': function () {
        return true;
      }
    };

    stream.on('error', function(err) {
      err.message.should.equal('Streaming not supported');
      done();
    });
    
    stream.write(streamFile);
  });

  it('should write styleguide documentation', function(done) {

    var stream = styleguidejs();

    stream.on('data', function(styleguide) {
      assert(/<h3 class="title-small">Links/.test(styleguide.contents.toString()));
      assert.equal(styleguide.path, 'index.html');
    });

    stream.on('end', done);
    stream.write(FIXTURE);
    stream.end();
  });
});
