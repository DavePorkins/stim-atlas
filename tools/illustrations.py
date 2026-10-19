"""Quiet, semantic vector studies. No stock swirls or colour placeholders.

Illustrations are representations of an object family or action, never claims
about a manufacturer's exact design. Their motif is recorded in the catalogue.
"""
import re,html,hashlib,colorsys

def path(d,**attrs):
    return '<path d="'+d+'" '+ ' '.join(f'{k.replace("_","-")}="{v}"' for k,v in attrs.items())+'/>'
def circle(x,y,r,fill='var(--clay)',**attrs):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" '+ ' '.join(f'{k.replace("_","-")}="{v}"' for k,v in attrs.items())+'/>'
def rect(x,y,w,h,rx=8,fill='var(--clay)'):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"/>'
def line(d,width=4,color='var(--ink)'):
    return path(d,fill='none',stroke=color,stroke_width=width,stroke_linecap='round',stroke_linejoin='round')
def group(body,transform=''):
    return '<g transform="'+transform+'">'+body+'</g>'

HAND = 'M104 248 86 205Q79 186 91 183Q101 180 111 203L120 214 116 137Q115 120 126 120Q138 120 139 137L143 180 143 110Q143 94 155 95Q166 96 166 112L166 179 170 120Q171 105 182 107Q193 109 192 124L189 185 194 146Q198 134 207 138Q215 141 211 155L207 222Q201 255 179 270L141 273Q116 267 104 248Z'
def hand(scale=.72,x=0,y=0):
    return group(path(HAND,fill='#c0c5b4',stroke='#73806b',stroke_width=3),f'translate({x} {y}) scale({scale})')
def person(mode='stand'):
    s=circle(180,99,20,'#a7b29b')
    if mode=='sit':
        return s+line('M180 123V192H225L241 252M181 190 151 227 125 250',13,'#a7b29b')+line('M180 144 145 180 203 179',11,'#a7b29b')+line('M151 204H211V269M144 130V204',5)
    if mode=='hug':
        return s+line('M180 125V199M180 199 153 270M180 199 208 270M176 141 139 169 200 164M188 139 218 172 157 157',12,'#a7b29b')
    if mode=='walk':
        return s+line('M180 126 168 195 130 256M168 195 210 227 230 270M179 143 144 175 119 168M179 143 202 173 230 153',12,'#a7b29b')
    if mode=='push':
        return s+line('M180 125 170 194 143 269M170 194 209 269M181 143 237 144M183 154 238 163',12,'#a7b29b')+line('M250 89V270',6)
    return s+line('M180 126V195M180 195 151 268M180 195 209 268M180 144 140 181M180 144 220 181',12,'#a7b29b')

