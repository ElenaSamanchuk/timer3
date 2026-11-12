#!/bin/zsh
# Смена даты таймера КБД: zsh tools/set-date.sh 2026-11-13  (конец дня 23:59:59 МСК)
# Только локально: меняет script.js и прогоняет тест. Публикация — отдельно, git push в gh-pages.
set -e
cd "${0:A:h}/.."
[[ "$1" =~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' ]] || { echo "Формат: YYYY-MM-DD"; exit 2; }
sed -i '' -E "1s/new Date\(\"[0-9-]+T23:59:59\+03:00\"\)/new Date(\"$1T23:59:59+03:00\")/" script.js
grep -q "new Date(\"$1T23:59:59+03:00\")" script.js || { echo "Дата не записалась"; exit 1; }
node --check script.js && node tools/test_timer.cjs
