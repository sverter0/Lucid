[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/One-Nexus/Lucid/blob/master/LICENSE)
[![Build Status](https://travis-ci.com/One-Nexus/Lucid.svg?branch=master)](https://travis-ci.com/One-Nexus/Lucid)
[![npm version](https://badge.fury.io/js/%40onenexus%2Flucid.svg)](https://www.npmjs.com/package/@onenexus/lucid)
[![npm downloads](https://img.shields.io/npm/dm/@onenexus/lucid.svg)](https://www.npmjs.com/package/@onenexus/lucid)

> No nonsense JavaScript styling for React DOM projects

<img height="66px" src="http://www.onenexus.io/lucid/images/lucid-logo.png?v=1" /><br>

* [Overview](#overview)
* [Installation/Setup](#installationsetup)
* [API](#api)

## Overview

Lucid is a CSS-in-JS solution for React DOM projects. It is a collection of React components that should be used to construct your JSX. Lucid uses *state* and *context* to determine which styles to apply to a given component; it maps keys from your styles object to components with a matching `name` prop, avoiding the need for class names. Checkout this example to see how Lucid can be used to create a simple UI accordion:

```jsx
import React, { useState } from 'react';
import { Module, Component } from '@onenexus/lucid';

const styles = () => ({
  heading: ({ context, state }) => ({
    backgroundColor: 'red',
    
    ...(context.panel.isOpen && {
      backgroundColor: 'blue'
    }),
    
    ':hover': {
      backgroundColor: 'purple'
    }),

    // ...or alternatively:
    ...(state.isHovered && {
      backgroundColor: 'purple'
    })
  }),

  content: ({ context }) => ({
    display: context.panel.isOpen ? 'block' : 'none'
  })
});

const Accordion = ({ panels }) => (
  <Module styles={styles}>
    {panels.map(({ heading, content }) => {
      const [isOpen, toggle] = useState(false);

      return (
        <Component name='panel' isOpen={isOpen}>
          <Component name='heading' onClick={() => toggle(!isOpen)}>
            {heading}
          </Component>
          <Component name='content'>
            {content}
          </Component>
        </Component>
      );
    })}
  </Module>
);

export default Accordion;
```

### Features

* Most friendly CSS-in-JS API on the market ([fchange my mind](#TODO))
* Built to prioritise Developer Experience (DX)
* It's just JavaScript; no nonsense CSS selectors as object keys etc.
* No CSS classes or `className` props required
* Improve the readability of your source code
* Improve the readability of your production code (Lucid outputs human readable code to the DOM, because why not?)
* Low barrier to entry - if you know React you can easily pick this up
* Based off state and context - not only the most fiendly API but the most flexible
* Inherent flexible nature supports themes, configuration etc without dedicated APIs (though they are provided for DX purposes)
* Automagically identify [cosmetic style properties](#TODO) from [configuration/state/props](#TODO)

### How it Works

* Utilises React's context API under the hood
* Singular styles object (or function that returns an object) passed to `<Module>`
* Styles are mapped to child components by matching keys with `<Component>` `name` props
* Parent props/state is [available as `context`](#TODO), self props/state is [available as `state`](#TODO)
* Simulate CSS *cascading* by [taking advantage of ES6 syntax](#TODO)

## Installation/Setup

```
npm install --save @onenexus/lucid
```

###### Basic

```js
import { Module, Component } from '@onenexus/lucid';
```

###### Complete

```js
import { 
  Module,
  Component,
  SubComponent,
  Group,
  Wrapper
} from '@onenexus/lucid';
```

## API

* [`<Module>`](https://github.com/One-Nexus/Lucid/wiki/Module)
* [`<Component>`](https://github.com/One-Nexus/Lucid/wiki/Component)
* [`<SubComponent>`](https://github.com/One-Nexus/Lucid/wiki/SubComponent)
* [`<Wrapper>`](https://github.com/One-Nexus/Lucid/wiki/Wrapper)
* [`<Group>`](https://github.com/One-Nexus/Lucid/wiki/Group)

---

<a href="https://twitter.com/ESR360">
  <img src="http://edmundreed.com/assets/images/twitter.gif?v=1" width="250px" />
</a>
<a href="https://github.com/ESR360">
  <img src="http://edmundreed.com/assets/images/github.gif?v=1" width="250px" />
</a>
