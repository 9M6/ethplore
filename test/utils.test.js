require("dotenv").config()
import test from 'ava'
import { isNumber } from "../src/utils"

test('isNumber', t => {
  t.true(isNumber(1))
  t.true(isNumber(100))
  t.true(isNumber(-100))
  t.true(isNumber(0))
  t.true(isNumber(-0))
  t.true(isNumber("1"))
  t.true(isNumber("100"))
  t.true(isNumber("-100"))
  t.true(isNumber("0"))
  t.true(isNumber("-0"))
  t.false(isNumber(NaN))
  t.false(isNumber(-NaN))
})
