import PQueue from 'p-queue'
import puppeteer from 'puppeteer'

const queue = new PQueue({ concurrency: 1 })

const MAX_TOKEN_ID = 120
const BASE =
  'https://opensea.io/assets/matic/0x89904de861cded2567695271a511b3556659ffa2'
const MORE_SELECTOR = 'button[aria-label="More"]'
const REFRESH_SELECTOR = '.tippy-content button'

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  })
  const page = await browser.newPage()
  console.log('browser prepared')

  const promises = new Array(MAX_TOKEN_ID)
    .fill(null)
    .map((_, i) => async () => {
      try {
        const id = i + 1
        await page.goto(`${BASE}/${id}`)
        console.log(id, 'page loaded')
        await page.waitForSelector(MORE_SELECTOR)
        console.log(id, 'more button found')
        await page.hover(MORE_SELECTOR)
        console.log(id, 'hover on more button')
        page.click(MORE_SELECTOR), console.log(id, 'clicked the more button')
        await page.waitForSelector(REFRESH_SELECTOR)
        console.log(id, 'refresh button found')
        await page.hover(REFRESH_SELECTOR)
        console.log(id, 'hover on refresh button')
        page.click(REFRESH_SELECTOR), console.log(id, 'clicked the refresh button')
        await page.waitForSelector('[data-testid=toasts]')
        console.log(id, 'finished')
        return [id, 'success']
      } catch (error) {
        return ['failed', error]
      }
    })

  const results = await queue.addAll(promises)

  results.forEach((result) => console.log(result))

  browser.close()
})()
