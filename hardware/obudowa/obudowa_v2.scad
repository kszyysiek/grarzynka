// v2: styl "ramka + płyta + garb" (jak Raspberry_PI_7_Inch_Screen)
// Ekran OSOYOO 7" DSI, Pi 5 + Waveshare UPS HAT (E) 4x21700, 5 modułów radiowych.
// part: "preview" | "frame" | "plate" | "hump"
part = "preview";
explode = 0;        // rozsunięcie części w podglądzie
show_comp = true;
show_hump = true;   // ukryj garb, żeby zobaczyć wnętrze

$fn = 36;
// ---------- ekran ----------
dW = 192.96; dH = 110.76;
dT = 14;            // szkło+panel (10) + PCB z tyłu ekranu (~4)
aaL = 19.56; aaT = 11.56; aaB = 13.56;
// ---------- ramka ----------
fw  = 5;            // ścianka ramki (śruby M2.5 od tyłu)
lip = 2;            // rant nachodzący na czarną ramkę szkła
lipT = 1.6;
fW = dW + 0.6 + 2*fw;  fH = dH + 0.6 + 2*fw;  fD = lipT + dT;
fr = 4;
// ---------- tył ekranu (wg rysunku OSOYOO, widok od tyłu: x od lewej, y od góry) ----------
disp_m3   = [[32.0,20.9],[160.3,20.9],[32.0,87.0],[160.3,87.0]];   // otwory montażowe M3 ekranu
disp_fpc  = [82, 22, 31, 21];    // złącze taśmy DSI (x,y,w,h) z zapasem
disp_pwr  = [52, 38, 20, 22];    // złącze zasilania 5V/GND (2-pin) + przewody
disp_usb  = [56, 86, 28, 14];    // micro-USB ekranu
rail_h    = 3;                   // kanał pod pakietem na taśmę i przewody
function dpos(x,y) = [fw+0.3+x, fw+0.3+dH-y];
// ---------- płyta ----------
pT = 3;
// ---------- garb ----------
hW = 172; hH = 88; hD = 64; hw = 2.2; hr = 8;
hX = (fW - hW)/2; hY = (fH - hH)/2;          // pozycja garbu na płycie
// wnętrze garbu (lokalne): x 0..hW-2hw, y 0..hH-2hw
// pakiet Pi5+UPS na boku: 88 (x) x 72 (y) x 56 (z)
st = [4, 6, 0]; stS = [88, 72, 56];
// anteny SMA
sma_top   = [[30,"2.4 Zigbee"],[95,"868 LoRa"],[150,"2.4 ESP32"]];   // x na górnej ściance
sma_right = [[68,"433 CC1101"],[22,"2.4 nRF24"]];                    // y na prawej ściance
sma_z = 34;

module rrect(w,h,d,r){ hull() for(x=[r,w-r]) for(y=[r,h-r]) translate([x,y,0]) cylinder(r=r,h=d); }
module rdome(w,h,d,r){ // prostopadłościan z zaokrąglonym dachem
  hull(){ for(x=[r,w-r]) for(y=[r,h-r]){ translate([x,y,0]) cylinder(r=r,h=d-r); translate([x,y,d-r]) sphere(r=r); } }
}
module hexgrid(w,h,d=10,s=6,g=1.6){
  dx = s+g; dy = (s+g)*0.866;
  intersection(){ cube([w,h,d]);
    for(j=[0:ceil(h/dy)]) for(i=[0:ceil(w/dx)]) translate([i*dx+(j%2)*dx/2, j*dy, 0]) rotate(30) cylinder(d=s/0.866,h=d,$fn=6); }
}

// ================= MOCOWANIA =================
// Płytki radiowe nie mają otworów -> dociski: słupek M2.5 przy każdym rogu + podkładka poszerzona M2.5 (Ø8, DIN 9021)
// [x, y, dł. X, szer. Y, wysokość spodu płytki nad płytą] (współrzędne wnętrza garbu)
plate_boards = [ [104, 10, 23, 60, 10],    // LoRa Wireless Stick (pionowo, piny w dół)
                 [133, 12, 28, 55, 10] ];  // ESP32-WROOM-32U DevKit (pionowo, piny w dół)
