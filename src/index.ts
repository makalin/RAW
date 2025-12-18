/**
 * RAW - The Naked Performance Engine
 * Zero Virtual DOM. Zero Hydration. 100% Browser Power.
 */

export type Signal<T> = {
  val: T;
  _subscribers: Set<() => void>;
  _isComputed?: boolean;
};

// Export all utilities
export * from './computed.js';
export * from './effect.js';
export * from './lifecycle.js';
export * from './utils.js';
export * from './forms.js';
export * from './router.js';
export * from './store.js';
export * from './debug.js';

/**
 * Creates a reactive signal (state)
 */
export function state<T>(initialValue: T): Signal<T> {
  const signal: Signal<T> = {
    val: initialValue,
    _subscribers: new Set(),
  };

  return new Proxy(signal, {
    get(target, prop) {
      if (prop === 'val') {
        // Track dependency if we're in a computed context
        const computedContext = (globalThis as any).__RAW_CURRENT_COMPUTED__;
        if (computedContext && computedContext.deps) {
          computedContext.deps.add(target);
        }
        return target.val;
      }
      return (target as any)[prop];
    },
    set(target, prop, value) {
      if (prop === 'val') {
        const oldValue = target.val;
        target.val = value;
        // Notify all subscribers if value changed
        if (oldValue !== value) {
          target._subscribers.forEach((fn) => fn());
        }
      } else {
        (target as any)[prop] = value;
      }
      return true;
    },
  }) as Signal<T>;
}

/**
 * Subscribes to a signal and executes callback when it changes
 */
function subscribe<T>(signal: Signal<T>, callback: () => void): () => void {
  signal._subscribers.add(callback);
  return () => {
    signal._subscribers.delete(callback);
  };
}

/**
 * Checks if a value is a signal
 */
function isSignal(value: any): value is Signal<any> {
  return value && typeof value === 'object' && '_subscribers' in value && 'val' in value;
}

type DynamicPart = {
  index: number;
  value: any;
  signal?: Signal<any>;
  isFunction: boolean;
  isArray: boolean;
};

/**
 * HTML tagged template literal - creates reactive DOM
 */
