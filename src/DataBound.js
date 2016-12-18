if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (prefix) {
    if (prefix.length > this.length) {
      return false;
    }
    return (prefix === (this.slice(0, prefix.length)));
  }
}

class DataBoundUtils {
  static extractPropsFromString(propStr) {
    let match = propStr.match(DataBoundUtils.propStringRegex);
    if (match && match.length > 0) {
      let props = [];
      for (let i = 0; i < match.length; i++) {
        let m = match[i];
        let p = match[i].slice(2, -1).trim();
        let rootRef = false;
        let selfRef = false;
        if (p.startsWith(".")) {
          selfRef = true;
          p = p.slice(1);
        } else if (p.startsWith("~")) {
          rootRef = true;
          p = p.slice(1);
        }
        props.push({match: m, prop: p, rootRef: rootRef, selfRef: selfRef})
      }
      return props;
    }
    return [];
  }

  static registerDBObject(obj) {
    if (DataBoundUtils.debugMode) {
      obj.dataBoundId = DataBoundUtils.boundObjectCounter++;
      DataBoundUtils.objectList.push(obj);
    }
  }

  static getDBObjectById(id) {
    if (!DataBoundUtils.debugMode) {
      return "DataBoundJS is not in debug mode.";
    }

    if (id >= 0 && id < DataBoundUtils.objectList.length) {
      return DataBoundUtils.objectList[id];
    }
    return null;
  }

  static bindElement(domElement, creator) {
    let elementBinding = null;
    if (domElement.attributes["data-bound-foreach"]) {
      elementBinding = new DataBoundCollection(domElement);
    } else if (domElement.attributes["data-bound-if"]) {
      elementBinding = new DataBoundIfNode(domElement);
    } else {
      elementBinding = new DataBoundElement(domElement, creator);
    }
    return elementBinding;
  }
}

DataBoundUtils.debugMode = false;
DataBoundUtils.objectList = [];
DataBoundUtils.boundObjectCounter = 1;

DataBoundUtils.booleanAttributeNameList = [
  "checked",
  "selected",
  "disabled",
  "hidden",
  "readonly",
  "multiple",
  "ismap",
  "defer",
  "declare",
  "noresize",
  "nowrap",
  "noshade",
  "compact"
];

DataBoundUtils.booleanConditionalAttributes = {
  'eq': (contextVal, conditionVal) => {
    return contextVal == conditionVal;
  },
  'neq': (contextVal, conditionVal) => {
    return contextVal != conditionVal;
  },
  'lt': (contextVal, conditionVal) => {
    return contextVal < conditionVal;
  },
  'lte': (contextVal, conditionVal) => {
    return contextVal <= conditionVal;
  },
  'gt': (contextVal, conditionVal) => {
    return contextVal > conditionVal;
  },
  'gte': (contextVal, conditionVal) => {
    return contextVal >= conditionVal;
  },
  'not': (contextVal) => {
    return !contextVal;
  }
};

DataBoundUtils.propStringRegex = new RegExp(/\$\{ *(~(?!\.))?[\w.]+\w *}/g);

class DataBoundPropString {
  constructor(str) {
    DataBoundUtils.registerDBObject(this);
    this.originalStr = str;
    this.matches = DataBoundUtils.extractPropsFromString(str);
  }

  getValueWithContext(propIndex, context, dataBoundContext, rootContext) {
    if (propIndex >= this.matches.length) {
      return; // undefined
    }

    let value;
    let match = this.matches[propIndex];
    let prop = match.prop;
    let parts = prop.split('.');
    let ctx;
    if (match.rootRef) {
      ctx = rootContext;
    } else if (match.selfRef) {
      ctx = dataBoundContext;
    } else {
      ctx = context;
    }

    this.lastContextUsed = ctx;

    for (let j = 0; j < parts.length; j++) {
      let currentProp = parts[j];
      if (ctx != null && currentProp in ctx) {
        value = ctx[currentProp];
      } else {
        return; // undefined
      }

      ctx = value;
    }
    return value;
  }

  getPropName(propIndex) {
    if (propIndex < this.matches.length) {
      return this.matches[propIndex].prop;
    }
  }

  get boundName() {
    let propName = this.getPropName(0);
    return this.lastContextUsed && propName ?
    this.lastContextUsed.constructor.name + "." + propName : "[Unbound]";
  }

  renderWithContext(context, dataBoundContext, rootContext) {
    let renderStr = this.originalStr;
    for (let i = 0; i < this.matches.length; i++) {
      let value = this.getValueWithContext(i, context, dataBoundContext, rootContext);
      value = value instanceof Function ? value(dataBoundContext) : value;
      renderStr = renderStr.replace(this.matches[i].match, value);
    }
    return renderStr;
  }
}

