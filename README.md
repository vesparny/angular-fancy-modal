# [angular-fancy-modal](http://vesparny.github.io/angular-fancy-modal)

**The definitive modal/popup/dialog solution for AngularJS.**
Modal dialogs and popups for [Angular.js](http://angularjs.org/) (>=1.2.x) applications.
Mobile friendly out of the box.

[![Build Status](https://secure.travis-ci.org/vesparny/angular-fancy-modal.svg)](http://travis-ci.org/vesparny/angular-fancy-modal)

**Brought to you by [Alessandro Arnodo](http://alessandro.arnodo.net) [[@vesparny](https://twitter.com/vesparny)]**

#### See a [working demo with examples on usage](http://vesparny.github.io/angular-fancy-modal/).

## Install

via bower:

```
bower install angular-fancy-modal --save
```

or clone this repository for using the unstable version.

## Usage

You need only to include `angular-fancy-modal.js` and  `angular-fancy-modal.css` to your project and then you can start using it:

```javascript
var app = angular.module('exampleApp', ['vesparny.fancyModal']);

app.controller('MyCtrl', function ($scope, $fancyModal) {
	$scope.open = function () {
		$fancyModal.open({ templateUrl: 'popupTmpl.html' });
	};
});
```

## API

`$fancyModal` service provides easy to use and minimalistic API, but in the same time it's powerful enough. Here is the list of accessible methods that you can use:

===

### `.open(options)`

Method allows to open modal dialog. It accepts `options` object as the only argument.

### Options:

`$modal` is a service to quickly create AngularJS-powered modal windows. Creating custom modals is straightforward: create a partial view, its controller and reference them when using the service.

The `$modal` service has only one method: open(options) where available options are like follows:

* `templateUrl` - a path to a template representing modal's content
* `template` - inline template representing the modal's content
* `scope` - a scope instance to be used for the modal's content (actually the $modal service is going to create a child scope of a provided scope). Defaults to $rootScope
* `controller` - a controller for a modal instance - it can initialize scope used by modal. Accepts the "controller-as" syntax in the form 'SomeCtrl as myctrl';Every controller will have a `$modal` object instance in its scope, useful for closing the dialog.
* `resolve` - members that will be resolved and passed to the controller as locals; it is equivalent of the resolve property for AngularJS routes
* `showCloseButton` - dispay or not the close button (default true)
* `closeOnEscape` - close dialog by pressing escape key (default true)
* `closeOnOverlayClick` - close dialog by clicking on the overlay  (default true)
* `overlay` - display overlay  (default true)
* `themeClass` - theme css class name to add to modal window
* `bodyClass` - css class to add to body
* `openingClass` - css class to add to modal content while opening
* `closingClass` - css class to add to modal content while closing
* `openingOverlayClass` - css class to add to modal overlay while opening
* `closingOverlayClass` - css class to add to modal overlay while closing

===

### `.close()`

Calling the `.close` method on an instance returned by the `.open` method will close the relative modal, calling the method on the `$fancyModal` service will close every opened modal.

===

### `.setDefaults(options)`

You're able to set default settings through `$fancyModalProvider`:

```javascript
var app = angular.module('myApp', ['vesparny.fancyModal']);
app.config(['$fancyModalProvider', function ($fancyModalProvider) {
	$fancyModalProvider.setDefaults({
		themeClass: 'fancy-modal-theme-default'
	});
}]);
```

### Returns:

The `open()` method returns an object with some useful properties.

##### ``id {String}``

This is the DOM ID of the modal which was just created.

##### `close {Function}`

This is a function which will close the modal opened before.

##### `opened {Promise}`

A promise which will resolve when the modal is fully loaded.

Example:

```javascript
var modal = $fancyModal.open({
  templateUrl: 'template.html',
});
modal.opened.then(function() {
  modal.close();
});
```
===

## Directive

By default $fancyModal module is served with `fancy-modal` directive which can be used as attribute for buttons, links, etc. All `.open()` options are available through attributes.

Example:

```html
<button type="button"
	template-url="template.html">
	Open dialog
</button>
```
## Events

Everytime when $fancyModal is opened or closed we're broadcasting three events (dispatching events downwards to all child scopes):

- `$fancyModal.opened`

- `$fancyModal.closed`

Example:

```javascript
$rootScope.$on('$fancyModal.opened', function (e, $modal) {
	console.log('$fancyModal opened: ' + $modal.attr('id'));
});

$rootScope.$on('$fancyModal.closed', function (e, id) {
	console.log('$fancyModal closed: ' + id);
});
```

## Themes

The project contains one theme that show how easily you can create your own. Check `example` folder for demonstration purposes.

## References

Inspired by awesome [Hubspot/Vex](https://github.com/HubSpot/vex) jQuery modals and [ngDialog](https://github.com/likeastore/ngDialog)

## Test

clone this repository then

```
npm install
npm install -g gulp
bower install
gulp test
```

### Contributing

PR and issues reporting are always welcome :)
see also CONTRIBUTING.md file.

### License

See LICENSE.md file

### Changelog

See CHANGELOG.md file
