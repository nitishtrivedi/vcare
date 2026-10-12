type RevealCallback = () => void;

const callbacks = new Map<HTMLElement, RevealCallback>();
let observer: IntersectionObserver | undefined;

function getObserver(): IntersectionObserver | undefined {
  if (typeof IntersectionObserver === 'undefined') {
    return undefined;
  }

  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          const element = entry.target as HTMLElement;
          const callback = callbacks.get(element);

          callbacks.delete(element);
          observer?.unobserve(element);

          callback?.();
        }

        if (callbacks.size === 0) {
          observer?.disconnect();
          observer = undefined;
        }
      },
      {
        threshold: 0.01,
        rootMargin: '0px 0px -40px 0px',
      },
    );
  }

  return observer;
}

export function observeReveal(element: HTMLElement, callback: RevealCallback): () => void {
  const sharedObserver = getObserver();

  // Always preserve visible content when the API is unavailable.
  if (!sharedObserver) {
    callback();
    return () => undefined;
  }

  callbacks.set(element, callback);
  sharedObserver.observe(element);

  return () => {
    callbacks.delete(element);
    observer?.unobserve(element);

    if (callbacks.size === 0) {
      observer?.disconnect();
      observer = undefined;
    }
  };
}