export function html(
  strings: TemplateStringsArray,
  ...values: any[]
): () => DocumentFragment {
  // Build HTML with placeholders, tracking which are in attributes
  let htmlString = '';
  const dynamicParts: DynamicPart[] = [];
  let dynamicIndex = 0;
  
  // Track which dynamic parts are in attributes
  const attributeContexts: Map<number, { attrName: string; elementIndex: number }> = new Map();
  
  for (let i = 0; i < strings.length; i++) {
    htmlString += strings[i];
    
    if (i < values.length) {
      const value = values[i];
      const placeholder = `__RAW_${dynamicIndex}__`;
      
      // Check if we're in an attribute by looking at the string before
      const beforePlaceholder = htmlString;
      const lastTagMatch = beforePlaceholder.match(/<[^>]*$/);
      if (lastTagMatch) {
        const lastTag = lastTagMatch[0];
        const attrMatch = lastTag.match(/(\w+)=["']?$/);
        if (attrMatch) {
          attributeContexts.set(dynamicIndex, {
            attrName: attrMatch[1],
            elementIndex: 0, // Will be set during parsing
          });
        }
      }
      
      const part: DynamicPart = {
        index: dynamicIndex,
        value,
        isFunction: typeof value === 'function',
        isArray: Array.isArray(value),
      };
      
      if (isSignal(value)) {
        part.signal = value;
        part.value = String(value.val);
      } else if (Array.isArray(value)) {
        part.value = value;
      } else if (typeof value === 'function') {
        part.value = value;
      } else {
        part.value = String(value ?? '');
      }
      
      dynamicParts.push(part);
      htmlString += placeholder;
      dynamicIndex++;
    }
  }
  
  // Parse HTML
  const temp = document.createElement('template');
  temp.innerHTML = htmlString;
  const templateFragment = temp.content.cloneNode(true) as DocumentFragment;
  
  return () => {
    const instance = templateFragment.cloneNode(true) as DocumentFragment;
    const unsubscribers: (() => void)[] = [];
    
    // First pass: handle attributes (event handlers and signal attributes)
    const elementWalker = document.createTreeWalker(
      instance,
      NodeFilter.SHOW_ELEMENT,
      null
    );
    
    let elementIndex = 0;
    while (elementWalker.nextNode()) {
      const element = elementWalker.currentNode as Element;
      
      // Process all attributes
      Array.from(element.attributes).forEach((attr) => {
        if (attr.value.includes('__RAW_')) {
          const matches = Array.from(attr.value.matchAll(/__RAW_(\d+)__/g));
          
          if (matches.length > 0) {
            // Check if any match is a function (event handler)
            let hasFunction = false;
            matches.forEach((match) => {
              const idx = parseInt(match[1]);
              const part = dynamicParts[idx];
              if (part && part.isFunction && attr.name.startsWith('on')) {
                hasFunction = true;
                const eventName = attr.name.substring(2);
                element.addEventListener(eventName, part.value as EventListener);
              }
            });
            
            if (hasFunction) {
              // Remove the attribute, event handler is attached
              element.removeAttribute(attr.name);
            } else {
              // Handle signal or regular value in attribute
              let newValue = attr.value;
              matches.forEach((match) => {
                const idx = parseInt(match[1]);
                const part = dynamicParts[idx];
                
                if (part) {
                  if (part.signal) {
                    const updateAttribute = () => {
                      const currentAttr = element.getAttribute(attr.name);
                      if (currentAttr) {
                        const updated = currentAttr.replace(
                          new RegExp(`__RAW_${idx}__`, 'g'),
                          String(part.signal!.val)
                        );
                        element.setAttribute(attr.name, updated);
                      }
                    };
                    
                    updateAttribute();
                    const unsubscribe = subscribe(part.signal, updateAttribute);
                    unsubscribers.push(unsubscribe);
                    
                    newValue = newValue.replace(match[0], String(part.signal.val));
                  } else {
                    newValue = newValue.replace(match[0], part.value);
                  }
                }
              });
              
              element.setAttribute(attr.name, newValue);
            }
          }
        }
      });
      
      elementIndex++;
    }
    
    // Second pass: handle text nodes and arrays
    const allNodes: Node[] = [];
    const nodeCollector = document.createTreeWalker(
      instance,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_COMMENT,
      null
    );
    
    while (nodeCollector.nextNode()) {
      allNodes.push(nodeCollector.currentNode);
    }
    
    allNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const textNode = node as Text;
        const text = textNode.textContent || '';
        const matches = Array.from(text.matchAll(/__RAW_(\d+)__/g));
        
        if (matches.length > 0) {
          // Check if any match is an array
          let hasArray = false;
          matches.forEach((match) => {
            const idx = parseInt(match[1]);
            const part = dynamicParts[idx];
            if (part && part.isArray) {
              hasArray = true;
              
              // Create fragment for array items
              const fragment = document.createDocumentFragment();
              
              part.value.forEach((item: any) => {
                if (typeof item === 'function') {
                  const itemFragment = item();
                  fragment.appendChild(itemFragment);
                } else if (isSignal(item)) {
                  const itemTextNode = document.createTextNode(String(item.val));
                  fragment.appendChild(itemTextNode);
                  
                  const updateText = () => {
                    itemTextNode.textContent = String(item.val);
                  };
                  const unsubscribe = subscribe(item, updateText);
                  unsubscribers.push(unsubscribe);
                } else {
                  const itemTextNode = document.createTextNode(String(item));
                  fragment.appendChild(itemTextNode);
                }
              });
              
              // Replace text node with fragment
              const parent = textNode.parentNode;
              if (parent) {
                // Split text node: before placeholder, fragment, after placeholder
                const beforeText = text.substring(0, match.index);
                const afterText = text.substring(match.index! + match[0].length);
                
                if (beforeText) {
                  parent.insertBefore(document.createTextNode(beforeText), textNode);
                }
                parent.insertBefore(fragment, textNode);
                if (afterText) {
                  parent.insertBefore(document.createTextNode(afterText), textNode);
                }
                parent.removeChild(textNode);
              }
            }
          });
          
          if (!hasArray) {
            // Handle signals and regular values in text
            let newText = text;
            matches.forEach((match) => {
              const idx = parseInt(match[1]);
              const part = dynamicParts[idx];
              
              if (part) {
                if (part.signal) {
                  newText = newText.replace(match[0], String(part.signal.val));
                  
                  const updateText = () => {
                    const currentText = textNode.textContent || '';
                    const updated = currentText.replace(
                      new RegExp(`__RAW_${idx}__`, 'g'),
                      String(part.signal!.val)
                    );
                    textNode.textContent = updated || String(part.signal!.val);
                  };
                  
                  const unsubscribe = subscribe(part.signal, updateText);
                  unsubscribers.push(unsubscribe);
                } else {
                  newText = newText.replace(match[0], part.value);
                }
              }
            });
            
            textNode.textContent = newText;
          }
        }
      } else if (node.nodeType === Node.COMMENT_NODE) {
        const comment = node as Comment;
        const match = comment.textContent?.match(/^RAW_(\d+)$/);
        if (match) {
          const idx = parseInt(match[1]);
          const part = dynamicParts[idx];
          
          if (part) {
            if (part.isArray) {
              const fragment = document.createDocumentFragment();
              
              part.value.forEach((item: any) => {
                if (typeof item === 'function') {
                  const itemFragment = item();
                  fragment.appendChild(itemFragment);
                } else if (isSignal(item)) {
                  const textNode = document.createTextNode(String(item.val));
                  fragment.appendChild(textNode);
                  
                  const updateText = () => {
                    textNode.textContent = String(item.val);
                  };
                  const unsubscribe = subscribe(item, updateText);
                  unsubscribers.push(unsubscribe);
                } else {
                  const textNode = document.createTextNode(String(item));
                  fragment.appendChild(textNode);
                }
              });
              
              comment.parentNode?.replaceChild(fragment, comment);
            } else if (part.signal) {
              const textNode = document.createTextNode(String(part.signal.val));
              comment.parentNode?.replaceChild(textNode, comment);
              
              const updateText = () => {
                textNode.textContent = String(part.signal!.val);
              };
              const unsubscribe = subscribe(part.signal, updateText);
              unsubscribers.push(unsubscribe);
            } else {
              const textNode = document.createTextNode(part.value);
              comment.parentNode?.replaceChild(textNode, comment);
            }
          }
        }
      }
    });
    
    // Store unsubscribers for cleanup
    (instance as any)._rawUnsubscribers = unsubscribers;
    
    return instance;
  };
}

/**
 * Creates a reactive array renderer that updates when a signal changes
 */
export function renderArray<T>(
  signal: Signal<T[]>,
  renderFn: (item: T, index: number) => () => DocumentFragment
): () => DocumentFragment {
  return () => {
    const fragment = document.createDocumentFragment();
    signal.val.forEach((item, index) => {
      const itemFragment = renderFn(item, index)();
      fragment.appendChild(itemFragment);
    });
    return fragment;
  };
}

/**
 * Mounts a component to a DOM element
 */
export function mount(
  component: () => DocumentFragment,
  target: HTMLElement
): () => void {
  // Clear target
  target.innerHTML = '';
  
  // Create and append component
  const fragment = component();
  target.appendChild(fragment);
  
  // Return cleanup function
  return () => {
    const unsubscribers = (fragment as any)._rawUnsubscribers;
    if (unsubscribers) {
      unsubscribers.forEach((unsub: () => void) => unsub());
    }
    target.innerHTML = '';
  };
}
