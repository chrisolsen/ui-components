declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "goa-simple-form-summary": {}
    }
  }
}

export function GoASimpleFormSummary() {
  return <goa-simple-form-summary />
}
