import FooterMetaSection from './FooterMetaSection.svelte'
import { render } from '@testing-library/svelte'

it('it works', async () => {
  const { getByText } = render(FooterMetaSection)

  expect(getByText('Hello component!'));
})
