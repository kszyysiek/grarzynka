# KANELO na Raspberry Pi

Strona jest budowana jako **eksport statyczny** (zwykłe pliki HTML/JS/wideo w `out/`).
Serwuje ją **nginx**, a na świat wystawia **Cloudflare Tunnel**: darmowy HTTPS, bez
otwierania portów na routerze, domowe IP zostaje ukryte, a Cloudflare buforuje film i zdjęcia.

Wymagania: Raspberry Pi 4 lub 5 (4–8 GB RAM), Raspberry Pi OS **64-bit** (Lite wystarczy),
najlepiej dysk SSD na USB zamiast karty SD, Pi podłączone kablem do routera.

## 1. Przygotuj Pi

1. W **Raspberry Pi Imager** wgraj „Raspberry Pi OS Lite (64-bit)”. W ustawieniach (ikona
   zębatki) włącz SSH, ustaw użytkownika i hasło oraz nazwę hosta, np. `kanelo`.
2. Uruchom Pi i zaloguj się z komputera: `ssh <użytkownik>@kanelo.local`.

## 2. Zainstaluj stronę (jedna komenda)

```bash
curl -fsSL https://raw.githubusercontent.com/kszyysiek/grarzynka/claude/intelligent-faraday-qyy48m/deploy/pi-setup.sh -o pi-setup.sh
bash pi-setup.sh
```

> Repo jest prywatne? Wtedy `curl` nie pobierze pliku. Zrób najpierw
> `git clone -b claude/intelligent-faraday-qyy48m https://github.com/kszyysiek/grarzynka.git ~/kanelo`
> (login: nazwa użytkownika GitHub, hasło: **Personal access token** z GitHub → Settings →
> Developer settings), a potem uruchom `bash ~/kanelo/deploy/pi-setup.sh`.

Skrypt instaluje Node 20, nginx i cloudflared, buduje stronę (na Pi 4 zajmuje to około
5–10 minut) i uruchamia ją. Na koniec wypisuje adres w sieci domowej, np. `http://192.168.1.50/`.

## 3. Publiczny adres przez Cloudflare Tunnel

Potrzebne jest darmowe konto Cloudflare i domena dodana do Cloudflare (np. `kanelo.pl`).

1. Cloudflare → **Zero Trust** → **Networks → Tunnels** → **Create a tunnel** →
   typ **Cloudflared**, nazwa `kanelo`.
2. Wybierz **Debian / arm64**. Cloudflare pokaże komendę
   `sudo cloudflared service install <TOKEN>`. Wklej ją na Pi (cloudflared jest już zainstalowany).
3. W zakładce **Public Hostname** dodaj: subdomain `www` (albo puste), domain `kanelo.pl`,
   service **HTTP** → `localhost:80`. Zapisz.

Po minucie strona działa pod `https://www.kanelo.pl`. Tunel startuje sam po każdym
restarcie Pi.

Szybki test bez domeny (adres tymczasowy, zmienia się po każdym uruchomieniu):
`cloudflared tunnel --url http://localhost:80`. Komenda wypisze link `https://….trycloudflare.com`.

## 4. Aktualizacja strony

Po każdej zmianie w repo uruchom na Pi:

```bash
bash ~/kanelo/deploy/pi-update.sh
```

Skrypt pobiera nowy kod, buduje stronę i podmienia pliki w nginx.

## Pliki

| Plik | Do czego |
|---|---|
| `nginx-kanelo.conf` | konfiguracja nginx: cache, gzip, wideo z przewijaniem (Range) |
| `pi-setup.sh` | jednorazowa instalacja na Pi |
| `pi-update.sh` | aktualizacja strony |

## Gdy coś nie działa

- `sudo systemctl status nginx` / `sudo systemctl status cloudflared`: czy usługi działają.
- Budowanie przerywa się z „heap out of memory”: Pi ma za mało RAM. Skrypt dokłada 2 GB
  swapu; na Pi z 2 GB zbuduj stronę na komputerze (`npm run build`) i skopiuj folder `out/`
  na Pi: `rsync -a --delete out/ <użytkownik>@kanelo.local:/tmp/out/`, potem na Pi
  `sudo rsync -a --delete /tmp/out/ /var/www/kanelo/`.