// płytki podwieszone pod dachem garbu: [x, y, dł. X, szer. Y, odstęp od dachu]
roof_boards  = [ [102,  8, 58, 20, 4],     // Sonoff ZBDongle-E (płytka bez obudowy)
                 [104, 32, 28, 15, 4],     // CC1101
                 [104, 54, 41, 16, 4] ];   // nRF24L01 PA+LNA
cp_off = 2.6;  cp_d = 5;  pcb = 1.6;
function corner_posts(b) = b[2] > b[3]
  ? [[b[0]-cp_off,b[1]],[b[0]-cp_off,b[1]+b[3]],[b[0]+b[2]+cp_off,b[1]],[b[0]+b[2]+cp_off,b[1]+b[3]]]
  : [[b[0],b[1]-cp_off],[b[0]+b[2],b[1]-cp_off],[b[0],b[1]+b[3]+cp_off],[b[0]+b[2],b[1]+b[3]+cp_off]];
function corner_pads(b) = [[b[0],b[1]],[b[0]+b[2]-3,b[1]],[b[0],b[1]+b[3]-3],[b[0]+b[2]-3,b[1]+b[3]-3]];
// opaski (pałąki) na pakiet Pi+UPS: [noga x0, noga x1, stopka x0, stopka x1] w układzie pakietu
straps = [[10,16, 2,10], [72,78, 78,86]];
strap_post_h = 10;
function strap_holes() = [ for(t=straps) for(y=[-2.9, stS[1]+2.8]) [st[0]+(t[2]+t[3])/2, st[1]+y] ];
// ucha garbu (śruby M3 od zewnątrz w wkładki w płycie)
ear_x = [22, 86, 150]; ear_l = 9; ear_w = 11; ear_z = 5; ear_t = 4;
function ear_pos() = [ for(x=ear_x) for(y=[-ear_l/2, hH+ear_l/2]) [x,y] ];

// ================= RAMKA =================
frame_screws = [[fw/2+0.3,fH*0.25],[fw/2+0.3,fH*0.75],[fW-fw/2-0.3,fH*0.25],[fW-fw/2-0.3,fH*0.75],
                [fW*0.2,fw/2+0.3],[fW*0.4,fw/2+0.3],[fW*0.6,fw/2+0.3],[fW*0.8,fw/2+0.3],
                [fW*0.2,fH-fw/2-0.3],[fW*0.4,fH-fw/2-0.3],[fW*0.6,fH-fw/2-0.3],[fW*0.8,fH-fw/2-0.3]];
module frame(){
  difference(){
    rrect(fW,fH,fD,fr);
    translate([fw,fw,lipT]) cube([dW+0.6,dH+0.6,fD]);                 // gniazdo ekranu
    translate([fw+lip,fw+lip,-1]) cube([dW+0.6-2*lip,dH+0.6-2*lip,lipT+2]); // okno
    for(p=frame_screws) translate([p[0],p[1],fD-10]) cylinder(d=2.2,h=11); // M2.5 pilot
    // wycięcie na taśmę FPC ekranu (góra, środek) – luz przy PCB
  }
}

