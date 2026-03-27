import { defComponent } from './component.js';
import { defStore, resolveStore } from './store.js';


Object.assign(window, { defComponent, defStore, resolveStore });