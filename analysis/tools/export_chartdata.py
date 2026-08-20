import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ta import load, ema, rsi
want = {"1M":54,"1W":90, "1D":160, "4H":140, "1H":140, "15m":96}
out={}
for bar,n in want.items():
    rows = load(bar); c=[r['c'] for r in rows]
    e20,e50,e200 = ema(c,20), ema(c,50), ema(c,200)
    r14 = rsi(c); idx = range(max(0,len(rows)-n), len(rows))
    out[bar]=dict(t=[rows[i]['t'] for i in idx],
        o=[round(rows[i]['o'],1) for i in idx], h=[round(rows[i]['h'],1) for i in idx],
        l=[round(rows[i]['l'],1) for i in idx], c=[round(rows[i]['c'],1) for i in idx],
        v=[round(rows[i]['v'],1) for i in idx],
        e20=[round(e20[i],1) for i in idx], e50=[round(e50[i],1) for i in idx],
        e200=[round(e200[i],1) for i in idx],
        rsi=[round(r14[i],1) if r14[i] is not None else None for i in idx])
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "chartdata.js"),"w").write("const MD="+json.dumps(out,separators=(",",":"))+";\n")
print({k:len(v['t']) for k,v in out.items()}, len(open("chartdata.js").read()))
