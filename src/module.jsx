import React from 'react';
import getModifiersFromProps from './utilities/getModifiersFromProps';
import { ThemeContext } from './provider';

/** spoof env process to assist bundle size */
if (typeof process === 'undefined') window.process = { env: {} }

/** Used for generating unique module ID's */
let increment = 1;

/** Create a context object */
const ModuleContext = React.createContext({});
export { ModuleContext }

/** Render a Synergy module */
export default class Module extends React.Component {
  constructor(props) {
    super(props);

    this.REF = React.createRef();

    this.state = {
      isHovered: false
    }
  }

  handleMouseEnter(event) {
    this.props.onMouseEnter && this.props.onMouseEnter(event);

    this.setState({
      isHovered: true
    });
  }

  handleMouseLeave(event) {
    this.props.onMouseLeave && this.props.onMouseLeave(event);

    this.setState({
      isHovered: false
    });
  }

  getEventHandlers(properties) {
    let eventHandlers = {};

    for (let prop in properties) {
      if (Object.keys(window).includes(prop.toLowerCase())) {
        if (prop !== 'name') {
          eventHandlers[prop] = properties[prop];
        }
      }
    }

    return eventHandlers;
  }

  getDataAttributes(properties) {
    let dataAttributes = {};

    for (let prop in properties) {
      if (prop.indexOf('data-') === 0) {
        dataAttributes[prop] = properties[prop];
      }
    }

    return dataAttributes;
  }

  getStyles(styles = {}, options) {
    if (typeof styles === 'function') {
      styles = styles(options);
    }
  
    return styles;
  }

  stylesConfig(theme = this.THEME, config = this.CONFIG) {
    const node = this.REF.current;
  
    return {
      theme,
      config,
      state: {
        isFirstChild: node && node === node.parentNode.firstChild,
        isLastChild: node && node === node.parentNode.lastChild,
        previousSibling: node && node.previousSibling,
        nextSibling: node && node.nextSibling,

        ...this.state,
        ...this.props
      },
      context: this.context
    }
  }

  paint(node, styles = {}, options) {
    if (typeof styles === 'function') {
      styles = styles(options);
    }
  
    Object.entries(styles).forEach(([key, value]) => {
      try {
        node.style[key] = value;
      } catch(error) {
        return error;
      }
    });
  }

  /** Lifecycle Methods */

  componentDidMount() {
    if (this.STYLES) {
      this.paint(this.REF.current, this.STYLES, this.stylesConfig());
    }
  }

  componentDidUpdate() {
    if (this.STYLES) {
      this.paint(this.REF.current, this.STYLES, this.stylesConfig());
    }
  }

  render() {
    increment++;
  
    var Synergy = window.Synergy || {};

    const { props } = this;

    /** */
    this.CONFIG = props.config || {};
    this.STYLES = props.styles;
  
    /** */
    const MODIFIERGLUE = props.modifierGlue || Synergy.modifierGlue || '--';
    const COMPONENTGLUE = props.componentGlue || Synergy.componentGlue || '__';
    const ID = props.id || `module-${increment}`;
    const NAMESPACE = this.CONFIG.name || props.name || ID;
    const TAG = (props.href && 'a') || props.component || props.tag || 'div';

    const REST = {
      ...this.getDataAttributes(props),
      ...this.getEventHandlers(props),

      onMouseEnter: this.handleMouseEnter.bind(this),
      onMouseLeave: this.handleMouseLeave.bind(this)
    }

    /** */
    let [CLASSES, MODIFIERS] = [props.className ? props.className + ' ' : '', []];

    MODIFIERS.push(props.modifiers);
    MODIFIERS.push(...getModifiersFromProps(props));
    MODIFIERS = MODIFIERS.filter(Boolean);

    const SELECTOR = NAMESPACE + (MODIFIERS.length && (MODIFIERGLUE + MODIFIERS.join(MODIFIERGLUE)));

    CLASSES += SELECTOR;

    /** */
    return (
      <ThemeContext.Consumer>
        {theme => {
          this.THEME = Module.config(window.theme || {}, theme, props.theme);

          const contextValues = {
            PARENT: this.REF,

            ...this.context,
            ...this.state,
            ...props,

            THEME: this.THEME,
            CONFIG: this.CONFIG,

            MODIFIERGLUE, 
            COMPONENTGLUE,

            [NAMESPACE]: {
              ...this.state,
              ...props
            },

            STYLES: { 
              ...this.context.STYLES, 
              ...this.getStyles(this.STYLES, this.stylesConfig())
            },

            NAMESPACE
          }

          return (
            <ModuleContext.Provider value={contextValues}>
              { props.before && props.before(() => document.getElementById(ID)) }

              <TAG id={ID} className={CLASSES} data-module={NAMESPACE} ref={this.REF} {...REST}>
                {props.content || props.children}
              </TAG>

              { props.after && props.after(() => document.getElementById(ID)) }
            </ModuleContext.Provider>
          );
        }}
      </ThemeContext.Consumer>
    );
  }

  /** Static Methods/Properties */

  static contextType = ModuleContext;

  static config = (...params) => {
    if (process.env.SYNERGY) {
      return Synergy.config({}, ...params);
    } 
    else if (typeof Synergy !== 'undefined' && typeof Synergy.config === 'function') {
      return Synergy.config({}, ...params);
    } 
    else {
      return require('deep-extend')({}, ...params);
    }
  }
}

export class Wrapper extends Module {
  render() {
    let MODULE = this.props.module;

    const NAMESPACE = this.props.name || 'wrapper';

    if (!MODULE) {
      if (this.props.children.length) {
        MODULE = this.props.children[0].type.name.toLowerCase();
      } else {
        MODULE = this.props.children.type.name.toLowerCase();
      }
    }

    const DYNAMICPROPS = {
      [MODULE]: true
    }

    return (
      <Module name={NAMESPACE} {...DYNAMICPROPS} {...this.props}>
        {this.props.children}
      </Module>
    );
  }
}

export class Group extends Module {
  render() {
    return (
      <Wrapper name='group' {...this.props}>{this.props.children}</Wrapper>
    );
  }
}