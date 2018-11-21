export function setupCaptureClick(component) {
  let { element } = component;
  function captureClick(e) {
    e.stopPropagation(); // Stop the click from being propagated.
    element.removeEventListener('click', captureClick, true); // cleanup
  }
  element.addEventListener('click', captureClick, true);
  setTimeout(function(){
    element.removeEventListener('click', captureClick, true);
  }, 0);
}