class DataBoundRenderable {
  constructor(node, propString) {
    DataBoundUtils.registerDBObject(this);
    this.node = node;
    this.nodeOwner = node ? node.ownerElement : null;
    this.attrName = node ? node.nodeName : null;
    this.propString = propString ? new DataBoundPropString(propString) : null;
  }

  get isBound() {
    return this.propString ? this.propString.matches.length > 0 : false;
  }

  renderWithContext(context, dataBoundContext, rootContext, extendContext, extendBoundContext, extendRootContext) {
    this.lastContexts = {
      context: context,
      dataBoundContext: dataBoundContext,
      rootContext: rootContext
    };

    this.render(context, dataBoundContext, rootContext, extendContext, extendBoundContext, extendRootContext);
  }

  render() {
    throw "DataBoundRenderable does not implemented 'render' method."
  }
}

class DataBoundAttribute extends DataBoundRenderable {
  constructor(attrNode) {
    super(attrNode, attrNode.nodeValue);
  }

  render(context, dataBoundContext, rootContext) {
    this.node.nodeValue = this.propString.renderWithContext(context, dataBoundContext, rootContext);
  }
}

class DataBoundHTMLAttribute extends DataBoundRenderable {
  constructor(attrNode) {
    super(attrNode, attrNode.nodeValue);
  }

  render(context, dataBoundContext, rootContext) {
    this.nodeOwner.innerHTML = this.propString.renderWithContext(context, dataBoundContext, rootContext);
    this.nodeOwner.setAttribute('data-bound-html', this.propString.boundName);
  }
}

class DataBoundTextNode extends DataBoundRenderable {
  constructor(textNode) {
    super(textNode, textNode.nodeValue);
  }

  render(context, dataBoundContext, rootContext) {
    this.node.nodeValue = this.propString.renderWithContext(context, dataBoundContext, rootContext);
  }
}

class DataBoundProxy extends DataBoundRenderable {
  constructor(node, forAttr) {
    super(node, node.nodeValue);
    this.forAttr = forAttr;
  }

  render(context, dataBoundContext, rootContext) {
    this.nodeOwner.setAttribute(this.forAttr,
      this.propString.renderWithContext(context, dataBoundContext, rootContext));
    this.nodeOwner.setAttribute(this.attrName, this.propString.boundName);
  }
}

class DataBoundConditional extends DataBoundRenderable {
  constructor(attributes, prefix) {
    super(null, null);
    this.conditionAttr = null;
    this.conditionPropString = null;
    this.conditionMethod = (value) => {
      return value;
    };

    for (let i = 0; i < attributes.length; i++) {
      let attr = attributes[i];
      if (attr.name.startsWith(prefix)) {
        this.conditionAttr = attr;
        this.conditionPropString = new DataBoundPropString(attr.nodeValue);
        if (this.conditionPropString.matches.length == 0) {
          this.conditionPropString = null;
        }
        let condition = attr.name.slice(prefix.length);
        this.conditionMethod = DataBoundUtils.booleanConditionalAttributes[condition];
        if (!this.conditionMethod) {
          console.warn("Unknown conditional attribute '", condition,
            "' used for boolean attribute '", this.attrName, "'.");
          this.conditionMethod = (value) => {
            return value;
          };
        }
        break;
      }
    }
  }

  getValueWithContext(context, dataBoundContext, rootContext) {
    let conditionValue = null;
    if (this.conditionAttr) {
      if (this.conditionPropString) {
        conditionValue = this.conditionPropString.renderWithContext(context, dataBoundContext, rootContext);
      } else {
        conditionValue = this.conditionAttr.nodeValue;
      }
    }
    return conditionValue;
  }
}

class DataBoundBooleanAttribute extends DataBoundRenderable {
  constructor(attrNode) {
    super(attrNode, attrNode.nodeValue);
    attrNode.nodeValue = '';
    this.boundConditional = new DataBoundConditional(this.nodeOwner.attributes,
      'data-bound-' + this.attrName + '-');
  }

  render(context, dataBoundContext, rootContext) {
    if (this.propString.matches.length > 0) {
      let contextValue = this.propString.getValueWithContext(0, context, dataBoundContext, rootContext);
      this.nodeOwner.setAttribute('data-bound-boolean-' + this.attrName, this.propString.boundName);
      if (contextValue instanceof Function) {
        contextValue = contextValue(dataBoundContext);
      }

      let conditionValue = this.boundConditional.getValueWithContext(context, dataBoundContext, rootContext);

      if (this.boundConditional.conditionMethod(contextValue, conditionValue)) {
        this.nodeOwner.setAttribute(this.attrName, '');
      } else {
        this.nodeOwner.removeAttribute(this.attrName);
      }
    }
  }
}

