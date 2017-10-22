# native-css

> Convert pure CSS to javascript literal objects or React Style.

[![NPM Version](https://img.shields.io/npm/v/express.svg?style=flat)](https://www.npmjs.org/package/native-css)
[![Build Status](https://travis-ci.org/raphamorim/native-css.svg?branch=master)](https://travis-ci.org/raphamorim/native-css)

## Before Anything!

This tool believes in this semantic for CSS: [HTML semantics and front-end architecture](http://nicolasgallagher.com/about-html-semantics-front-end-architecture/)

'Cause of this, all ids and inheritance relationships are converted to classes.

## Install

Verify if you have [node](http://nodejs.org/) and [npm](https://www.npmjs.org/) installed.

##### As CLI 

```sh
$ npm install -g native-css
```

##### As Node Module 

```sh
$ npm install native-css
```

## CLI Usage

**Params:** input (required), output (optional)

```sh
$ native-css <input> <output>
```

### Example

Input CSS Example:

```css
.taxi {
  background-color: #F8F8F8;
  color: #999;
}

#car {
  color: blue;
}
```

#### Convert CSS to React Format

Using:

```sh
$ native-css <input> <output> --react
```

Generate this as output (JS format):

```javascript
var styles = StyleSheet.create({
  taxi: {
    color: '#999',
    backgroundColor: '#F8F8F8'
  },
  car: {
	color: 'blue';
  }
});
```

#### Convert CSS to Literal JS object

Using, but **without** react flag:

```sh
$ native-css <input> <output>
```

Generate this as output (JS format):

```javascript
styles: {
  taxi: {
    color: '#999',
    backgroundColor: '#F8F8F8'
  },
  car: {
	color: 'blue';
  }
}
```

#### Inherent and Parents

As stated, this tool believes and follows a specific semantic for CSS. Therefore in these cases, exists a change in nomenclature. Example:

Input File (style.css)

```css
.any.element {
  color: red;
}

.parent .child {
  color: orange;
}

.parent  .child2 {
  color: blue;
}
```

Output File (style.js)

```javascript
any_element: { 
  color: 'red' 
},
parent__child: { 
  color: 'orange' 
},
parent__child2: { 
  color: 'blue' 
}
```

#### Media Queries

Input File (style.css): 

```css
@media screen and (min-width: 1020px){
  body .container { 
    width: 1020px !important
  }
}

@media (min-width: 768px){
  body .container {
    width: 748px !important;
    box-sizing: 'all'
  }
}
```

Output File (style.js):

```javascript
'@media screen and (min-width:1020px)': { 
  __expression__: 'screen and (min-width:1020px)',
  body__container: { 
    width: '1020px !important' 
  } 
},
'@media (min-width:768px)': { 
  __expression__: '(min-width:768px)',
  body__container: { 
    width: '748px !important',
    boxSizing: 'all'
  } 
}
```



## Module Usage
__supported input types:__ Path, Url, String, Buffer
```javascript
var nativeCSS = require('native-css'),
	pathToCssFile = 'somePath/file.css';

// Generate JavaScript Object
var cssObject = nativeCSS.convert(pathToCssFile);
```

__url support with async version:__
```javascript
var nativeCSS = require('native-css'),
  URL = 'http://raw.githubusercontent.com/raphamorim/native-css/master/test/fixtures/sample.css';

// Generate JavaScript Object
nativeCSS.convertAsync(URL || Path) // returns Promise
  .then(function(result) {
    // convert/validate data
    // return or throw
  })
  .catch(function(err){
    handleError(err);
  })
  .finally(function(cssObject) {
    handleValue(cssObject);
  });
```
### webpack usage:  
[cssobjects-loader](https://www.npmjs.com/package/cssobjects-loader)

## Not supported CSS features

React Style does not support CSS selectors, pseudo-classes and CSS animation. Mostly because we try to avoid implicit behaviour and want the user to make layout decisions inside the render() function.

CSS selectors introduce implicit behaviour by not having a direct link with the elements on which they're applied. Therefore there is no way of knowing what the consequences are, and this easily leads to refactoring issues. Instead you should be using plain JavaScript variables.

Classes with pseudo-classes have a higher precedence then classes with no pseudo-classes, which results in issues if you want to override styling in "higher-level" components. In some cases(:before, after, etc.) a component is easily added, in others (active, focus, hover, etc) plain JavaScript will do the trick. In all, you don't need CSS for this. In some cases though you might want to use pseudo-classes (like styling a scrollbar) - which we do support.

Animations inside CSS also introduce implicit behaviour, as CSS animations are decoupled from logic. By being decoupled, the state of the component is split between the component and the CSS animation. We however believe state should be contained within a component. An example of solving this using JS is [React Magician](https://github.com/SanderSpies/react-magician).

## Contributing

Don't be shy, send a Pull Request! Here is how:

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## About

**License:** MIT ® [Raphael Amorim](https://github.com/raphamorim)
