// Whether a comes before b in the document, for asserting a notice sits above its button.
export const isBefore = (a: Element, b: Element) =>
  (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