class DataBoundMethodAttribute extends DataBoundRenderable {
  constructor(attrNode) {
    if (!attrNode.nodeName.startsWith("on")) {
      throw "DataBoundMethodAttribute can only be bound to an attribute that begins with 'on'.";
    }
    super(attrNode, attrNode.nodeValue);
    this.eventName = this.attrName.slice(2);
    this.nodeOwner.addEventListener(this.eventName, this.eventCall.bind(this));
    this.nodeOwner.removeAttribute(this.attrName);
  }

  render(context, dataBoundContext, rootContext) {
    this.lastBoundContext = dataBoundContext;
    this.method = this.propString.getValueWithContext(0, context, dataBoundContext, rootContext);
    if (this.method && this.method instanceof Function) {
      this.nodeOwner.setAttribute('data-bound-method-' + this.attrName, this.propString.boundName);
    } else {
      this.nodeOwner.setAttribute('data-bound-method-' + this.attrName, "[No Bound Method]");
    }
  }

  eventCall(event) {
    if (this.method instanceof Function) {
      this.method(event, this.lastBoundContext);
    }
  }
}

class DataBoundElement extends DataBoundRenderable {
  constructor(element, creatingElement) {
    super(element, null);
    this.domElement = this.node;
    this.bindings = [];
    this.refs = creatingElement ? creatingElement.refs : [];
    this.subContexts = creatingElement ? creatingElement.subContexts : [];

    for (let i = 0; i < this.domElement.attributes.length; i++) {
      let attr = this.domElement.attributes[i];
      let binding = null;
      if (DataBoundUtils.booleanAttributeNameList.indexOf(attr.name) >= 0) {
        binding = new DataBoundBooleanAttribute(attr);
      } else if (attr.name.startsWith("on")) {
        binding = new DataBoundMethodAttribute(attr);
      } else if (attr.name == "data-bound-html") {
        binding = new DataBoundHTMLAttribute(attr);
      } else if (attr.name == "data-bound-src") {
        binding = new DataBoundProxy(attr, "src");
      } else {
        binding = new DataBoundAttribute(attr);
      }
      if (binding.isBound) {
        this.bindings.push(binding);
      }
    }

    for (let i = 0; i < this.domElement.childNodes.length; i++) {
      let node = this.domElement.childNodes[i];
      switch (node.nodeType) {
        case 1: // ELEMENT NODE
          if (node.attributes["data-bound-context"]) {
            let subContext = new DataBoundSubContext(node);
            let contextName = node.getAttribute("id");
            this.subContexts.push(subContext);
            if (contextName) {
              this.subContexts[contextName] = this.subContexts[this.subContexts.length - 1];
            }
            node.removeAttribute("data-bound-context");
            node.setAttribute("data-bound-sub-context", "");
            break;
          }

          let elementBinding = DataBoundUtils.bindElement(node, this);

          if (node.attributes["data-bound-ref"]) {
            let refName = node.getAttribute("data-bound-ref") || node.getAttribute("id");
            this.refs.push(elementBinding);
            if (refName) {
              this.refs[refName] = elementBinding;
            }
          }

          if (elementBinding.isBound && !node.attributes["data-bound-ignore"]) {
            this.bindings.push(elementBinding);
          }
          break;
        case 3: // TEXT NODE
          let textBinding = new DataBoundTextNode(node);
          if (textBinding.isBound) {
            this.bindings.push(textBinding);
          }
          break;
      }
    }
  }

  get isBound() {
    return this.bindings.length > 0;
  }

  render(context, dataBoundContext, rootContext, extendContext, extendDataBoundContext, extendRootContext) {
    if (!rootContext) {
      rootContext = context;
    }

    let newContext = null;
    if (extendDataBoundContext && dataBoundContext) {
      dataBoundContext.domElement = this.domElement;
      dataBoundContext.boundElement = this;
      newContext = dataBoundContext;
    } else {
      newContext = {
        parent: dataBoundContext,
        boundElement: this,
        domElement: this.domElement
      };
    }

    for (let i = 0; i < this.bindings.length; i++) {
      let b = this.bindings[i];
      b.renderWithContext(context, newContext, rootContext, false, true, false);
    }

    for (let i = 0; i < this.subContexts.length; i++) {
      let sub = this.subContexts[i];
      sub.currentRootContext = rootContext;
    }
  }
}