// ================= PŁYTA =================
module plate(){
  difference(){
    union(){
      rrect(fW,fH,pT,fr);
      // kołyska pod pakiet Pi+UPS
      translate([hX+hw+st[0]-2, hY+hw+st[1]-2, pT]) difference(){
        cube([stS[0]+4, stS[1]+4, 8]);
        translate([2,2,-1]) cube([stS[0]+0.4, stS[1]+0.4, 10]);
        translate([10,-1,-1]) cube([stS[0]-16, stS[1]+6, 12]);  // przejścia na taśmę/przewody
      }
      // szyny pod pakietem (kanał 3 mm na taśmę DSI i przewody zasilania)
      for(dy=[6, stS[1]-10]) translate([hX+hw+st[0], hY+hw+st[1]+dy, pT]) cube([stS[0], 4, rail_h]);
      translate([hX+hw, hY+hw, pT]) {
        // słupki pod opaski pakietu
        for(t=straps) for(b=[[-5.4,-0.2],[stS[1]+0.2,stS[1]+5.4]])
          translate([st[0]+t[2], st[1]+b[0], 0]) cube([t[3]-t[2], b[1]-b[0], strap_post_h]);
        // dociski płytek radiowych
        for(b=plate_boards){
          for(p=corner_posts(b)) translate([p[0],p[1],0]) cylinder(d=cp_d, h=b[4]+pcb);
          for(p=corner_pads(b)) translate([p[0],p[1],0]) cube([3,3,b[4]]);
        }
      }
      // słupki pod wkładki M3 garbu
      for(e=ear_pos()) translate([hX+e[0], hY+e[1], pT]) cylinder(d=8, h=ear_z);
    }
    // otwory: opaski M2.5, dociski M2.5, wkładki M3 garbu
    translate([hX+hw, hY+hw, pT]) {
      for(h=strap_holes()) translate([h[0],h[1],strap_post_h-8]) cylinder(d=2.2,h=9);
      for(b=plate_boards) for(p=corner_posts(b)) translate([p[0],p[1],b[4]+pcb-8]) cylinder(d=2.2,h=9);
    }
    for(e=ear_pos()) translate([hX+e[0], hY+e[1], pT+ear_z-5.5]) cylinder(d=4.2, h=6);
    // śruby do ramki (stożkowe M2.5)
    for(p=frame_screws) translate([p[0],p[1],-1]){ cylinder(d=2.8,h=pT+2); translate([0,0,pT-0.4]) cylinder(d1=2.8,d2=5.4,h=1.41); }
    // okno nad złączem taśmy DSI ekranu
    let(c=dpos(disp_fpc[0],disp_fpc[1]+disp_fpc[3])) translate([c[0],c[1],-1]) rrect(disp_fpc[2],disp_fpc[3],pT+2,2);
    // okno nad złączem zasilania ekranu
    let(c=dpos(disp_pwr[0],disp_pwr[1]+disp_pwr[3])) translate([c[0],c[1],-1]) rrect(disp_pwr[2],disp_pwr[3],pT+2,2);
    // okno nad micro-USB ekranu
    let(c=dpos(disp_usb[0],disp_usb[1]+disp_usb[3])) translate([c[0],c[1],-1]) rrect(disp_usb[2],disp_usb[3],pT+2,2);
    // śruby M3 do otworów ekranu (łeb stożkowy od strony garbu)
    for(h=disp_m3) let(c=dpos(h[0],h[1])) translate([c[0],c[1],-1]){ cylinder(d=3.4,h=pT+2); translate([0,0,pT+1-1.6]) cylinder(d1=3.4,d2=6.6,h=1.61); }
  }
}

// ================= GARB =================
module hump(){
  iW = hW-2*hw; iH = hH-2*hw;
  difference(){
    rdome(hW,hH,hD,hr);
    translate([hw,hw,-0.01]) rdome(iW,iH,hD-hw,hr-hw);
    // lewa ścianka: USB-A x4 + Ethernet Pi 5
    translate([-1, hw+st[1]+48, hw+3]) rrect(hw+2+20, 22, 51, 2) ;
    // dach: okno na porty UPS (USB-C, USB-A 5V OUT, włącznik)
    translate([hw+st[0]+14, hw+st[1]+38, hD-hw-1]) rrect(62, 12, hw+12, 2);
    // dach: kratka heksagonalna nad chłodzeniem Pi
    translate([hw+st[0]+8, hw+st[1]+54, hD-hw-12]) hexgrid(72, 20, 20);
    // prawa ścianka: szczeliny wentylacyjne przy radiach
    for(i=[0:4]) translate([hW-hw-1, hw+30+i*7, 8]) rrect(hw+2, 3.5, 18, 1.7);
    // górna ścianka: szczeliny wentylacyjne przy Pi
    for(i=[0:5]) translate([hw+st[0]+42+i*7, hH-hw-1, 10]) rrect(3.5, hw+2, 26, 1.7);
    // SMA 6.6 mm
    for(s=sma_top)   translate([hw+s[0], hH-hw-1, sma_z]) rotate([-90,0,0]) cylinder(d=6.6,h=hw+2);
    for(s=sma_right) translate([hW-hw-1, hw+s[0], sma_z]) rotate([0,90,0]) cylinder(d=6.6,h=hw+2);
  }
  // ucha do przykręcenia od zewnątrz (M3 w wkładki w płycie), z klinem pod druk
  for(e=ear_pos()) translate([e[0], e[1], 0]) {
    sgn = e[1] < 0 ? -1 : 1;
    difference(){
      union(){
        translate([-ear_w/2, -ear_l/2 - (sgn>0 ? 1.5 : 0), ear_z]) cube([ear_w, ear_l+1.5, ear_t]);
        // klin
        translate([-ear_w/2, sgn<0 ? ear_l/2+1.5 : -ear_l/2-1.5, ear_z+ear_t-0.01]) rotate([0,90,0])
          linear_extrude(ear_w) polygon(sgn<0 ? [[0,0],[0,-ear_l],[-ear_l,0]] : [[0,0],[0,ear_l],[-ear_l,0]]);
      }
      translate([0,0,ear_z-1]) cylinder(d=3.4, h=40);
      translate([0,0,ear_z+ear_t]) cylinder(d=6.5, h=40);   // miejsce na łeb
    }
  }
  // płytki podwieszone pod dachem: słupki M2.5 + podkładki
  translate([hw,hw,0]) for(b=roof_boards){
    top = hD-hw;
    for(p=corner_posts(b)) translate([p[0],p[1],top-b[4]-pcb]) difference(){
      cylinder(d=cp_d, h=b[4]+pcb+0.5); translate([0,0,-1]) cylinder(d=2.2,h=8); }
    for(p=corner_pads(b)) translate([p[0],p[1],top-b[4]]) cube([3,3,b[4]+0.5]);
  }
  // docisk pakietu od dachu
  translate([hw+st[0]+20, hw+st[1]+20, rail_h+stS[2]+0.5]) cube([50,4,hD-hw-rail_h-stS[2]]);
}

