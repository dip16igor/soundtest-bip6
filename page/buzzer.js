import { createWidget, widget, align, text_style, prop } from '@zos/ui'
import { Buzzer } from '@zos/sensor'
import { px } from '@zos/utils'
import { push } from '@zos/router'

const log = console.log.bind(console)

// Экран Bip 6: 390x450, верхние ~44px закрыты статус-баром
const MARGIN = px(12)
const GAP = px(8)
const BTN_W = (px(390) - MARGIN * 2 - GAP) / 2
const BTN_H = px(52)
const X0 = MARGIN
const X1 = MARGIN + BTN_W + GAP
const Y0 = px(90)
const ROW = BTN_H + GAP

const SCENES = [
  { key: 'ALARM', ru: 'Будильник' },
  { key: 'REMIND_1', ru: 'Напоминание 1' },
  { key: 'REMIND_2', ru: 'Напоминание 2' },
  { key: 'OPERATE', ru: 'Нажатие' },
  { key: 'SUCCESS', ru: 'Успех' },
  { key: 'FAILURE', ru: 'Ошибка' }
]

let buzzer = null
let nameText = null

function show(t) {
  if (nameText) nameText.setProperty(prop.TEXT, t)
}

// Ленивое создание: в симуляторе зуммера нет (sensor 43),
// конструктор на верхнем уровне уронил бы весь экран
function ensureBuzzer() {
  if (!buzzer) {
    try {
      buzzer = new Buzzer()
    } catch (e) {
      log('no buzzer: ' + e)
    }
  }
  return buzzer
}

function play(s) {
  const b = ensureBuzzer()
  if (!b) {
    // Проверено на живых Bip 6: сенсора Buzzer в часах нет (конструктор кидает),
    // весь звук идёт через SystemSounds (динамик), тактильность — через Vibrator
    show('Bip 6 без зуммера: звук в «Звуках»')
    return
  }
  try {
    const on = b.isEnabled()
    b.start(b.getSourceType()[s.key], 0)
    show('Зуммер: ' + s.ru + (on ? '' : ' (выкл в настройках)'))
  } catch (e) {
    log('play failed: ' + e)
    show('Ошибка: ' + s.ru)
  }
}

function stopAll() {
  try {
    if (buzzer) buzzer.stop()
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
      text: 'ЗУММЕР'
    })

    SCENES.forEach((s, i) => {
      createWidget(widget.BUTTON, {
        x: i % 2 ? X1 : X0,
        y: Y0 + ROW * Math.floor(i / 2),
        w: BTN_W,
        h: BTN_H,
        text_size: px(26),
        radius: px(24),
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
      y: Y0 + ROW * 3,
      w: BTN_W,
      h: BTN_H,
      text_size: px(26),
      radius: px(24),
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
      y: Y0 + ROW * 3,
      w: BTN_W,
      h: BTN_H,
      text_size: px(26),
      radius: px(24),
      normal_color: 0x2b3a4a,
      press_color: 0x3d5266,
      color: 0xffffff,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.WRAP,
      text: 'Вибра >>',
      click_func: () => push({ url: 'page/vibro' })
    })

    nameText = createWidget(widget.TEXT, {
      x: px(12),
      y: px(388),
      w: px(390) - px(24),
      h: px(54),
      color: 0xffffff,
      text_size: px(24),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.WRAP,
      text: ''
    })
  }
})
