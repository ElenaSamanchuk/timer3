// Standalone test: node tools/test_timer.cjs. No network, packages or AI calls.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {spawnSync} = require('node:child_process');
const path = require('node:path');
if (!process.env.TIMER_TEST_SINGLE_ZONE) {
  const zones = ['UTC', 'Europe/Minsk', 'Europe/Moscow', 'America/New_York', 'America/Los_Angeles', 'Asia/Tokyo', 'Asia/Kathmandu', 'Pacific/Kiritimati'];
  for (const TZ of zones) {
    const r = spawnSync(process.execPath, [__filename], {env: {...process.env, TZ, TIMER_TEST_SINGLE_ZONE:'1'}, encoding:'utf8'});
    assert.equal(r.status, 0, `${TZ}: ${r.stderr || r.stdout}`);
    process.stdout.write(r.stdout);
  }
  console.log('PASS: fixed absolute deadline and nonnegative rendering in 8 time zones');
  process.exit(0);
}
const source = fs.readFileSync(path.join(__dirname,'../script.js'),'utf8');
const deadline = Date.parse('2026-11-06T20:59:59.000Z');
assert.equal(deadline, 1793998799000);
let now = deadline - (86400+2*3600+3*60+4)*1000;
const container = {innerHTML:''};
let tick;
class TestDate extends Date {constructor(...args){super(...(args.length ? args : [now]));}}
const ctx=vm.createContext({Date:TestDate, document:{getElementById(id){assert.equal(id,'timer');return container;}},setInterval(fn,ms){assert.equal(ms,1000);tick=fn;}});
vm.runInContext(source,ctx);
assert.equal(vm.runInContext('endDate.getTime()',ctx),deadline);
assert(container.innerHTML.includes('день'), 'must render immediately');
assert.equal((container.innerHTML.match(/class="segment"/g)||[]).length,4);
assert(container.innerHTML.includes('<span>0</span><span>2</span>'));
for (const offset of [-1000, 0, 1000, 86400000]) {
  now=deadline+offset; tick();
  assert(!container.innerHTML.includes('NaN'));
  if(offset>=0){assert(container.innerHTML.includes('00'));assert(container.innerHTML.includes('завершено'));assert(!container.innerHTML.includes('<span>-'));}
  else assert(container.innerHTML.includes('секунда'));
}
console.log(`PASS ${process.env.TZ}: deadline=2026-11-06T20:59:59.000Z, immediate render and expiry boundaries`);