class DataBoundSubContext extends DataBoundRenderable {
  constructor(element) {
    super(element, null);
    this.domElement = this.node;
    this.boundElement = DataBoundUtils.bindElement(element);
    this.currentRootContext = null;
  }

  render(context) {
    this.boundElement.renderWithContext(context, null, this.currentRootContext);
  }
}

class DataBoundIfNode extends DataBoundRenderable {
  constructor(element) {
    super(element, element.attributes["data-bound-if"].nodeValue);
    DataBoundUtils.registerDBObject(this);
    this.domElement = this.node;
    this.domElement.removeAttribute("data-bound-if");
    this.boundElement = new DataBoundElement(this.domElement);
    this.baseElement = this.domElement.parentElement;
    this.anchorNode = document.createComment("DataBoundIfNode: [No Condition Set]");
    this.baseElement.insertBefore(this.anchorNode, this.domElement);
    this.elementInDom = true;
    this.boundConditional = new DataBoundConditional(this.domElement.attributes, "data-bound-if-");
  }

  render(context, dataBoundContext, rootContext) {
    if (dataBoundContext) {
      dataBoundContext.domElement = this.domElement;
      dataBoundContext.boundElement = this.boundElement;
    } else {
      dataBoundContext = {
        domElement: this.domElement,
        boundElement: this.boundElement
      }
    }

    let value = this.propString.getValueWithContext(0, context, dataBoundContext, rootContext);
    if (value instanceof Function) {
      value = value(dataBoundContext);
    }

    let conditionValue = this.boundConditional.getValueWithContext(context, dataBoundContext, rootContext);
    this.anchorNode.data = "DataBoundIfNode: " +
      context.constructor.name + "." + this.propString.getPropName(0);

    if (this.boundConditional.conditionMethod(value, conditionValue)) {
      if (!this.elementInDom) {
        this.baseElement.insertBefore(this.domElement, this.anchorNode);
        this.elementInDom = true;
      }
    } else {
      if (this.elementInDom) {
        this.baseElement.removeChild(this.domElement);
        this.elementInDom = false;
      }
    }

    if (this.elementInDom) {
      this.boundElement.renderWithContext(context, dataBoundContext, rootContext, false, true, false);
    }
  }
}

class DataBoundCollection extends DataBoundRenderable {
  constructor(element) {
    super(element, element.attributes["data-bound-foreach"].nodeValue);
    this.domElement = this.node;
    this.domElement.removeAttribute("data-bound-foreach");
    this.baseElement = this.domElement.parentElement;
    this.anchorNode = document.createComment("DataBoundCollection: [No Context]");
    this.baseElement.insertBefore(this.anchorNode, this.domElement);
    this.baseElement.removeChild(this.domElement);
    this.elementArray = [];
  }

  render(context, dataBoundContext, rootContext) {
    let contextArray = this.propString.getValueWithContext(0, context, dataBoundContext, rootContext);
    if (!(contextArray instanceof Array)) {
      this.anchorNode.data = "DataBoundCollection: [No Context]";
      if (contextArray) {
        throw "Cannot render a DataBoundCollection with non-Array type.";
      } else {
        // null and undefined are allowed values, but still can't render, so just return
        return;
      }
    }

    this.anchorNode.data = "DataBoundCollection: " +
      context.constructor.name + "." + this.propString.getPropName(0);

    if (contextArray.length != this.elementArray.length) {
      if (contextArray.length < this.elementArray.length) {
        // Remove Nodes
        let removed = this.elementArray.splice(contextArray.length,
          this.elementArray.length - contextArray.length);

        for (let i = 0; i < removed.length; i++) {
          this.baseElement.removeChild(removed[i].domElement);
        }
      } else if (contextArray.length > this.elementArray.length) {
        // Add Nodes
        let dif = contextArray.length - this.elementArray.length;
        for (let i = 0; i < dif; i++) {
          let clone = this.domElement.cloneNode(true);
          let boundElement = DataBoundUtils.bindElement(clone);
          this.elementArray.push(boundElement);
          this.baseElement.insertBefore(clone, this.anchorNode);
        }
      }
    }

    for (let i = 0; i < this.elementArray.length; i++) {
      let child = this.elementArray[i];
      let childDataBoundContext = {
        dataBoundIndex: i,
        arrayContext: context,
        contextValue: contextArray[i],
        parent: dataBoundContext
      };
      child.renderWithContext(contextArray[i], childDataBoundContext, rootContext, false, true, false);
    }
  }
}