def motif(item):
    title=item['title'].lower(); family=item['family'].lower(); kind=item['kind']; sense=item['senses']
    has=lambda *terms:any(t in title for t in terms)
    hint=item.get('illustration_hint')
    if hint and draw(hint,item):return hint
    if has('kugellager'):return 'bearing'
    if has('baoding'):return 'baoding'
    if has('ferrofluid'):return 'ferrofluid'
    if has('filterbrille'):return 'glasses'
    if has('ohrstöpsel'):return 'earplugs'
    if has('bimsstein'):return 'picking-stone'
    if has('linsen','bohnenschale'):return 'grain-bowl'
    if has('atem-anhänger','atemanhänger'):return 'tube-pendant'
    if has('hoodie','t-shirt'):return 'shirt'
    if has('jogger'):return 'trousers'
    if has('scarf','halstuch','taschenschal'):return 'fabric'
    if has('origami'):return 'fold'
    if has('strick','webbrett','worry worm','woll-zopf'):return 'yarn'
    if has('kritzel','wasserfarbe','fingerlabyrinth'):return 'drawing'
    if has('wall-push'):return 'wall'
    if has('handflächen'):return 'palms'
    if has('selbstumarmung'):return 'hug'
    if has('klatschen'):return 'palms'
    if has('tanz'):return 'dance'
    if has('federn'):return 'bounce'
    if has('gehen','pacing'):return 'walk'
    if has('seitwärts','sitzfläche'):return 'sit'
    if has('fußsohlen','barfuß'):return 'feet'
    if has('puls','brustkorb','wärme-kälte'):return 'pulse'
    if has('finger-figur','finger-yoga','tutting'):return 'hands'
    if has('münze über'):return 'coin-hand'
    if kind=='activity' and 'auditory' in sense:return 'voice'
    if has('neutrale vergleichsprobe'):return 'fabric'
    if has('probenbox'):return 'specimens'
    if has('lavendel','kräuter','pflanz','tee-duft','orangenschale','riech','kaffeebohnen'):return 'botanical'
    if has('zedern','treibholz'):return 'wood'
    if has('muschel'):return 'shell'
    if has('tannenzapfen'):return 'pine'
    if has('kaugummi','bonbon','lebensmittel','getränk'):return 'cup' if has('getränk') else 'food'
    if kind=='digital':return 'audio-screen' if has('klang','musik','asmr','sequenc','geräusch') else 'screen'
    if kind=='space':return 'prism' if has('prisma','sonnenfänger') else 'room'
    if has('klangschale','drum','tongue'):return 'bowl'
    if has('kalimba','xylophon'):return 'kalimba'
    if has('regenmacher','rainstick'):return 'rainstick'
    if has('stimmbarer','glöckchen'):return 'tuning'
    if has('kauschlauch','trinkhalm'):return 'tube'
    if has('kaustift','stiftaufsatz','kauspitze','robo','kau-hilfsmittel'):return 'pencil'
    if has('beiß','chew','chewigem'):return 'pendant'
    if has('schaukelstuhl','fußwippe','schaukelhocker'):return 'chair'
    if has('widerstand','yogagurt','theraband','bouncyband','stretch band','body sock','körper-socke'):return 'band'
    if has('swing','hängeschaukel'):return 'swing'
    if has('board','balance','schaukelbrett'):return 'board'
    if has('kissen','decke','sitzsack','muff'):return 'cushion'
    if has('tangle','knotenschlaufe','infinity rope'):return 'tangle'
    if has('cube','würfel','shashibo'):return 'cube'
    if has('spinner','kreisel','gyro','cog','zahnrad','cog'):return 'spinner'
    if has('signet','ringe','ring','fingears'):return 'rings'
    if has('roller','knuckle','möbii','knucklebone'):return 'roller'
    if has('begleri','komboloi','chetki'):return 'beads'
    if has('coin','münze','deadeye','medallion'):return 'coin'
    if has('slider','schieber','schieberegler','tile','piston','hebel'):return 'slider'
    if has('keycap','keyboard','switch','klickzähler','ratschen','encoder'):return 'keys'
    if has('fahrradkette','kettenroll','tracks','chain'):return 'chain'
    if has('magnet','speks','stimagz','dubz'):return 'magnets'
    if has('pop-it','popit','dimple','popping','push-pop'):return 'pop'
    if has('mesh','netzsqueeze','mesh-squeeze'):return 'mesh'
    if has('murmel','marble'):return 'maze'
    if has('spikey','noppen','akupressur','spiky','koosh'):return 'spiky'
    if has('nice cube','squish','needoh','mochi','quallen','erbsen','squeeze','taba','handtrainer'):return 'soft'
    if has('noodle','schlauch','pop tube','pop-tube','raupe'):return 'tube'
    if has('slinky','spiral','cone','pyramide','passthrough','fraktal','mandala','morphslime'):return 'coil'
    if has('drache','dragon','flexi','slug','axolotl','schlange'):return 'flexi'
    if has('stein','stone','kiesel','kork','keramik','kühlplättchen'):return 'stone'
    if has('holz','wood','mokuru','kendama'):return 'wood'
    if has('sand','knete','slime','foam clay','picky'):return 'tray'
    if has('lavalampe','bubbler','tropfenuhr','sensorikflasche','glitzer'):return 'liquid'
    if has('kaleidoskop','moiré','folie','lentikular'):return 'prism'
    if has('pendel','cradle','spinner art','kinetic art'):return 'pendulum'
    if has('lampe','licht','projektor','poi'):return 'light'
    if has('stift','pen','stab','baton'):return 'pencil'
    if has('pin art','pin-art','nagelbild'):return 'pins'
    if has('band','ribbon','satin','schlaufen','kordel','haargummi','scrunchie'):return 'ribbon'
    if has('reißverschluss','zipper'):return 'zipper'
    if has('bürste','pinsel','borsten'):return 'brush'
    if has('schraube'):return 'bolt'
    if has('jojo','jo-jo'):return 'coin'
    if 'textil' in family or 'stoff' in family or has('pad','patch','sticker','stoff','textur','minky','plüsch','velvet','fleece','crinkle'):return 'fabric'
    return {'tactile':'fabric','proprioceptive':'band','vestibular':'board','visual':'prism','auditory':'voice','olfactory':'botanical','oral':'pendant','interoceptive':'pulse'}.get(sense[0] if sense else '', 'stone')

