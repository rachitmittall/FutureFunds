import { calculateSIPReturns } from './src/utils/calculations.js'

function test(monthly, rate, years) {
  const result = calculateSIPReturns({ monthly, annualRate: rate, years })
  console.log(`Rate: ${rate}, Years: ${years}, SIP: ${monthly} => Result: ${Math.round(result)}`)
}

console.log("Verifying Calculations...")
test(11500, 0.11, 1)  // Target ~1,45,000
test(11500, 0.11, 5)  // Target ~9,00,000
test(11500, 0.11, 10) // Target ~24,00,000
