export function handleClickOutside(event, refElement, setElement) {
  if (refElement.current && !refElement.current.contains(event.target)) {
    setElement(false);
  }
}