// ================= OPASKA PAKIETU (drukuj 2 szt.) =================
module strap(i=0){
  t = straps[i]; topz = rail_h+stS[2]+0.2; th = 1.8;
  difference(){
    union(){
      translate([t[0], -2.2, topz]) cube([t[1]-t[0], stS[1]+4.4, th]);            // belka
      for(y=[-2.2, stS[1]+0.2]) translate([t[0], y, strap_post_h]) cube([t[1]-t[0], 2, topz+th-strap_post_h]); // nogi
      for(b=[[-5.4,-0.2],[stS[1]+0.2,stS[1]+5.4]])                                  // stopki
        translate([min(t[0],t[2]), b[0], strap_post_h]) cube([max(t[1],t[3])-min(t[0],t[2]), b[1]-b[0], 3]);
    }
    for(y=[-2.9, stS[1]+2.8]) translate([(t[2]+t[3])/2, y, strap_post_h-1]) cylinder(d=2.8,h=5);
  }
}

// ================= ELEKTRONIKA (podgląd) =================
module electronics(){
  // ekran
  color([0.06,0.06,0.07]) translate([fw+0.3,fw+0.3,lipT]) cube([dW,dH,10]);
  color([0.25,0.5,0.9]) translate([fw+0.3+aaL,fw+0.3+aaB,lipT-0.2]) cube([dW-2*aaL,dH-aaT-aaB,0.4]);
  color([0.15,0.15,0.15]) translate([fw+40,fw+20,lipT+10]) cube([110,70,3]);
  // pakiet (lokalnie w garbie)
  translate([hX+hw, hY+hw, fD+pT+explode]) {
    translate(st+[0,0,rail_h]){
      color([0.12,0.12,0.12]) cube([88,44,56]);
      for(i=[0,1]) for(j=[0,1]) color([0.85,0.3,0.1]) translate([9,11+i*22,12+j*22]) rotate([0,90,0]) cylinder(d=21,h=70);
      color([0.1,0.3,0.7]) translate([0,44,0]) cube([88,1.6,56]);
      color([0.7,0.7,0.7]) translate([30,45.6,44]) cube([15,7,12]);
      color([0.1,0.55,0.25]) translate([1,54,0]) cube([85,1.6,56]);
      color([0.6,0.6,0.62]) translate([1,55.6,2]) cube([21,16,52]);
      color([0.3,0.3,0.32]) translate([30,55.6,12]) cube([40,9,30]);
    }
    // opaski
    color([0.95,0.6,0.1]) for(i=[0,1]) translate(st) strap(i);
    // radia na płycie
    cols = [[0.1,0.1,0.1],[0.15,0.15,0.2]];
    for(i=[0:len(plate_boards)-1]) let(b=plate_boards[i]) {
      color(cols[i]) translate([b[0],b[1],b[4]]) cube([b[2],b[3],pcb+6]);
      color([0.8,0.8,0.8]) for(p=corner_posts(b)) translate([p[0],p[1],b[4]+pcb]) cylinder(d=8,h=0.8);
    }
    // radia pod dachem
    rcols = [[0.1,0.55,0.2],[0.1,0.35,0.6],[0.1,0.1,0.1]];
    for(i=[0:len(roof_boards)-1]) let(b=roof_boards[i]) {
      color(rcols[i]) translate([b[0],b[1],hD-hw-b[4]-pcb-4]) cube([b[2],b[3],pcb+4]);
    }
  }
  // anteny
  translate([hX, hY, fD+pT+2*explode]) {
    for(s=sma_top) translate([hw+s[0], hH, sma_z]) rotate([-90,0,0]) { color("gold") cylinder(d=6.3,h=8); color([0.1,0.1,0.1]) translate([0,0,8]) cylinder(d=9,h=s[1]=="868 LoRa"?95:75); }
    for(s=sma_right) translate([hW, hw+s[0], sma_z]) rotate([0,90,0]) { color("gold") cylinder(d=6.3,h=8); color([0.1,0.1,0.1]) translate([0,0,8]) cylinder(d=s[1]=="433 CC1101"?10:9,h=s[1]=="433 CC1101"?100:75); }
  }
}

