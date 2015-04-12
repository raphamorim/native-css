var assert = require('assert'),
	nativeCSS = require('../index.js');

describe('Conversion', function() {
	context('CSS -> React Style', function() {
		context('Input not found', function() {
			it('should get a error', function(done) {
				var result = nativeCSS.convert();

				assert.equal(typeof result, 'string');
				assert.equal(result, 'Ooops!\nError: CSS file not found!');

				done();
			});
		});
		context('Valid input', function() {
			context('Valid CSS ( Only classes )', function() {
				it('should get a object without any error', function(done) {
					var fixture = 'test/fixtures/sample.css',
						result = nativeCSS.convert(fixture);

					assert.equal(typeof result, 'object');
					assert.deepEqual(result['a'], {"background": "#111", "color": "#000"});
					assert.deepEqual(result['b'], {"background":"#222","color":"#111"});
					assert.deepEqual(result['c'], {"color":"#000"});

					done();
				});
			});
			context('Valid CSS ( Classes and Ids )', function() {
				it('should get a object without any error', function(done) {
					var fixture = 'test/fixtures/sampleWithId.css',
						result = nativeCSS.convert(fixture);

					assert.equal(typeof result, 'object');
					assert.deepEqual(result['a'], {"background": "#111", "color": "#000"});
					assert.deepEqual(result['b'], {"background":"#222","color":"#111"});
					assert.deepEqual(result['c'], {"color":"#000"});
					assert.deepEqual(result['taxi'], {"color":"#000"});
					assert.deepEqual(result['car'], {"color":"blue"});

					done();
				});
			});
		});
	});
});
