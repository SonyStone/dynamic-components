export const scrollToElement = (scrollContainer: Element, element: Element): void => {
  const eRect = element.getBoundingClientRect();
  const pRect = scrollContainer.getBoundingClientRect();

  const isInViewport = (eRect.top >= pRect.top) && (eRect.bottom <= pRect.bottom);

  if (!isInViewport) {
    scrollContainer.scrollTop += (eRect.top - pRect.top) - (scrollContainer.clientHeight / 2);
  }
}