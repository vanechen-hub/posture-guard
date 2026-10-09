#!/bin/zsh
# 双击即可：启动本地服务 + 打开浏览器。关掉这个终端窗口就停止服务。
cd "$(dirname "$0")"

PORT=8811
while lsof -nP -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; do PORT=$((PORT+1)); done

if command -v node >/dev/null 2>&1; then
  SERVER=(node -e "
    const http=require('http'),fs=require('fs'),path=require('path');
    const ROOT=__dirname, T={'.html':'text/html; charset=utf-8','.mjs':'text/javascript','.js':'text/javascript','.css':'text/css'};
    http.createServer((q,s)=>{
      const rel=decodeURIComponent(q.url.split('?')[0]);
      const f=path.join(ROOT, rel==='/'?'posture-guard.html':rel);
      if(!f.startsWith(ROOT)) return s.writeHead(403).end();
      fs.readFile(f,(e,b)=>e?s.writeHead(404).end('not found')
        :(s.writeHead(200,{'Content-Type':T[path.extname(f)]||'application/octet-stream'}),s.end(b)));
    }).listen($PORT,()=>console.log('ready'));
  ")
elif command -v python3 >/dev/null 2>&1; then
  SERVER=(python3 -m http.server $PORT --bind 127.0.0.1)
else
  echo "需要 node 或 python3，两者都没找到。"; read -r; exit 1
fi

echo "低头探颈检测器  →  http://localhost:$PORT"
echo "关闭这个窗口即可停止。"
"${SERVER[@]}" &
SRV=$!
sleep 1
open "http://localhost:$PORT/posture-guard.html"
trap "kill $SRV 2>/dev/null" EXIT
wait $SRV
