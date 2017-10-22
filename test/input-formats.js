var assert = require('assert'),
  nativeCSS = require('../index.js'),
  lib = require('../lib/index');

describe('Input Formats', function() {
  context('Accept String', function() {
    it('should get a object without any error', function(done) {
      var filename = 'test/fixtures/sample.css',
        string = lib.readFile(filename),
        result = nativeCSS.convert(string);
      assert.equal(typeof result, 'object');
      assert.deepEqual(result['a'], {
        "backgroundColor": "#111",
        "color": "#000"
      });
      assert.deepEqual(result['b'], {
        "background": "#222",
        "color": "#111",
        "fontSize": "15px"
      });
      assert.deepEqual(result['c'], {
        "color": "#000"
      });

      done();
    });
  });

  context('Accept Buffer', function() {
    it('should get a object without any error', function(done) {
      var filename = 'test/fixtures/sample.css',
        string = lib.readFile(filename),
        buffer = new Buffer(string),
        result = nativeCSS.convert(buffer);
      assert.equal(typeof result, 'object');
      assert.deepEqual(result['a'], {
        "backgroundColor": "#111",
        "color": "#000"
      });
      assert.deepEqual(result['b'], {
        "background": "#222",
        "color": "#111",
        "fontSize": "15px"
      });
      assert.deepEqual(result['c'], {
        "color": "#000"
      });

      done();
    });
  });
  context('Accept Path', function() {
    it('should get a object without any error', function(done) {
      var fixture = 'test/fixtures/sample.css',
        result = nativeCSS.convert(fixture);

      assert.equal(typeof result, 'object');
      assert.deepEqual(result['a'], {
        "backgroundColor": "#111",
        "color": "#000"
      });
      assert.deepEqual(result['b'], {
        "background": "#222",
        "color": "#111",
        "fontSize": "15px"
      });
      assert.deepEqual(result['c'], {
        "color": "#000"
      });

      done();
    });
  });
  context('Accept URL ( async )', function() {
    it('should get a object without any error', function(done, error) {
      // TODO: mock this reponse
      nativeCSS.convertAsync('http://raw.githubusercontent.com/raphamorim/native-css/master/test/fixtures/sample.css')
        .then(function(result) {
          assert.equal(typeof result, 'object');
          assert.deepEqual(result['a'], {
            "backgroundColor": "#111",
            "color": "#000"
          });
          assert.deepEqual(result['b'], {
            "background": "#222",
            "color": "#111",
            "fontSize": "15px"
          });
          assert.deepEqual(result['c'], {
            "color": "#000"
          });

          done();
        })
        .catch(function(err) {
          assert.deepEqual(err, null);
          done();
        })
    });
  });
});
