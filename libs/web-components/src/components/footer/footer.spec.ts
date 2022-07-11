import Footer from './Footer.svelte'
import { render } from '@testing-library/svelte'

it('it works', async () => {
  const { getByText } = render(Footer)

  expect(getByText('Hello component!'));
})
