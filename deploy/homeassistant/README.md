# KANELO na Raspberry Pi z Home Assistant OS

Na Home Assistant OS nie ma `apt`, więc strona działa jako lokalny dodatek **KANELO Web**
(nginx, port 8080). Pliki strony leżą w `/share/kanelo`, a buduje je skrypt `ha-setup.sh`
uruchamiany w dodatku **Terminal & SSH**.

## Instalacja

1. W terminalu HA wklej:
   ```bash
   curl -fsSL https://raw.githubusercontent.com/kszyysiek/grarzynka/claude/intelligent-faraday-qyy48m/deploy/homeassistant/ha-setup.sh | bash
   ```
   Budowanie trwa kilka minut.
2. Skrypt sam instaluje i uruchamia dodatek. Gdyby się nie udało: **Ustawienia → Dodatki → Sklep z dodatkami → ⋮ → Sprawdź aktualizacje**.
   Na dole pojawi się sekcja **Local add-ons** → **KANELO Web** → **Zainstaluj** → **Uruchom**.
3. Strona: `http://<IP Home Assistanta>:8080/`, np. `http://homeassistant.local:8080/`.

## Aktualizacja

Wklej tę samą komendę co w kroku 1. Dodatku nie trzeba restartować.

## Publiczny link

Dodatek sam otwiera darmowy link `https://….trycloudflare.com` (opcja `public_link`).
Link jest w dzienniku dodatku i w `/share/kanelo-link.txt`; zmienia się po każdym restarcie.

## Stały adres na własnej domenie

1. Dodaj domenę do darmowego konta Cloudflare (**Add a site**) i u rejestratora domeny
   zmień serwery DNS na te dwa, które poda Cloudflare.
2. Cloudflare → **Zero Trust → Networks → Tunnels → Create a tunnel** → **Cloudflared**,
   nazwa `kanelo`. Skopiuj **token** (długi ciąg po `--token` w pokazanej komendzie).
3. W tunelu, w zakładce **Public Hostname**, dodaj:
   - `www` + Twoja domena → Service **HTTP** → `localhost:80`
   - (puste) + Twoja domena → Service **HTTP** → `localhost:80`
4. Home Assistant → **Ustawienia → Dodatki → KANELO Web → Konfiguracja** → wklej token w
   `tunnel_token` → **Zapisz** → **Uruchom ponownie**.

Strona działa pod `https://www.twojadomena.pl`, także po restarcie Home Assistanta.
