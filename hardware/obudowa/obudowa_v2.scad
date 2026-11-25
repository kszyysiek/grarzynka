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
disp_fpc  = [80, 18, 42, 28];    // złącze taśmy DSI (x,y,w,h) z zapasem
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
    }
    // śruby do ramki (stożkowe M2.5)
    for(p=frame_screws) translate([p[0],p[1],-1]){ cylinder(d=2.8,h=pT+2); translate([0,0,pT-0.4]) cylinder(d1=2.8,d2=5.4,h=1.41); }
    // śruby garbu M3 (łeb wpuszczony od strony ekranu)
    for(p=hump_bosses()) translate([hX+p[0],hY+p[1],-1]){ cylinder(d=3.4,h=pT+2); cylinder(d1=6.4,d2=3.4,h=1.5+1); }
    // okno nad złączem taśmy DSI ekranu
    let(c=dpos(disp_fpc[0],disp_fpc[1]+disp_fpc[3])) translate([c[0],c[1],-1]) rrect(disp_fpc[2],disp_fpc[3],pT+2,2);
    // okno nad złączem zasilania ekranu
    let(c=dpos(disp_pwr[0],disp_pwr[1]+disp_pwr[3])) translate([c[0],c[1],-1]) rrect(disp_pwr[2],disp_pwr[3],pT+2,2);
    // okno nad micro-USB ekranu
    let(c=dpos(disp_usb[0],disp_usb[1]+disp_usb[3])) translate([c[0],c[1],-1]) rrect(disp_usb[2],disp_usb[3],pT+2,2);
    // śruby M3 do otworów ekranu (łeb stożkowy od strony garbu)
    for(h=disp_m3) let(c=dpos(h[0],h[1])) translate([c[0],c[1],-1]){ cylinder(d=3.4,h=pT+2); translate([0,0,pT+1-1.6]) cylinder(d1=3.4,d2=6.6,h=1.61); }
    // otwory na opaski / przewody przy radiach
    for(y=[20,50]) translate([hX+hw+125, hY+hw+y, -1]) rrect(10,4,pT+2,1.5);
  }
}

// ================= GARB =================
function hump_bosses() = [[hw+5,hw+5],[hW-hw-5,hw+5],[hw+5,hH-hw-5],[hW-hw-5,hH-hw-5],[hW/2+10,hw+5],[hW/2+10,hH-hw-5]];
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
    // dach: kratka nad radiami
    translate([hw+102, hw+8, hD-hw-12]) hexgrid(58, 66, 20);
    // górna ścianka: szczeliny wentylacyjne przy Pi
    for(i=[0:5]) translate([hw+st[0]+42+i*7, hH-hw-1, 10]) rrect(3.5, hw+2, 26, 1.7);
    // SMA 6.6 mm
    for(s=sma_top)   translate([hw+s[0], hH-hw-1, sma_z]) rotate([-90,0,0]) cylinder(d=6.6,h=hw+2);
    for(s=sma_right) translate([hW-hw-1, hw+s[0], sma_z]) rotate([0,90,0]) cylinder(d=6.6,h=hw+2);
  }
  // słupki M3 (wkładki 4.2 mm)
  for(p=hump_bosses()) translate([p[0],p[1],0]) difference(){
    cylinder(d=8,h=12); translate([0,0,-1]) cylinder(d=4.2,h=9);
  }
  // docisk pakietu od dachu
  translate([hw+st[0]+20, hw+st[1]+20, rail_h+stS[2]+0.5]) cube([50,4,hD-hw-rail_h-stS[2]-0.5]);
  // uchwyty na CC1101 i nRF24 na prawej ściance (pionowo)
  for(y=[56,10]) translate([hW-hw-6, hw+y, 10]) difference(){ cube([6, 30, 4]); translate([1.5,-1,1.5]) cube([1.8,32,3]); }
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
    // radia płasko na płycie
    color([0.1,0.1,0.1])   translate([100,56,0]) cube([60,23,8]);   // LoRa stick
    color([0.15,0.15,0.2]) translate([100,26,0]) cube([52,28,13]);  // ESP32-WROOM-32U
    color([0.1,0.55,0.2])  translate([100,3,0])  cube([55,20,6]);   // Zigbee (płytka)
    // pionowo przy prawej ściance
    color([0.1,0.35,0.6])  translate([hW-2*hw-6,58,12]) cube([1.6,28,15]);  // CC1101
    color([0.1,0.1,0.1])   translate([hW-2*hw-6,12,12]) cube([1.6,28,16]);  // nRF24 PA
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
  translate([-1,-1,-1]) cube([plate_cut+1, fH+2, 50]);
  for(y=dt_y) translate([plate_cut,y,-1]) linear_extrude(50)
    offset(delta=extra) polygon([[-0.01,-4],[8,-6.5],[8,6.5],[-0.01,4]]);
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
