// Obudowa "tablet": ekran 7" DSI + Pi 5 + UPS HAT (E) 4x21700 + radia
// Wymiary w mm. Ustaw `part` do eksportu STL: "shell", "lid" lub "preview".
part      = "preview";   // "preview" | "shell" | "lid"
show_lid  = true;        // w podglądzie
explode   = 0;           // odsunięcie pokrywy w podglądzie
show_comp = true;        // pokaż elementy elektroniki

t   = 2.5;               // ścianka
// ekran OSOYOO 7"
dW = 192.96; dH = 110.76; dT = 12;
aaL = 19.56; aaT = 11.56; aaB = 13.56;   // ramka do pola aktywnego
// wnętrze
iW = dW + 4;  iH = dH + 4;  iD = dT + 3 + 58 + 3;
oW = iW + 2*t; oH = iH + 2*t; oD = iD + t;   // shell = front + boki
lidT = 3;
r  = 6;                  // zaokrąglenie narożników

// pakiet Pi5 + UPS (stoi na boku: 88 szer., 70 wys., 56 głęb.)
stW = 88; stH = 72; stD = 56;
stX = t + 3; stY = t + 4; stZ = t + dT + 4;

$fn = 40;

module rbox(w,h,d,rr=r){
  hull() for(x=[rr,w-rr]) for(y=[rr,h-rr]) translate([x,y,0]) cylinder(r=rr,h=d);
}

// ---------- SHELL (front z oknem + boki) ----------
sma_x = [24, 62, 108, 146, 184];          // 5x SMA w górnej ściance
sma_lbl = ["868","2.4 ESP","433","2.4 nRF","2.4 ZB"];

module shell(){
  difference(){
    rbox(oW,oH,oD);
    // wnętrze
    translate([t,t,t]) rbox(iW,iH,oD,r-t);
    // okno pola aktywnego
    translate([t+2+aaL, t+2+aaB, -1]) cube([dW-2*aaL, dH-aaT-aaB, t+2]);
    // otwory SMA (6.5 mm) w górnej ściance
    for(x=sma_x) translate([x, oH-t-1, t+dT+30]) rotate([-90,0,0]) cylinder(d=6.6,h=t+2);
    // lewa ścianka: USB-A x2 + USB-A x2 + Ethernet Pi 5 (Pi na górze pakietu)
    translate([-1, stY+stH-22, stZ+4])  cube([t+2, 17, 48]);
    // wentylacja górna nad Pi
    for(i=[0:5]) translate([stX+10+i*12, oH-t-1, stZ+8]) cube([4, t+2, 40]);
    // wentylacja dolna
    for(i=[0:9]) translate([stX+10+i*12, -1, stZ+8]) cube([4, t+2, 40]);
  }
  // słupki pod śruby pokrywy M3 (wkładki 4.2)
  for(p=screw_pos()) translate([p[0],p[1],t]) difference(){
    cylinder(d=9,h=oD-t);
    translate([0,0,oD-t-10]) cylinder(d=4.2,h=11);
  }
  // listwy dociskające ekran
  for(y=[t, oH-t-3]) translate([t+30, y, t+dT+0.3]) cube([iW-60, 3, 3]);
}
function screw_pos() = [[t+5,t+5],[oW-t-5,t+5],[t+5,oH-t-5],[oW-t-5,oH-t-5],[oW/2,t+5],[oW/2,oH-t-5]];