def draw(name,item):
    if name=='leg-rest':return rect(74,244,218,18,6,'#9ba98e')+circle(105,212,18,'#a7b29b')+line('M128 229H190L210 183H268',15,'#a7b29b')+rect(218,197,65,47,9,'#b9c5ad')+line('M137 217 172 232',11,'#a7b29b')
    if name=='arm-stroke':return person('hug')+line('M226 151 218 185m-6-10 6 10 9-5',3,'#d1dac8')
    if name=='palming':return circle(180,166,61,'#b2bea7',stroke='#7b8d6d',stroke_width=3)+line('M154 176q10 9 20 0M191 176q10 9 20 0',3,'#7b8d6d')+group(hand(.41,0,0),'translate(83 89) rotate(-16 60 80)')+group(hand(.41,0,0),'translate(278 89) scale(-1 1) rotate(-16 60 80)')
    if name=='bearing':return circle(180,180,94,'#a6b1a0',stroke='#76846d',stroke_width=5)+circle(180,180,67,'#d8ded0')+''.join(circle(180+68*__import__('math').cos(k*__import__('math').pi/4),180+68*__import__('math').sin(k*__import__('math').pi/4),12,'#9ba992',stroke='#6f7f64',stroke_width=2) for k in range(8))+circle(180,180,46,'#e4e6dd',stroke='#819476',stroke_width=12)
    if name=='baoding':return circle(137,178,57,'#9cad8e',stroke='#7d8b71',stroke_width=3)+circle(224,215,57,'#b8c5ad',stroke='#7d8b71',stroke_width=3)+line('M108 158Q123 131 148 132M194 197Q207 171 233 171',6,'#dce2d3')
    if name=='ferrofluid':return rect(113,95,137,185,17,'#d3dace')+rect(109,83,145,20,5,'#829372')+path('M128 238 140 205 151 234 164 184 177 232 191 172 205 233 219 196 237 239Z',fill='#687961')+rect(266,141,25,84,6,'#92a384')+line('M265 161 250 165M264 202 250 199',2,'#a8b69d')
    if name=='glasses':return path('M78 151Q114 135 160 151L164 198Q123 228 86 198ZM197 151Q242 136 278 151L270 198Q231 226 191 198Z',fill='#b5a2b4',stroke='#786b7c',stroke_width=6)+line('M164 161Q180 150 196 161M78 152 62 139M278 152 294 139',6,'#786b7c')
    if name=='earplugs':return circle(136,166,39,'none',stroke='#8b9d7e',stroke_width=19)+circle(224,216,39,'none',stroke='#a5b598',stroke_width=19)+rect(117,188,35,47,13,'#7b8f6b')+rect(212,142,35,47,13,'#91a381')
    if name=='picking-stone':return path('M101 143Q122 89 209 113Q267 122 260 196Q259 250 181 262Q103 260 94 207Z',fill='#a4b096',stroke='#7d8b71',stroke_width=3)+''.join(circle(122+(k%4)*31,148+(k//4)*32,6+(k%3),'#7f8f71') for k in range(12))+line('M224 157Q248 127 263 102',7,'#c4cfb8')
    if name=='grain-bowl':return path('M91 165Q106 266 180 270Q255 265 270 165Z',fill='#99aa89')+'<ellipse cx="180" cy="164" rx="89" ry="33" fill="#c8d1bd"/>'+''.join(circle(112+(k%8)*19,149+(k//8)*15,5,'#81946f') for k in range(24))
    if name=='tube-pendant':return path('M161 151C82 44 281 44 202 151',fill='none',stroke='#7f8f71',stroke_width=4)+rect(164,144,36,131,12,'#a5b497')+line('M173 158V259',3,'#d5ddcb')
    seed=int(hashlib.sha256(item['id'].encode()).hexdigest()[:8],16)
    shift=seed%7-3
    if name=='tangle':
        d='M104 228C47 175 85 91 144 114C211 140 110 225 186 249C254 270 296 195 248 158C213 130 168 166 194 196C227 234 267 131 224 103'
        return line(d,27,'#778a73')+line(d,13,'#aebba2')
    if name=='cube':return path('M106 129 186 86 260 131 181 177Z',fill='#bac3ac')+path('M106 129V224L181 271V177Z',fill='#89977e')+path('M181 177 260 131V224L181 271Z',fill='#65745c')+line('M145 108 219 153V248M222 107 145 154V248M106 178 181 224 260 177',2,'#e0e4d6')
    if name=='spinner':return group(path('M166 147C126 118 118 86 139 74C164 56 193 83 192 120C239 100 267 116 267 140C267 169 235 182 204 163C219 204 207 232 182 233C155 235 139 202 159 176C118 181 91 159 101 138C112 116 137 121 166 147Z',fill='#95a38a',stroke='#63725b',stroke_width=3)+circle(179,150,24,'#d5d9cd')+circle(179,150,12,'#738168'),'translate(0 22)')
    if name in ('rings','coil'):
        return ''.join(f'<ellipse cx="{153+k*15}" cy="{169+k*8}" rx="{63-k*3}" ry="{81-k*2}" transform="rotate({-32+k*12} {153+k*15} {169+k*8})" fill="none" stroke="{["#819074","#b8c1ac","#67765d"][k%3]}" stroke-width="{10 if name=="rings" else 5}"/>' for k in range(3 if name=='rings' else 6))
    if name=='roller':return group(rect(117,99,50,164,25,'#b7beb0')+rect(177,99,50,164,25,'#87947c')+line('M167 115H179M167 247H179',11,'#6d7a63')+line('M131 121V238M191 121V238',3,'#d8ddd1'),'rotate(-23 180 180)')
    if name=='beads':return line('M116 126C195 100 220 183 244 233',5,'#798270')+circle(113,127,26,'#aeb99f')+circle(245,234,26,'#7c8a71')+circle(113,127,6,'#65735a')+circle(245,234,6,'#d1d7c8')
    if name=='coin':return '<ellipse cx="181" cy="184" rx="78" ry="70" fill="#839179"/>'+circle(176,174,73,'#b4bca9')+circle(176,174,60,'none',stroke='#7d8b70',stroke_width=3)+circle(176,174,42,'none',stroke='#d6dccc',stroke_width=2)+line('M145 174H207',3,'#9ca78f')
    if name=='slider':return group(rect(105,123,150,116,25,'#7f8b75')+rect(101,99,150,116,25,'#b2bba6')+rect(118,117,114,79,15,'#94a286')+line('M132 136H218M132 150H218M132 164H218M132 178H218',3,'#c8d0bc'),'rotate(-20 180 180)')
    if name=='keys':return rect(95,125,170,118,15,'#828e78')+''.join(rect(108+c*50,138+r*48,40,39,6,'#bcc5b0') for c in range(3) for r in range(2))
    if name=='chain':return ''.join(group(rect(105+k*25,135+(k%2)*35,48,66,22,'none')+f'<rect x="{105+k*25}" y="{135+(k%2)*35}" width="48" height="66" rx="22" fill="none" stroke="#87957a" stroke-width="12"/>') for k in range(5))
    if name=='magnets':return ''.join(rect(100+(k%3)*56,120+(k//3)*70,42,55,18,['#87967c','#b1bba6','#69795e'][k%3]) for k in range(6))
    if name=='pop':return rect(89,90,184,184,22,'#a4b297')+''.join(circle(122+x*59,123+y*59,22,'#7a8b6c')+circle(119+x*59,119+y*59,15,'#b4c1a7') for x in range(3) for y in range(3))
    if name=='mesh':return circle(180,180,77,'#a3b391')+''.join(f'<ellipse cx="180" cy="180" rx="{r}" ry="77" fill="none" stroke="#67765d" stroke-width="3"/>' for r in [22,49,75])+line('M107 156Q180 187 253 156M107 202Q180 233 253 202',3,'#67765d')
    if name=='maze':return rect(95,90,170,180,20,'#b8bfae')+line('M126 116H236V153H149V191H231V236H126V192',16,'#e0e4d8')+circle(198,153,13,'#74836a')
    if name=='spiky':return circle(180,183,69,'#b6c0aa')+''.join(line(f'M{112+x*27} {130+y*26}l-4 -12',6,'#77886b') for x in range(6) for y in range(5) if (x-2.5)**2+(y-2)**2<7)
    if name=='soft':return path('M101 155Q98 104 151 101L219 105Q263 106 267 160L263 222Q263 262 218 267L146 260Q101 261 99 218Z',fill='#a3b397')+path('M116 145Q121 118 153 119H212',fill='none',stroke='#ced8c1',stroke_width=12,stroke_linecap='round')
    if name=='shirt':return path('M141 98 113 113 78 161 114 184 134 159V267H228V159L249 184 285 161 249 113 219 98Q180 137 141 98Z',fill='#a6b997',stroke='#7d8b71',stroke_width=3)+line('M151 219H211V249H151ZM155 111Q180 149 206 111',3,'#c4ccb7')
    if name=='trousers':return path('M128 93H233L244 276H192L180 163 167 276H116Z',fill='#a6b997',stroke='#7d8b71',stroke_width=3)+line('M130 112H230M142 119 134 153M216 119 225 153M177 97V135',3,'#c4ccb7')
    if name=='tube':return line('M108 110C232 76 79 239 199 254C291 264 229 146 263 123',22,'#8f9f82')+line('M108 110C232 76 79 239 199 254C291 264 229 146 263 123',9,'#b3c1a7')
    if name=='flexi':return ''.join(circle(93+k*25,180+int(35*__import__('math').sin(k/1.5)),18+(k//4),'#8b9c7e')+line(f'M{93+k*25} {168+int(35*__import__("math").sin(k/1.5))}l0 20',2,'#c6d0bb') for k in range(8))
    if name=='stone':return path('M101 168C108 109 184 91 230 113C281 139 280 198 244 233C195 281 100 252 96 213Z',fill='#a6afa0')+path('M116 165C139 122 199 116 228 136',fill='none',stroke='#ced4c7',stroke_width=10,stroke_linecap='round')+line('M154 213Q182 230 214 212',3,'#8a9681')
    if name=='wood':return path('M102 137Q100 105 132 99L219 116Q262 127 254 166L233 239Q224 265 190 253L110 222Q89 213 95 184Z',fill='#b7ad91')+line('M127 122Q172 155 223 137M117 151Q165 181 241 164M112 181Q167 217 230 193M122 207Q171 230 217 223',3,'#8d8c71')
    if name=='tray':return rect(86,114,190,135,20,'#8c9781')+rect(94,108,174,127,17,'#c6ccba')+line('M116 141C135 167 193 111 240 145M114 170C151 195 210 149 245 178M119 200Q188 225 234 203',7,'#a0ae91')
    if name=='liquid':return path('M136 91H225V268H136Z',fill='#cad2c0',stroke='#7d8b71',stroke_width=5)+path('M140 182C169 164 185 214 221 177V265H140Z',fill='#99aa89')+circle(174,139,19,'#9fad91')+circle(195,214,24,'#bdc9af')+rect(129,80,103,14,4,'#7e8c71')+rect(129,267,103,14,4,'#7e8c71')
    if name=='prism':return path('M178 82 268 243 89 243Z',fill='#bdc7b2',stroke='#78896c',stroke_width=4)+line('M178 82 181 215 268 243M89 243 181 215',3,'#8f9e81')+line('M67 157H164M213 165 290 139M213 179 290 179M213 191 290 223',4,'#aebc9e')
    if name=='pendulum':return line('M87 268V108H273V268M109 108V208M156 108V208M203 108V208M250 108V208',4,'#819073')+''.join(circle(x,219,22,'#a8b49b') for x in [109,156,203,250])
    if name=='light':return rect(144,240,75,27,8,'#8b987f')+path('M181 93 128 243H234Z',fill='#b4c1a6')+''.join(line(f'M181 113 {130+x*18} 240',2,'#dce2d3') for x in range(6))
    if name=='pencil':return group(rect(165,77,24,216,5,'#aaaf98')+rect(157,91,40,76,8,'#819575')+line('M169 108V148M183 108V148',3,'#b9c6ac')+path('M165 291 177 313 189 291Z',fill='#78836b'),'rotate(25 180 180)')
    if name=='pins':return rect(96,109,171,143,12,'#809070')+''.join(circle(112+x*21,125+y*21,5+(1 if 2<x<5 and 1<y<5 else 0),'#c3cbb8') for x in range(7) for y in range(6))
    if name=='ribbon':return line('M143 91C253 83 85 245 168 264C253 283 187 170 235 142',22,'#a5b597')+line('M146 95C237 97 94 238 168 259',3,'#d1dcc5')+circle(143,92,16,'none',stroke='#758569',stroke_width=6)
    if name=='zipper':return rect(101,86,159,198,10,'#a7b29c')+line('M177 99V270M187 99V270',4,'#66765c')+''.join(line(f'M174 {113+k*13}H190',4,'#d2d8c9') for k in range(12))+rect(171,143,22,39,7,'#7d8c70')
    if name=='brush':return rect(112,126,141,27,8,'#aaa88a')+''.join(line(f'M{120+x*8} 153v{58+(x%3)*5}',4,'#7f8d72') for x in range(16))
    if name=='bolt':return group(rect(169,91,28,181,5,'#9da991')+''.join(line(f'M169 {105+k*12}l28 -8',3,'#d0d7c5') for k in range(12))+rect(135,162,96,31,7,'#7e8c72')+path('M136 163 114 130 140 129 166 164M198 164 224 129 248 133 232 164Z',fill='#8b997e'),'rotate(30 180 180)')
    if name=='fabric':return path('M93 123 235 95 270 238 126 269Z',fill='#a8b49b')+''.join(line(f'M{102+k*12} {125-k*2}l32 135',1.5,'#829273') for k in range(12))+''.join(line(f'M{101+k*3} {132+k*12}l140 -29',1.5,'#bec9b3') for k in range(11))
    if name=='cushion':return path('M102 116Q178 137 256 116Q237 180 257 251Q180 233 102 251Q122 180 102 116Z',fill='#a9b49c',stroke='#7e8f70',stroke_width=3)+line('M116 130Q179 148 242 130M116 236Q181 221 243 236',2,'#d0d8c5')
    if name=='chair':return line('M124 102V191H227V109M130 191 112 265M218 191 239 265',9,'#829372')+line('M98 263Q181 297 254 260',6,'#6f805f')+rect(126,177,99,18,6,'#b7c0aa')
    if name=='band':return path('M104 112C32 154 106 295 177 242L258 179C318 130 239 51 184 97L104 160',fill='none',stroke='#9aaa8a',stroke_width=25,stroke_linecap='round')+line('M104 112C32 154 106 295 177 242L258 179',3,'#c7d1ba')
    if name=='board':return path('M76 193Q180 242 287 189L275 207Q180 265 86 211Z',fill='#9ea88e')+line('M83 190Q181 237 280 187',5,'#c4ccba')+circle(184,242,26,'#89957b')
    if name=='swing':return line('M112 66V188M248 66V188',4,'#87947a')+path('M112 183Q180 277 248 183L225 246Q180 292 135 246Z',fill='#b0bea2')+line('M112 183Q180 240 248 183',6,'#81916f')
    if name=='bowl':return path('M95 155Q111 263 181 265Q254 264 270 155Z',fill='#9eaa8d')+'<ellipse cx="182" cy="154" rx="87" ry="26" fill="#c4ccb7" stroke="#7b8b6b" stroke-width="4"/>'+line('M238 93 286 232',13,'#868a6f')
    if name=='kalimba':return rect(113,96,140,183,22,'#b2ac8d')+circle(183,202,25,'#7c8569')+''.join(line(f'M{136+k*15} 120v{85-abs(3-k)*13}',8,'#d0d3c5') for k in range(7))+line('M122 135H242',7,'#7d866b')
    if name=='rainstick':return group(rect(147,82,68,208,12,'#b4bda6')+''.join(circle(161+(k%3)*18,105+k*10,3,'#7c8d6d') for k in range(17))+rect(142,80,78,18,5,'#8d9c7e')+rect(142,277,78,18,5,'#8d9c7e'),'rotate(22 180 180)')
    if name=='tuning':return line('M180 269V181M145 96V150Q145 183 180 183Q215 183 215 150V96',9,'#97a58a')+line('M119 106Q105 130 119 154M240 106Q254 130 240 154',3,'#b3bfa6')
    if name=='pendant':return path('M147 158C60 31 290 31 211 158',fill='none',stroke='#7e8f70',stroke_width=4)+rect(142,146,76,118,20,'#a6b69a')+circle(181,166,8,'#718461')+''.join(circle(160+x*20,199+y*20,5,'#c9d4bd') for x in range(3) for y in range(3))
    if name=='botanical':return rect(118,135,126,136,17,'#c0cbb4')+rect(112,119,138,23,5,'#899979')+line('M180 253V160M180 198 156 181M181 222 209 199',4,'#7f916c')+path('M177 188Q139 187 143 160Q174 157 177 188M183 217Q222 222 222 187Q188 187 183 217Z',fill='#91a47b')
    if name=='specimens':return rect(86,118,190,130,12,'#a7b497')+rect(95,127,172,112,7,'#ced5c4')+line('M151 128V238M210 128V238',3,'#8d9b80')+circle(123,183,19,'#8b997e')+rect(165,158,30,51,5,'#a49b7b')+path('M223 156Q252 149 253 184Q257 209 225 210Z',fill='#95a786')
    if name=='shell':return path('M180 254C140 223 81 209 96 158C112 103 246 103 264 157C283 207 216 231 180 254Z',fill='#b4baa6')+''.join(line(f'M180 252Q{105+k*22} 200 {104+k*24} 146',3,'#839279') for k in range(7))
    if name=='pine':return ''.join(path(f'M180 {93+y*29}Q{102+y*5} {112+y*29} 180 {145+y*29}Q{255-y*5} {112+y*29} 180 {93+y*29}Z',fill=['#a8af95','#8d9a7c'][y%2]) for y in range(5))
    if name=='cup':return path('M116 107H234L224 260H128Z',fill='#bfccb3',stroke='#819571',stroke_width=4)+path('M127 176Q181 192 230 174L224 257H133Z',fill='#95ac83')+line('M144 120 140 159',4,'#e4e9de')
    if name=='food':return rect(103,126,155,112,15,'#c1c8b3')+''.join(rect(118+x*42,142+y*37,32,27,7,['#99a98a','#aebc9e'][x%2]) for x in range(3) for y in range(2))
    if name=='screen' or name=='audio-screen':
        interior=''.join(line(f'M{114+x*17} 185v{-int(20+26*__import__("math").sin(x*.7))}',7,'#94a783') for x in range(9)) if name=='audio-screen' else line('M103 182C138 105 177 242 215 163S253 148 260 174M103 199C138 122 177 259 215 180S253 165 260 191',3,'#9eaf8d')
        return rect(83,100,197,149,10,'#687b5e')+rect(93,110,177,129,5,'#d2dac8')+interior+line('M180 249V272M140 273H220',6,'#7e9070')
    if name=='room':return line('M92 252V106L188 73 270 107V252M188 73V209M92 252 188 209 270 252',3,'#87977b')+rect(124,213,110,42,12,'#b0c1a0')+line('M238 113V210M223 210H254',5,'#7a8d6d')+path('M238 102 214 138H263Z',fill='#b7c7a8')
    if name=='fold':return path('M91 139 266 100 227 259 172 196Z',fill='#bdc8b0',stroke='#859775',stroke_width=3)+line('M172 196 266 100M91 139 203 158 227 259',3,'#8f9f80')
    if name=='yarn':return circle(179,186,69,'#aaba98')+''.join(line(f'M{121+k*12} {145-k*2}Q{192+k*8} 195 {146+k*13} 237',3,'#7e926d') for k in range(6))+line('M106 89 244 268M244 92 107 269',6,'#b8af8f')
    if name=='drawing':return path('M99 100 241 87 268 260 118 277Z',fill='#d3d8c8')+line('M158 214C95 162 218 127 225 181S157 231 149 188 194 157 200 180 176 199 175 186',3,'#7e926e')+line('M241 99 187 226',9,'#a9af92')
    if name in ('wall','hug','walk','sit'):return person({'wall':'push','hug':'hug','walk':'walk','sit':'sit'}[name])+ (line('M102 281H265',2,'#b6c2a8') if name!='sit' else '')
    if name=='dance':return circle(180,92,20,'#a7b29b')+line('M180 119 166 193 127 246M166 193 217 239 246 222M179 137 133 149 109 116M181 136 221 117 238 81',12,'#a7b29b')
    if name=='bounce':return person('stand')+line('M119 134V202m-7-10 7 10 7-10M242 205V137m-7 10 7-10 7 10M132 287Q180 304 228 287',3,'#81946f')
    if name=='feet':return line('M113 257H263',3,'#8fa17e')+path('M128 232Q113 192 132 156Q142 140 158 151L164 223Q160 240 143 240Z',fill='#a6b997')+path('M194 232Q180 192 198 156Q211 140 225 151L231 223Q227 240 211 240Z',fill='#a6b997')+line('M131 269v12M158 269v12M207 269v12M230 269v12',3,'#a4b592')
    if name=='pulse':return person('hug')+line('M126 178H157L168 164 180 188 190 173H233',3,'#dce3d2')
    if name=='voice':return path('M166 114Q197 117 202 145L220 167 204 176V200Q202 216 185 216V250H133V132Z',fill='#aabb99')+line('M234 149Q251 167 234 184M250 133Q280 167 250 201',4,'#8b9f79')
    if name=='palms':return hand(.69,-9,16)+group(hand(.69,-9,16),'translate(355 0) scale(-1 1)')+line('M178 121V252',2,'#d3ddc6')
    if name in ('hands','coin-hand'):return hand(.85,24,-3)+(circle(177,123,21,'#d1d9c1',stroke='#879975',stroke_width=3) if name=='coin-hand' else line('M223 123Q252 147 230 174',3,'#8da17c'))
    return ''

def illustration(item):
    name=motif(item); content=draw(name,item)
    # Restrained, reproducible palettes. Natural wood keeps its warmer tones.
    palettes=[(0.58,'#e6ebed'),(0.04,'#eee5df'),(0.77,'#eae6ed'),(0.12,'#eeeade'),(0.34,'#e4e9df')]
    idx=int(hashlib.sha256(item['id'].encode()).hexdigest()[:8],16)%len(palettes)
    hue,bg=palettes[idx]
    if name in ('wood','kalimba'):hue,bg=.10,'#eee8dd'
    if name=='botanical':hue,bg=.30,'#e9ebdf'
    if name=='glasses':hue,bg=.94,'#eee5e8'
    if name in ('hands','palms','coin-hand','voice'):hue,bg=.06,'#eee6df'
    def colour(match):
        value=match.group(0)
        rgb=tuple(int(value[k:k+2],16)/255 for k in (1,3,5))
        _,light,_=colorsys.rgb_to_hls(*rgb)
        # Preserve tonal contrast and use a small saturation range.
        new=colorsys.hls_to_rgb(hue,max(.32,min(.86,light-.025)),.21)
        return '#'+''.join(f'{round(v*255):02x}' for v in new)
    content=re.sub(r'#[0-9a-fA-F]{6}',colour,content)
    clay=colour(re.match(r'#[0-9a-fA-F]{6}','#a4b299'));ink=colour(re.match(r'#[0-9a-fA-F]{6}','#7c8e6e'))
    svg='<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 360 360" style="--clay:'+clay+';--ink:'+ink+'"><title>'+html.escape('Illustration: '+item['title'])+'</title><rect width="360" height="360" fill="'+bg+'"/>'+content+'</svg>'
    return name,svg
