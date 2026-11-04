import { createWidget, widget, align, text_style, prop } from '@zos/ui'
import {
  Vibrator,
  VIBRATOR_SCENE_SHORT_LIGHT,
  VIBRATOR_SCENE_SHORT_MIDDLE,
  VIBRATOR_SCENE_SHORT_STRONG,
  VIBRATOR_SCENE_DURATION,
  VIBRATOR_SCENE_DURATION_LONG,
  VIBRATOR_SCENE_STRONG_REMINDER,
  VIBRATOR_SCENE_NOTIFICATION,
  VIBRATOR_SCENE_CALL,
  VIBRATOR_SCENE_TIMER
} from '@zos/sensor'
import { px } from '@zos/utils'
import { push } from '@zos/router'

const log = console.log.bind(console)

// Экран Bip 6: 390x450, верхние ~44px закрыты статус-баром.
// 9 сцен + Стоп + навигация = 6 рядов, поэтому кнопки ниже обычного
const MARGIN = px(12)
const GAP = px(6)
const BTN_W = (px(390) - MARGIN * 2 - GAP) / 2
const BTN_H = px(44)
const X0 = MARGIN
const X1 = MARGIN + BTN_W + GAP
const Y0 = px(90)
const ROW = BTN_H + GAP

const SCENES = [
  { scene: () => VIBRATOR_SCENE_SHORT_LIGHT, key: 'SHORT_LIGHT', ru: 'Короткая слабая' },
  { scene: () => VIBRATOR_SCENE_SHORT_MIDDLE, key: 'SHORT_MIDDLE', ru: 'Короткая средняя' },
  { scene: () => VIBRATOR_SCENE_SHORT_STRONG, key: 'SHORT_STRONG', ru: 'Короткая сильная' },
  { scene: () => VIBRATOR_SCENE_DURATION, key: 'DURATION', ru: 'Длительная' },
  { scene: () => VIBRATOR_SCENE_DURATION_LONG, key: 'DURATION_LONG', ru: 'Длинная' },
  { scene: () => VIBRATOR_SCENE_STRONG_REMINDER, key: 'STRONG_REMINDER', ru: 'Строгое напоминание' },
  { scene: () => VIBRATOR_SCENE_NOTIFICATION, key: 'NOTIFICATION', ru: 'Уведомление' },
  { scene: () => VIBRATOR_SCENE_CALL, key: 'CALL', ru: 'Звонок' },
  { scene: () => VIBRATOR_SCENE_TIMER, key: 'TIMER', ru: 'Таймер' }
]

let nameText = null

function show(t) {
  if (nameText) nameText.setProperty(prop.TEXT, t)
}

function play(s) {
  try {
    new Vibrator().start({ mode: s.scene() })
    show('Вибро: ' + s.ru)
  } catch (e) {
    log('vibrate failed: ' + e)
    show('Ошибка: ' + s.ru)
  }
}

function stopAll() {
  try {
    new Vibrator().stop()
  } catch (e) {
    log('stop failed: ' + e)
  }
  show('Стоп')
}

Page({
  build() {
    createWidget(widget.TEXT, {
      x: px(12),
      y: px(48),
      w: px(390) - px(24),
      h: px(34),
      color: 0xffffff,
      text_size: px(28),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.WRAP,
      text: 'ВИБРАЦИЯ'
    })

    SCENES.forEach((s, i) => {
      createWidget(widget.BUTTON, {
        x: i % 2 ? X1 : X0,
        y: Y0 + ROW * Math.floor(i / 2),
        w: BTN_W,
        h: BTN_H,
        text_size: px(22),
        radius: px(22),
        normal_color: 0x2b3a4a,
        press_color: 0x3d5266,
        color: 0xffffff,
        align_h: align.CENTER_H,
        align_v: align.CENTER_V,
        text_style: text_style.WRAP,
        text: s.key,
        click_func: () => play(s)
      })
    })

    createWidget(widget.BUTTON, {
      x: X0,
      y: Y0 + ROW * 5,
      w: BTN_W,
      h: BTN_H,
      text_size: px(22),
      radius: px(22),
      normal_color: 0x7a3030,
      press_color: 0x9a4040,
      color: 0xffffff,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.WRAP,
      text: 'Стоп',
      click_func: stopAll
    })

    createWidget(widget.BUTTON, {
      x: X1,
      y: Y0 + ROW * 5,
      w: BTN_W,
      h: BTN_H,
      text_size: px(22),
      radius: px(22),
      normal_color: 0x2b3a4a,
      press_color: 0x3d5266,
      color: 0xffffff,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.WRAP,
      text: '<< Звуки',
      click_func: () => push({ url: 'page/sounds' })
    })

    nameText = createWidget(widget.TEXT, {
      x: px(12),
      y: px(396),
      w: px(390) - px(24),
      h: px(46),
      color: 0xffffff,
      text_size: px(22),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.WRAP,
      text: ''
    })
  }
})