// ================= PODZIAŁ NA 2 CZĘŚCI (mniejszy stół) =================
frame_cut = fW/2;     // ramka: cięcie na środku + kołki ustalające
plate_cut = 130;      // płyta: cięcie przesunięte względem ramki + jaskółcze ogony
pin_d = 2.0;          // otwór na kołek z filamentu 1.75 mm (lub pręt 2 mm)
clr = 0.15;           // luz na połączeniu
dt_y = [22, 60, 98];  // pozycje jaskółczych ogonów
module dt_region(extra=0){   // obszar lewej części płyty
  translate([-1,-1,-1]) cube([plate_cut+1+extra, fH+2, 50]);
  for(y=dt_y) translate([plate_cut,y,-1]) linear_extrude(50)
    offset(delta=extra) polygon([[-1,-4],[0,-4],[8,-6.5],[8,6.5],[0,4],[-1,4]]);
}
module frame_pins(){
  for(y=[fw/2+0.3, fH-fw/2-0.3]) translate([frame_cut-8, y, fD/2+lipT/2]) rotate([0,90,0]) cylinder(d=pin_d+0.2, h=16);
}
module frame_L(){ difference(){ intersection(){ frame(); translate([-1,-1,-1]) cube([frame_cut+1, fH+2, 50]); } frame_pins(); } }
module frame_R(){ translate([-frame_cut,0,0]) difference(){ intersection(){ frame(); translate([frame_cut,-1,-1]) cube([fW, fH+2, 50]); } frame_pins(); } }
module plate_L(){ intersection(){ plate(); dt_region(-clr/2); } }
module plate_R(){ translate([-plate_cut,0,0]) difference(){ plate(); dt_region(clr/2); } }

if(part=="frame") frame();
else if(part=="frame_L") frame_L();
else if(part=="frame_R") frame_R();
else if(part=="plate_L") plate_L();
else if(part=="plate_R") plate_R();
else if(part=="strap") strap(0);
else if(part=="plate") plate();
else if(part=="hump") hump();
else rotate([90,0,0]) {
  color([0.93,0.93,0.91]) frame();
  color([0.88,0.88,0.86]) translate([0,0,fD+explode]) plate();
  if(show_hump) color([0.95,0.95,0.93]) translate([hX,hY,fD+pT+2*explode]) hump();
  if(show_comp) electronics();
}
echo(str("Części: ramka L ", frame_cut, " / P ", fW-frame_cut, " ; płyta L ", plate_cut+8, " / P ", fW-plate_cut, " (x ", fH, ")"));
echo(str("Ramka: ", fW, " x ", fH, " x ", fD, " | z płytą: ", fD+pT, " | z garbem: ", fD+pT+hD));
