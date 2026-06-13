@echo off
echo ==============================================
echo Стартиране на Nexus Platform...
echo ==============================================

echo Пускане на Frontend и Трите Двигателя едновременно...
call npx -y concurrently -c "blue,green,magenta,yellow" -n "UI,DECISION,AUDIT,STRATEGY" "pnpm --filter @workspace/nexus run dev" "pnpm --filter @workspace/decision-engine run dev" "pnpm --filter @workspace/audit-engine run dev" "pnpm --filter @workspace/strategy-engine run dev"

pause