// ---------- LID (tył) ----------
module lid(){
  difference(){
    rbox(oW,oH,lidT);
    for(p=screw_pos()) translate([p[0],p[1],-1]){ cylinder(d=3.4,h=lidT+2); cylinder(d=6.2,h=1.8); }
    // UPS: USB-C, USB-A 5V OUT, włącznik (krawędź UPS skierowana do tyłu)
    translate([stX+8,  stY+44, -1]) rbox(12, 7, lidT+2, 1.5);   // USB-C
    translate([stX+30, stY+42, -1]) rbox(16, 9, lidT+2, 1.5);   // USB-A
    translate([stX+62, stY+43, -1]) rbox(14, 7, lidT+2, 1.5);   // ON/OFF
    // kratka nad chłodzeniem Pi
    for(i=[0:7]) translate([stX+10+i*9, stY+54, -1]) rbox(4, 16, lidT+2, 1.9);
    // kratka nad radiami
    for(i=[0:8]) translate([115+i*9, 20, -1]) rbox(4, 20, lidT+2, 1.9);
  }
  // płyta montażowa radiów po wewnętrznej stronie pokrywy: słupki M2.5
  for(p=radio_posts()) translate([p[0],p[1],-6]) difference(){ cylinder(d=6,h=6); cylinder(d=2.2,h=6); }
}
function radio_posts() = [[108,95],[192,95],[108,58],[192,58],[108,28],[192,28]];

// ---------- ELEKTRONIKA (tylko podgląd) ----------
module comp(c, pos, size, label=""){ color(c) translate(pos) cube(size); }
module electronics(){
  // ekran
  color([0.08,0.08,0.09]) translate([t+2,t+2,t]) cube([dW,dH,dT]);
  color([0.2,0.45,0.9,0.9]) translate([t+2+aaL,t+2+aaB,t-0.2]) cube([dW-2*aaL,dH-aaT-aaB,0.4]);
  // UPS: koszyk 2x2 21700
  color([0.12,0.12,0.12]) translate([stX,stY,stZ]) cube([stW,44,stD]);
  for(i=[0,1]) for(j=[0,1]) color([0.85,0.3,0.1]) translate([stX+9,stY+11+i*22,stZ+12+j*22]) rotate([0,90,0]) cylinder(d=21,h=70);
  // UPS PCB
  color([0.1,0.3,0.7]) translate([stX,stY+44,stZ]) cube([stW,1.6,stD]);
  color([0.75,0.75,0.75]) translate([stX+30,stY+45.6,stZ+stD-14]) cube([15,7,14]);   // USB-A
  // Pi 5
  color([0.1,0.55,0.25]) translate([stX+1,stY+54,stZ]) cube([85,1.6,56]);
  color([0.6,0.6,0.62]) translate([stX+1,stY+55.6,stZ+2]) cube([21,16,52]);           // USB/ETH
  color([0.3,0.3,0.32]) translate([stX+30,stY+55.6,stZ+12]) cube([40,9,30]);          // cooler
  // radia (na płycie przy pokrywie)
  zr = oD - 14;
  comp([0.1,0.1,0.1],  [108, 90, zr], [60, 23, 8]);        // LoRa stick
  comp([0.15,0.15,0.2],[108, 58, zr], [52, 28, 8]);        // ESP32-U
  comp([0.1,0.35,0.6], [168, 62, zr], [28, 15, 6]);        // CC1101
  comp([0.1,0.1,0.1],  [152, 39, zr], [41, 16, 6]);        // nRF24 PA
  comp([0.1,0.55,0.2], [108, 16, zr], [55, 20, 6]);        // Zigbee (bez obudowy)
  // anteny
  for(i=[0:len(sma_x)-1]) translate([sma_x[i], oH, t+dT+30]) rotate([-90,0,0]){
    color("gold") cylinder(d=6.3,h=8);
    color([0.1,0.1,0.1]) translate([0,0,8]) cylinder(d=(i==0||i==2)?10:9, h=(i==2)?105:(i==0?90:75));
  }
}

if(part=="shell") shell();
else if(part=="lid") lid();
else rotate([90,0,0]) {   // w podglądzie: góra = góra
  color([0.92,0.92,0.9]) shell();
  if(show_comp) electronics();
  if(show_lid) color([0.85,0.85,0.83,0.95]) translate([0,0,oD+explode]) lid();
}
echo(str("Wymiary zewn.: ", oW, " x ", oH, " x ", oD+lidT, " mm"));
