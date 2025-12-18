/**
 * Simple router for SPA navigation
 */

import { Signal, state } from './index.js';
import { html } from './index.js';

export type Route = {
  path: string;
  component: () => () => DocumentFragment;
  exact?: boolean;
};

export type RouterConfig = {
  routes: Route[];
  defaultPath?: string;
  onNavigate?: (path: string) => void;
};

let currentRouter: Router | null = null;

export class Router {
  private routes: Route[];
  public currentPath: Signal<string>;
  private onNavigate?: (path: string) => void;
  
  constructor(config: RouterConfig) {
    this.routes = config.routes;
    const initialPath = config.defaultPath || window.location.pathname || '/';
    this.currentPath = state(initialPath);
    this.onNavigate = config.onNavigate;
    
    // Handle browser navigation
    window.addEventListener('popstate', () => {
      this.currentPath.val = window.location.pathname;
    });
    
    // Subscribe to path changes
    this.currentPath._subscribers.add(() => {
      if (this.onNavigate) {
        this.onNavigate(this.currentPath.val);
      }
    });
    
    currentRouter = this;
  }
  
  /**
   * Navigate to a path
   */
  navigate(path: string, replace = false): void {
    if (replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
    this.currentPath.val = path;
  }
  
  /**
   * Get current route component
   */
  getCurrentRoute(): Route | undefined {
    const path = this.currentPath.val;
    
    // Try exact match first
    const exactMatch = this.routes.find(
      (route) => route.exact && route.path === path
    );
    if (exactMatch) return exactMatch;
    
    // Try pattern match
    return this.routes.find((route) => {
      if (route.exact) return false;
      const pattern = route.path.replace(/:\w+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(path);
    });
  }
  
  /**
   * Get route parameters
   */
  getParams(): Record<string, string> {
    const route = this.getCurrentRoute();
    if (!route) return {};
    
    const path = this.currentPath.val;
    const paramNames = route.path.match(/:(\w+)/g)?.map((p) => p.slice(1)) || [];
    const pattern = route.path.replace(/:\w+/g, '([^/]+)');
    const regex = new RegExp(`^${pattern}$`);
    const matches = path.match(regex);
    
    if (!matches) return {};
    
    const params: Record<string, string> = {};
    paramNames.forEach((name, index) => {
      params[name] = matches[index + 1];
    });
    
    return params;
  }
  
  /**
   * Create a Link component
   */
  Link(props: { to: string; children: () => DocumentFragment; class?: string }): () => DocumentFragment {
    return () => {
      const link = document.createElement('a');
      link.href = props.to;
      link.className = props.class || '';
      
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigate(props.to);
      });
      
      const fragment = document.createDocumentFragment();
      const childrenFragment = props.children();
      link.appendChild(childrenFragment);
      fragment.appendChild(link);
      
      return fragment;
    };
  }
  
  /**
   * Router view component
   */
  View(): () => DocumentFragment {
    return () => {
      const route = this.getCurrentRoute();
      if (!route) {
        return html`<div>404 - Not Found</div>`();
      }
      return route.component()();
    };
  }
}

/**
 * Create a router instance
 */
export function createRouter(config: RouterConfig): Router {
  return new Router(config);
}

/**
 * Get current router instance
 */
export function useRouter(): Router {
  if (!currentRouter) {
    throw new Error('Router not initialized. Call createRouter first.');
  }
  return currentRouter;
}

/**
 * Navigate programmatically
 */
export function navigate(path: string, replace = false): void {
  if (!currentRouter) {
    throw new Error('Router not initialized. Call createRouter first.');
  }
  currentRouter.navigate(path, replace);
}

