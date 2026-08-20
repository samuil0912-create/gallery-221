import json, math, datetime as dt, os

DATA = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")

def load(bar):
    d = json.load(open(os.path.join(DATA, f"{bar}.json")))["data"]
    rows = []
    for r in reversed(d):  # OKX returns newest first
        ts, o, h, l, c, vol, volccy = r[0], r[1], r[2], r[3], r[4], r[5], r[6]
        rows.append(dict(t=int(ts), o=float(o), h=float(h), l=float(l), c=float(c), v=float(vol), conf=r[8] if len(r)>8 else "1"))
    return rows

def ema(vals, n):
    k = 2/(n+1); out=[]; e=None
    for v in vals:
        e = v if e is None else v*k + e*(1-k)
        out.append(e)
    return out

def sma(vals, n):
    out=[]; s=0
    for i,v in enumerate(vals):
        s+=v
        if i>=n: s-=vals[i-n]
        out.append(s/min(i+1,n) if i+1>=n else None)
    return out

def rsi(vals, n=14):
    out=[None]*len(vals); ag=al=0
    for i in range(1,len(vals)):
        ch = vals[i]-vals[i-1]
        g = max(ch,0); l = max(-ch,0)
        if i<=n: ag += g/n; al += l/n
        else: ag = (ag*(n-1)+g)/n; al = (al*(n-1)+l)/n
        if i>=n:
            out[i] = 100 - 100/(1+ (ag/al if al>0 else 999))
    return out

def macd(vals, f=12, s=26, sig=9):
    ef, es = ema(vals,f), ema(vals,s)
    line = [a-b for a,b in zip(ef,es)]
    sl = ema(line,sig)
    hist = [a-b for a,b in zip(line,sl)]
    return line, sl, hist

def atr(rows, n=14):
    trs=[]
    for i,r in enumerate(rows):
        if i==0: trs.append(r['h']-r['l'])
        else:
            pc = rows[i-1]['c']
            trs.append(max(r['h']-r['l'], abs(r['h']-pc), abs(r['l']-pc)))
    return ema(trs,n), trs

def adx(rows, n=14):
    _, trs = atr(rows,n)
    pdm=[0.0]; ndm=[0.0]
    for i in range(1,len(rows)):
        up = rows[i]['h']-rows[i-1]['h']; dn = rows[i-1]['l']-rows[i]['l']
        pdm.append(up if (up>dn and up>0) else 0.0)
        ndm.append(dn if (dn>up and dn>0) else 0.0)
    atr_s = ema(trs,n); pd_s = ema(pdm,n); nd_s = ema(ndm,n)
    pdi=[]; ndi=[]; dx=[]
    for i in range(len(rows)):
        a = atr_s[i] or 1e-9
        p = 100*pd_s[i]/a; m = 100*nd_s[i]/a
        pdi.append(p); ndi.append(m)
        dx.append(100*abs(p-m)/max(p+m,1e-9))
    return ema(dx,n), pdi, ndi

def bb(vals, n=20, k=2):
    m = sma(vals,n); up=[]; lo=[]; wid=[]
    for i in range(len(vals)):
        if m[i] is None: up.append(None); lo.append(None); wid.append(None); continue
        seg = vals[i-n+1:i+1]
        mu = m[i]; sd = math.sqrt(sum((x-mu)**2 for x in seg)/n)
        up.append(mu+k*sd); lo.append(mu-k*sd); wid.append((2*k*sd)/mu*100)
    return m, up, lo, wid

def stochrsi(vals, n=14, k=3):
    r = rsi(vals,n)
    out=[None]*len(vals)
    for i in range(len(vals)):
        seg=[x for x in r[max(0,i-n+1):i+1] if x is not None]
        if len(seg)==n:
            lo,hi=min(seg),max(seg)
            out[i]= 100*(r[i]-lo)/max(hi-lo,1e-9)
    sm=[None]*len(vals)
    for i in range(len(vals)):
        seg=[x for x in out[max(0,i-k+1):i+1] if x is not None]
        if len(seg)==k: sm[i]=sum(seg)/k
    return sm

