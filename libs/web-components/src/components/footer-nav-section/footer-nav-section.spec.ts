import FooterNavSection from './FooterNavSection.svelte'
import { render } from '@testing-library/svelte'

it('it works', async () => {
  const { getByText } = render(FooterNavSection, { columncount: 2})

  expect(getByText('Hello component!'));
})
