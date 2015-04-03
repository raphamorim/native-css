# native-css

> Convert pure CSS to react native style object.

[![NPM Version](https://img.shields.io/npm/v/express.svg?style=flat)](https://www.npmjs.org/package/native-css)
[![Build Status](https://api.travis-ci.org/raphamorim/native-cssm.svg)](https://travis-ci.org/raphamorim/native-css)

## Install

With [node](http://nodejs.org/) and [npm](https://www.npmjs.org/) installed, install ranza with a single command:

```sh
$ npm install -g native-css
```

## Usage

**Params:** input (required), output (optional)

```sh
$ native-css <input> <output>
```

## Output Example

Input CSS:

```css
.taxi {
	backgroundColor: #F8F8F8;
	color: #999;
}

#car {
	color: blue;
}
```

Output (JS format):

```javascript
var styles = StyleSheet.create({
  taxi: {
    color: '#999',
    backgroundColor: '#F8F8F8'
  },
  car {
	color: 'blue';
  }
});
```

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
