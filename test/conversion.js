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
					assert.equal('a' in result, true);
					assert.equal('b' in result, true);
					assert.equal('c' in result, true);

					done();
				});
			});
			context('Valid CSS ( Classes and Ids )', function() {
				it('should get a object without any error', function(done) {
					var fixture = 'test/fixtures/sampleWithId.css',
						result = nativeCSS.convert(fixture);

					assert.equal(typeof result, 'object');
					assert.equal('a' in result, true);
					assert.equal('b' in result, true);
					assert.equal('c' in result, true);
					assert.equal('taxi' in result, true);
					assert.equal('car' in result, true);

					done();
				});
			});
		});
	});
});
