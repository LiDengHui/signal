import test from 'ava'
import { signal, computed, Signal, Computed } from './dist/index.js' // 根据实际路径修改
import delay from '@dhlx/delay'

test('Signal should initialize and update value correctly', (t) => {
  const temp = signal(20)

  t.is(temp.value, 20, 'Initial value should be 20')

  temp.value = 25
  t.is(temp.value, 25, 'Value should be updated to 25')

  // Test effect
  const log = []
  temp.effect(() => {
    log.push(`Temperature changed to: ${temp.value}`)
  })

  temp.value = 30
  t.deepEqual(
    log,
    ['Temperature changed to: 25', 'Temperature changed to: 30'],
    'Effect should log the change'
  )
})

test('Computed should update value based on dependencies', async (t) => {
  const temp = signal(20)
  const humidity = signal(50)

  const comfortIndex = computed((c, h) => c + h, [temp, humidity])

  t.is(comfortIndex.value, 70, 'Initial comfort index should be 70')

  // Test effect
  const log = []
  comfortIndex.effect(() => {
    log.push(`Comfort Index updated to: ${comfortIndex.value}`)
  })

  // Update temperature
  temp.value = 25

  await delay(1)
  t.is(comfortIndex.value, 75, 'Comfort index should be updated to 75')
  t.deepEqual(
    log,
    ['Comfort Index updated to: 70', 'Comfort Index updated to: 75'],
    'Effect should log the change after temperature update'
  )

  // Update humidity
  humidity.value = 60
  await delay(1)
  t.is(comfortIndex.value, 85, 'Comfort index should be updated to 85')
  t.deepEqual(
    log,
    [
      'Comfort Index updated to: 70',
      'Comfort Index updated to: 75',
      'Comfort Index updated to: 85',
    ],
    'Effect should log the change after humidity update'
  )
})
