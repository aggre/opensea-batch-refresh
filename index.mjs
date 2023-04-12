import PQueue from 'p-queue'
import puppeteer from 'puppeteer'

const queue = new PQueue({ concurrency: 1 })

const MAX_TOKEN_ID = 120
const BASE =
  'https://opensea.io/assets/polygon/0x89904De861CDEd2567695271A511B3556659FfA2'
const MORE_SELECTOR = 'main button[aria-label="More"]'
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
        page.click(MORE_SELECTOR), console.log(id, 'clicked the more button')
        await page.waitForSelector(REFRESH_SELECTOR)
        console.log(id, 'refresh button found')
        page.click(REFRESH_SELECTOR), console.log(id, 'clicked the refresh button')
        await page.waitForSelector('[data-testid=toasts]')
        console.log(id, 'finished')
        return [id, 'success']
      } catch (error) {
        return [id, 'failed', error]
      }
    })

  const results = await queue.addAll(promises)

  results.forEach((result) => console.log(result))

  browser.close()
})()
