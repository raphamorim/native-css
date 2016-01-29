var assert 		= require('assert'),
	nativeCSS 	= require('../src/native-css.js');

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
			context('Valid CSS Inherent', function() {
				it('should get a object without any error', function(done) {
					var fixture = 'test/fixtures/sampleWithInherent.css',
						result = nativeCSS.convert(fixture);

					assert.equal(typeof result, 'object');
					assert.deepEqual(result['a'], {"background": "#111", "color": "#000"});
					assert.deepEqual(result['b'], {"background":"#222","color":"#111"});
					assert.deepEqual(result['c'], {"color":"#000"});
					assert.deepEqual(result['any_element'], {"color":"red"});
					assert.deepEqual(result['parent__child'], {"color":"blue"});
					assert.deepEqual(result['parent__child2'], {"color":"blue"});
					assert.deepEqual(result['cat_blue'], {"color":"blue"});

					done();
				});
			});
			context('Valid CSS with Media Queries properties', function() {
				it('should get a object without any error', function(done) {
					var fixture = 'test/fixtures/sampleWithMediaQueries.css',
						result = nativeCSS.convert(fixture),
						mediaFor1020 = result['@media screen and (min-width: 1020px)'],
						mediaFor768 = result['@media (min-width: 768px)'],
						mediaForPrint = result['@media print'];

					assert.equal(typeof result, 'object');
					assert.deepEqual(result['a'], {"background": "#111", "color": "#000"});
					assert.deepEqual(result['b'], {"background":"#222","color":"#111"});

					// Media 1020
					assert.deepEqual(typeof mediaFor1020, 'object');
					assert.deepEqual(mediaFor1020['__expression__'], 'screen and (min-width: 1020px)');
					assert.deepEqual(mediaFor1020['body__container'], { width: '1020px !important' });

					// Media 768
					assert.deepEqual(typeof mediaFor768, 'object');
					assert.deepEqual(mediaFor768['__expression__'], '(min-width: 768px)');
					assert.deepEqual(mediaFor768['body__container'], { width: '748px !important' });

					// Media Print
					assert.deepEqual(typeof mediaForPrint, 'object');
					assert.deepEqual(mediaForPrint['__expression__'], 'print');
					assert.deepEqual(mediaForPrint['body__container'], { width: '748px !important' });

					done();
				});
			});
			context('Valid CSS with a repeated media query', function() {
				it('should get a object with the values set in all settings', function(done) {
					var fixture = 'test/fixtures/sampleWithMediaQueryDuplicated.css',
						result = nativeCSS.convert(fixture),
						mediaQuery = result['@media (min-width: 768px)'];

					assert.equal(typeof result, 'object');
					assert.deepEqual(result['a'], {"background": "#111", "color": "#000"});
					assert.deepEqual(result['b'], {"background":"#222","color":"#111"});

					assert.deepEqual(typeof mediaQuery, 'object');
					assert.deepEqual(mediaQuery['__expression__'], '(min-width: 768px)');
					assert.deepEqual(mediaQuery['nav'], { width: '200px !important' });
					assert.deepEqual(mediaQuery['section'], { width: '768px !important' });
					assert.deepEqual(mediaQuery['footer'], { width: '768px !important' });

					done();
				});
			});
		});
	});
});