def swings(rows, lb=5):
    hi=[]; lo=[]
    for i in range(lb, len(rows)-lb):
        w = rows[i-lb:i+lb+1]
        if rows[i]['h'] == max(x['h'] for x in w): hi.append((i, rows[i]['h'], rows[i]['t']))
        if rows[i]['l'] == min(x['l'] for x in w): lo.append((i, rows[i]['l'], rows[i]['t']))
    return hi, lo

def vol_profile(rows, bins=40):
    lo = min(r['l'] for r in rows); hi = max(r['h'] for r in rows)
    step = (hi-lo)/bins
    prof=[0.0]*bins
    for r in rows:
        idx = min(int(((r['h']+r['l']+r['c'])/3 - lo)/step), bins-1)
        prof[idx]+= r['v']
    tot=sum(prof); poc=prof.index(max(prof))
    # value area 70%
    inc={poc}; acc=prof[poc]; lo_i=hi_i=poc
    while acc < 0.7*tot and (lo_i>0 or hi_i<bins-1):
        d = prof[lo_i-1] if lo_i>0 else -1
        u = prof[hi_i+1] if hi_i<bins-1 else -1
        if u>=d: hi_i+=1; acc+=prof[hi_i]
        else: lo_i-=1; acc+=prof[lo_i]
    return dict(poc=lo+step*(poc+0.5), val=lo+step*lo_i, vah=lo+step*(hi_i+1), lo=lo, hi=hi,
                bins=[dict(p=lo+step*(i+0.5), v=prof[i]) for i in range(bins)])

def ts(t): return dt.datetime.utcfromtimestamp(t/1000).strftime("%Y-%m-%d %H:%M")

if __name__ == "__main__":
    res={}
    for bar in ["1M","1W","1D","4H","1H","15m"]:
        rows = load(bar)
        c=[r['c'] for r in rows]; v=[r['v'] for r in rows]
        e = {n: ema(c,n) for n in (9,20,21,50,100,200)}
        s50, s200 = sma(c,50), sma(c,200)
        r14 = rsi(c); ml, ms, mh = macd(c); a14,_ = atr(rows); adx_,pdi,ndi = adx(rows)
        m20,ub,lb_,wid = bb(c); sr = stochrsi(c)
        hi,lo = swings(rows, 5 if bar in ("15m","1H","4H") else 4)
        vp = vol_profile(rows[-min(len(rows),200):])
        last = rows[-1]; i=len(rows)-1
        prev = rows[-2]
        pp = (prev['h']+prev['l']+prev['c'])/3
        res[bar]=dict(
            n=len(rows), last_t=ts(last['t']), close=last['c'], open=last['o'], high=last['h'], low=last['l'],
            ema={k:round(vv[i],1) for k,vv in e.items()},
            sma50=round(s50[i],1) if s50[i] else None, sma200=round(s200[i],1) if s200[i] else None,
            rsi=round(r14[i],1), rsi_prev=round(r14[i-1],1),
            macd=round(ml[i],1), macd_sig=round(ms[i],1), macd_hist=round(mh[i],1), macd_hist_prev=round(mh[i-1],1),
            atr=round(a14[i],1), atr_pct=round(a14[i]/last['c']*100,2),
            adx=round(adx_[i],1), pdi=round(pdi[i],1), ndi=round(ndi[i],1),
            bb_mid=round(m20[i],1), bb_up=round(ub[i],1), bb_lo=round(lb_[i],1), bb_width=round(wid[i],2),
            stochrsi=round(sr[i],1) if sr[i] is not None else None,
            vol=round(last['v'],1), vol_avg20=round(sum(v[-20:])/20,1),
            swing_highs=[(ts(t), round(p,1)) for _,p,t in hi[-6:]],
            swing_lows=[(ts(t), round(p,1)) for _,p,t in lo[-6:]],
            poc=round(vp['poc'],1), vah=round(vp['vah'],1), val=round(vp['val'],1),
            rng_hi=round(vp['hi'],1), rng_lo=round(vp['lo'],1),
            pivot=round(pp,1), r1=round(2*pp-prev['l'],1), s1=round(2*pp-prev['h'],1),
            r2=round(pp+(prev['h']-prev['l']),1), s2=round(pp-(prev['h']-prev['l']),1),
            chg_pct=round((last['c']-last['o'])/last['o']*100,2),
        )
    json.dump(res, open("summary.json","w"), indent=1)
    print(json.dumps(res, indent=1))
