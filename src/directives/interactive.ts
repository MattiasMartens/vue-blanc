import { DirectiveOptions } from "vue";

const listeners = new WeakMap<
  HTMLElement,
  { [eventType: string]: EventListener }
>();

const onInteract = (el: HTMLElement) =>
  el.dispatchEvent(new Event("slate-interact"));

const isInteractKey = (keyCode: string) =>
  keyCode === "Enter" || keyCode === "Space";

const interactive: DirectiveOptions = {
  bind(el) {
    el.tabIndex = 0;

    const handlers = {
      click: () => onInteract(el),
      keypress: (e: KeyboardEvent) => isInteractKey(e.code) && onInteract(el)
    };

    el.addEventListener("click", handlers.click);
    el.addEventListener("keyup", handlers.keypress);

    listeners.set(el, handlers);
  },
  unbind(el) {
    const handlers = listeners.get(el);
    for (let eventType in handlers) {
      el.removeEventListener(eventType, handlers[eventType]);
    }
  }
};

export default interactive;
